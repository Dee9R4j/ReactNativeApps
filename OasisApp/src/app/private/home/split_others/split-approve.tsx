import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import SplitOrderCard from "@components/food/SplitOrderCard";
import {getSplitStatus, approveSplit} from "@api/split.api";
import {simulateNetworkDelay} from "@/api/dummyData";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuth} from "@/hooks/useAuthentication";
import SplitHeader from "@components/food/SplitHeader";
import LinearGradient from 'react-native-linear-gradient';
import SplitPattern from "@assets/images/food/button-pattern.svg"
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import OrangeRecSvg from "@assets/images/food/split/orange_rec.svg";
import BackgroundImageSvg from "@assets/images/food/background-image.svg";
import SplitConfirm from "@assets/images/food/split-confirm.svg"
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";


export interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    is_veg: boolean;
    total_price: number;
}

export interface Order {
    id: number;
    vendor_name: string;
    items: OrderItem[];
    transaction_id: number | null;
    status: number;
    price: number;
    otp: number;
    otp_seen: boolean;
    timestamp: string;
    is_split: boolean;
    shell: number;
    vendor: { id: number; name: string; image_url: string; };
    order_image_url: string;
    rating: null;
}

interface SplitUser {
    id: number;
    name: string;
    pfp_url: string;
}

interface SplitMember {
    id: number;
    user: SplitUser;
    status: number;
    amount: number;
    decided_at: string | null;
    split: number;
}

interface Split {
    id: number;
    user: SplitUser;
    locked: boolean;
    date: string;
    current_amount: number;
    is_completed: boolean;
    is_owner: boolean | null;
}

interface Participant {
    user_id: string;
    name: string;
    user_amount: number;
    is_owner: boolean;
}

interface SplitDetails {
    selectedOrders: Order[];
    participants: Participant[];
}

interface ApiResponse {
    split: Split;
    split_members: SplitMember[];
    user0_amount: number;
    split_url: string;
    orders: Order[];
}


// @ts-ignore
const ViewSplitScreen = ({navigation, route}) => {
    const {width: screenWidth, height: screenHeight} = useWindowDimensions();
    const {showSnackbar} = useSnackbar();
    const insets = useSafeAreaInsets();
    const backgroundHeight = screenHeight + insets.top + insets.bottom;

    const {split_id} = useLocalSearchParams<{ split_id: string }>();
    console.log('split id from notification', split_id);

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [splitDetails, setSplitDetails] = useState<SplitDetails | null>(null);

    const {isAuthenticating, authenticateUser} = useAuth();

    const logApiError = (error: any, context: string) => {
        console.error(`❌ Error ${context}:`, error.message);
        if (error.response) {
            console.error("   Error Data:", error.response.data);
            console.error("   Error Status:", error.response.status);
            console.error("   Error Headers:", error.response.headers);
        } else if (error.request) {
            console.error("   Error Request:", error.request);
        } else {
            console.error("   Error Config:", error.config);
        }
    };

    useEffect(() => {
        const fetchSplitDetails = async () => {
            setIsLoading(true);
            setError(null);
            console.log(`Attempting to fetch details for split_id: ${split_id}`);

            try {
                const result = await getSplitStatus(Number(split_id));

                const data: any = result.data;
                console.log("API Response Received:", JSON.stringify(data, null, 2));

                // Mock data may not have the full nested structure, handle gracefully
                const participants: Participant[] = [];
                if (data?.split?.user) {
                    participants.push({
                        user_id: data.split.user.id.toString(),
                        name: data.split.user.name,
                        user_amount: data.user0_amount || 0,
                        is_owner: true,
                    });
                }
                if (data?.split_members) {
                    for (const member of data.split_members) {
                        participants.push({
                            user_id: member.user.id.toString(),
                            name: member.user.name,
                            user_amount: member.amount,
                            is_owner: false,
                        });
                    }
                }

                const selectedOrders: Order[] = (data?.orders || []).map((apiOrder: any) => {
                    return {
                        id: apiOrder.id,
                        vendor_name: apiOrder.vendor_name || apiOrder.vendor?.name || "Unknown Vendor",
                        vendor_image: apiOrder.vendor?.image_url || null,
                        items: apiOrder.items || [],
                        transaction_id: apiOrder.transaction_id || null,
                        status: apiOrder.status,
                        price: apiOrder.price,
                        otp: apiOrder.otp,
                        otp_seen: apiOrder.otp_seen,
                        timestamp: apiOrder.timestamp,
                        is_split: apiOrder.is_split,
                        shell: apiOrder.shell,
                        vendor: apiOrder.vendor,
                        order_image_url: apiOrder.order_image_url,
                        rating: apiOrder.rating,
                    };
                });

                const mappedData: SplitDetails = {
                    selectedOrders,
                    participants,
                };

                setSplitDetails(mappedData);
            } catch (err: any) {
                logApiError(err, "fetching split details");
                setError("Failed to fetch split details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (split_id) {
            fetchSplitDetails();
        } else {
            console.warn("No split_id found in local search params.");
            setError("No Split ID provided.");
        }
    }, [split_id]);



    const handleConfirm = async () => {
        try {
            const isAuth = await authenticateUser();
            if (!isAuth) {
                showSnackbar({ message: "Authentication required to access QR screen.", type: "error" });
                return;
            }
            await simulateNetworkDelay(500, 1000);
            console.log("[Mock] Split accepted:", split_id);
            
            showSnackbar({ message: "Split accepted!", type: "success" });
            router.replace({
                pathname: "/private/home/split_others/split-status",
                params: {split_id: split_id},
            });
        } catch (err: any) {
            console.error("Error during confirm process:", err);
            showSnackbar({ message: "Failed to accept split.", type: "error" });
        }
    };


    const handleCancel = async () => {
        console.log("Attempting to REJECT split...");
        try {
            await simulateNetworkDelay(500, 1000);
            console.log("[Mock] Split rejected:", split_id);

            showSnackbar({ message: "Split rejected", type: "success" });

            router.replace({
                pathname: "/private/home/split_others/split-status",
                params: {split_id: split_id},
            });

        } catch (err: any) {
            showSnackbar({ message: "Failed to reject split.", type: "error" });
        }
    };


    const renderParticipantItem: ListRenderItem<Participant> = ({item}) => {
        const displayName = item.is_owner ? `${item.name} (Owner)` : item.name;
        const displayInitial = item.name?.[0]?.toUpperCase() ?? "?";

        return (
            <View style={styles.cardContainer}>
                <View style={StyleSheet.absoluteFill}>
                    <SplitPattern
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                    />
                </View>

                <View style={styles.leftSection}>
                    <View style={styles.recentAvatarTile}>
                        <OrangeRecSvg
                            width="100%"
                            height="100%"
                            style={styles.tileBgSvg}
                        />
                        <Text style={styles.recentAvatarInitial}>{displayInitial}</Text>
                    </View>
                    <Text style={styles.friendName}>{displayName}</Text>
                </View>

                <View style={styles.amountInputRow}>
                    <Text
                        style={[
                            styles.amountInputBase,
                            styles.amountInputReadOnly,
                        ]}
                    >
                        ₹ {item.user_amount.toFixed(2)}
                    </Text>
                </View>
            </View>
        );
    };

    const renderListHeader = () => {
        if (!splitDetails) return null;
        return (
            <View style={styles.invitedHeaderRow}>
                <Text style={styles.invitedHeader}>
                    Members ({splitDetails.participants.length})
                </Text>
            </View>
        );
    };


    const renderMainContent = () => {
        if (isLoading) {
            return (
                <ActivityIndicator
                    size="large"
                    color="#FF8C00"
                    style={{marginTop: 50}}
                />
            );
        }

        if (error) {
            return <Text style={styles.errorText}>{error}</Text>;
        }

        if (!splitDetails) {
            return <Text style={styles.errorText}>No details found.</Text>;
        }

        return (
            <>
                <View style={styles.orderContainer}>
                    <SplitOrderCard currencySymbol="₹" selectedOrders={splitDetails?.selectedOrders}/>
                </View>

                <FlatList
                    data={splitDetails.participants}
                    keyExtractor={(item) => item.user_id.toString()}
                    ListHeaderComponent={renderListHeader}
                    renderItem={renderParticipantItem}
                    contentContainerStyle={{paddingBottom: 40}}
                    nestedScrollEnabled
                />
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <View style={styles.container}>
                <View pointerEvents="none" style={styles.backgroundLayer}>
                    <BackgroundImageSvg
                        width={screenWidth}
                        height={backgroundHeight}
                        preserveAspectRatio="xMidYMid slice"
                    />
                    <View style={styles.darkenOverlay} />
                </View>

                <SplitHeader
                    title="SPLIT"
                    onBackPress={() => router.replace("/private/home/food/split")}
                />

                <View style={styles.contentWrapper}>
                    <ScrollView
                        style={styles.mainContainer}
                        contentContainerStyle={styles.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        {renderMainContent()}
                    </ScrollView>

                    <View style={styles.footerContainer}>
                        <LinearGradient
                            colors={["rgba(26, 26, 26, 0.0)", "#1a1a1a"]}
                            style={styles.fadeEffect}
                        />
                        <TouchableOpacity
                            style={styles.splitConfirm}
                            onPress={handleConfirm}
                        >
                            <View style={StyleSheet.absoluteFill}>
                                <SplitConfirm
                                    width="100%"
                                    height="100%"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </View>
                            <Text style={styles.confirmButtonText}>PAY MONEY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.declineButton}
                            onPress={handleCancel}
                        >
                            <Text style={styles.declineButtonText}>Decline Payment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
        backgroundColor: "#1a1a1a",
    },
    darkenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000000",
        opacity: 0.4,
        zIndex: 1
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "space-between",
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContentContainer: {
        paddingTop: 20,
        paddingBottom: 150,
    },
    orderContainer: {
        marginBottom: 20,
    },
    invitedHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 10,
    },
    invitedHeader: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "#ff4d4d",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },

    cardContainer: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        paddingHorizontal: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ffffff",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    recentAvatarTile: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    tileBgSvg: {
        ...StyleSheet.absoluteFillObject,
    },
    recentAvatarInitial: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    friendName: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Quattrocento Sans",
        flex: 1,
    },
    amountInputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    amountInputBase: {
        color: "#fff",
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 80,
        textAlign: "right",
        fontFamily: "Quattrocento Sans",
    },
    amountInputReadOnly: {
        backgroundColor: "transparent",
        color: "#ccc",
        fontFamily: "Quattrocento Sans",
    },

    footerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    fadeEffect: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    splitConfirm: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ffffff",
        backgroundColor: "#8C0500",
    },
    confirmButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontFamily: 'The Last Shuriken'
    },
    declineButton: {
        marginTop: 16,
    },
    declineButtonText: {
        color: "#aaa",
        fontSize: 18,
        fontFamily: 'Proza Libre',
        textDecorationLine: "underline",
    },
});

export default ViewSplitScreen;