import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ImageBackground,
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import {useSplitStore} from "@/state/base/SplitStore";
import SplitOrderCard from "@components/food/SplitOrderCard";
import {getSplitStatus, approveSplit, createSplit} from "@api/split.api";
import {simulateNetworkDelay} from "@/api/dummyData";
import {useCurrentSplitStore} from "@/state/base/currentSplitStore";
import {useSecureStore} from "@/state/secure/secure";
import SplitPattern from "@assets/images/food/button-pattern.svg";
import SplitConfirm from "@assets/images/food/split-confirm.svg";
import LinearGradient from "react-native-linear-gradient";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import BackgroundImageSvg from "@assets/images/food/background-image.svg";
import SplitHeader from "@components/food/SplitHeader";
import EditButton from "@assets/images/food/edit.svg";
import OrangeRecSvg from "@assets/images/food/split/orange_rec.svg";
import {posthog} from "@utils/posthog";


type Friend = {
    user_id: number;
    name: string;
    status: string;
    user_amount: number;
};

type SplitOrder = {
    id: number;
    vendor_name: string;
    items: any[];
    transaction_id: string;
    status: string;
    price: number;
    otp: string;
    otp_seen: boolean;
    timestamp: string;
};

interface SplitItem {
    user_id: number;
    user_amount: number;
}

interface SplitPayload {
    split_id: number;
    split_list: SplitItem[];
}

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

export default function SplitBillScreen() {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const backgroundHeight = screenHeight + insets.top + insets.bottom;

    const router = useRouter();

    const { split_id, approvedFriends } = useLocalSearchParams();
    const splitIdParam = split_id ? Number(split_id) : null;

    const splitId = useCurrentSplitStore((state) => state.splitId);

    const finalSplitId = splitIdParam || splitId || null;

    const setSplitId = useCurrentSplitStore((state) => state.setSplitId);

    const selectedOrders = useSplitStore((state) => state.selectedOrders);
    const setSelectedOrders = useSplitStore((state) => state.setSelectedOrders);
    const currentUserId = useSecureStore((state) => state.user_id);

    const [loading, setLoading] = useState(false);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const totalAmount = (selectedOrders ?? []).reduce(
        (sum, o) => sum + (o.price ?? (o as any).amount ?? 0),
        0
    );

    useEffect(() => {
        if (selectedOrders.length === 0 && splitIdParam) {
            const fetchSplitOrders = async () => {
                try {
                    const result = await getSplitStatus(splitIdParam);
                    const splitData: any = result.data;

                    if (splitData && Array.isArray(splitData.orders)) {
                        const mappedOrders = splitData.orders.map((apiOrder: any) => ({
                            id: apiOrder.id,
                            vendor_name: apiOrder.vendor_name,
                            vendor_image: apiOrder.vendor?.image_url,
                            background_image:
                                splitData.vendor_images?.[apiOrder.vendor?.id]?.[0] ||
                                splitData.vendor_images?.[0] ||
                                null,
                            background_color:
                                splitData.vendor_images?.[apiOrder.vendor?.id]?.[1] || "#1a1a1a",
                            items: apiOrder.items,
                            transaction_id: apiOrder.transaction_id,
                            status: apiOrder.status,
                            price: apiOrder.price,
                            otp: apiOrder.otp,
                            otp_seen: apiOrder.otp_seen,
                            timestamp: apiOrder.timestamp,
                            is_split: apiOrder.is_split,
                        }));

                        setSelectedOrders(mappedOrders);
                    }

                    setSplitId(splitIdParam);
                } catch (err: any) {
                    console.error("Error fetching split details:", err);
                }
            };
            fetchSplitOrders();
        }
    }, [splitIdParam]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    const approvedFriendsStr = Array.isArray(approvedFriends)
        ? approvedFriends[0]
        : approvedFriends || "[]";

    const friends: Omit<Friend, "user_amount">[] = JSON.parse(approvedFriendsStr);
    const allFriends = useMemo(() => {
        const parsed: Omit<Friend, "user_amount">[] =
            JSON.parse(approvedFriendsStr);
        if (currentUserId == null) return parsed;
        return [{user_id: currentUserId, name: "You"}, ...parsed];
    }, [approvedFriendsStr, currentUserId]);


    const [mode, setMode] = useState<"even" | "custom">("even");
    const [error, setError] = useState<string>("");

    // @ts-ignore
    const addButtoRef = useRef<Pressable>(null);

    const [friendAmounts, setFriendAmounts] = useState<
        Array<{ user_id: number; name: string; user_amount: number }>
    >([]);

    const [friendStatuses, setFriendStatuses] = useState<
        Record<number, "hidden" | "pending">
    >({});

    const name = useSecureStore((state) => state.name);

    useEffect(() => {
        if (!allFriends || allFriends.length === 0) return;
        setFriendAmounts(
            allFriends.map((f) => ({
                user_id: f.user_id,
                name: f.name,
                user_amount: 0,
            }))
        );
        const statuses = allFriends.reduce((acc, f) => {
            acc[f.user_id] = "hidden";
            return acc;
        }, {} as Record<number, "hidden" | "pending">);
        setFriendStatuses(statuses);
    }, [allFriends]);

    useEffect(() => {
        if (mode === "even" && totalAmount > 0 && allFriends.length > 0) {
            const totalPeople = allFriends.length;
            const baseAmount = Math.floor(totalAmount / totalPeople);
            const remainder = totalAmount % totalPeople;

            const updatedAmounts = allFriends.map((friend, index) => {
                const finalAmount = index < remainder ? baseAmount + 1 : baseAmount;

                return {...friend, user_amount: finalAmount};
            });

            setFriendAmounts(updatedAmounts);
        }
    }, [mode, totalAmount, allFriends]);

    const currentTotal = useMemo(
        () => friendAmounts.reduce((sum, f) => sum + f.user_amount, 0),
        [friendAmounts]
    );
    const remainingAmount = totalAmount - currentTotal;

    const handleAmountChange = useCallback((id: number, value: string) => {
        setFriendAmounts((prev) =>
            prev.map((f) =>
                f.user_id === id ? {...f, user_amount: parseFloat(value) || 0} : f
            )
        );
    }, []);

    const handleAddRemove = () => {
        router.replace({
            pathname: "/private/home/split_others/friends",
        });
    };

    const handleSubmit = async () => {
        if (mode === "custom" && remainingAmount !== 0) {
            Alert.alert(
                `Custom split must equal total.`,
                `The amounts entered do not add up to ₹${totalAmount.toFixed(
                    2
                )}. Please adjust.`
            );
            return;
        }

        const friendsToSubmit = friendAmounts.filter(
            (person) => person.user_id !== currentUserId
        );

        const payload = {
            split_id: splitId,
            split_list: friendsToSubmit.map((f) => ({
                user_id: f.user_id,
                user_amount: f.user_amount,
            })),
        };

        try {
            setLoading(true)
            await simulateNetworkDelay(500, 1000);
            console.log("[Mock] Split members added:", payload);

            setFriendStatuses((prev) => {
                const updated = {...prev};
                friendsToSubmit.forEach((f) => {
                    updated[f.user_id] = "pending";
                });
                return updated;
            });
            posthog.capture('split-confirmed')
            router.replace({
                pathname: "/private/home/split_others/split-status",
                params: {
                    finalAmounts: JSON.stringify(friendAmounts),
                    split_id: finalSplitId,
                },
            });
        } catch (error: any) {
            Alert.alert("Error", error?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const isEditable = mode === "custom";


    const renderListHeader = () => (
        <View style={styles.invitedHeaderRow}>
            <Text style={styles.invitedHeader}>Members ({allFriends.length})</Text>

            <View style={styles.invitedButtons}>
                <TouchableOpacity
                    ref={addButtoRef}
                    style={[styles.invitedButton, styles.addButton]}
                    onPress={handleAddRemove}
                >
                    <Text style={[styles.invitedButtonText, styles.addText]}>Add/Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMemberCard = useCallback(({item}: {
            item: { user_id: number; name: string; user_amount: number };
        }) => {
            const isOwner = item.user_id === currentUserId;
            const displayName = isOwner ? `${name} (Owner)` : item.name;
            const displayInitial = (isOwner
                ? name?.[0]?.toUpperCase()
                : item.name?.[0]?.toUpperCase()) ?? "?";

            return (
                <View style={styles.cardOuter}>
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
                            <TextInput
                                style={[
                                    styles.amountInputBase,
                                    isEditable ? styles.amountInputEditable : styles.amountInputReadOnly,
                                    mode === "even" && {backgroundColor: "transparent"},
                                ]}
                                editable={isEditable}
                                keyboardType="numeric"
                                value={`₹ ${String(item.user_amount ?? 0)}`}
                                onChangeText={(val) => {
                                    const numericValue = val.replace(/[^0-9.]/g, "");
                                    handleAmountChange(item.user_id, numericValue);
                                }}
                            />
                            {mode === "custom" && (
                                <Pressable style={styles.editIconWrapper} hitSlop={10}>
                                    <EditButton width={18} height={18}/>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            );
        },
        [currentUserId, name, isEditable, mode, handleAmountChange]
    );

    return (
        <SafeAreaView style={{flex: 1}} edges={["bottom"]}>
            <View style={styles.container}>
                    <View pointerEvents="none" style={styles.backgroundLayer}>
                        <BackgroundImageSvg
                            width={screenWidth}
                            height={backgroundHeight}
                            preserveAspectRatio="xMidYMid slice"
                        />
                        <View style={styles.darkenOverlay} />
                    </View>

                    <SplitHeader title="SPLIT"/>

                    <View style={styles.innerPadding}>
                        <View style={styles.modeSwitch}>
                            <Pressable
                                onPress={() => setMode("even")}
                            >
                                <ImageBackground
                                    source={require("@assets/images/food/even2.png")}
                                    style={[
                                        styles.imageButton,
                                        mode !== "even" && { backgroundColor: "#230000" }
                                    ]}
                                    imageStyle={[
                                        styles.imageStyle,
                                        mode !== "even" && { opacity: 0 }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.modeText,
                                            mode === "even" && styles.modeTextActive,
                                        ]}
                                    >
                                        Even Split
                                    </Text>
                                </ImageBackground>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    setMode("custom");
                                    if (
                                        friendAmounts.reduce((sum, f) => sum + f.user_amount, 0) ===
                                        0
                                    ) {
                                        const totalPeople = allFriends.length;
                                        const baseAmount = Math.floor(totalAmount / totalPeople);
                                        const remainder = totalAmount % totalPeople;
                                        const updatedAmounts = allFriends.map((friend, index) => {
                                            const finalAmount =
                                                index < remainder ? baseAmount + 1 : baseAmount;
                                            return {...friend, user_amount: finalAmount};
                                        });
                                        setFriendAmounts(updatedAmounts);
                                    }
                                }}
                            >
                                <ImageBackground
                                    source={require("@assets/images/food/even2.png")}
                                    style={[
                                        styles.imageButton,
                                        mode !== "custom" && { backgroundColor: "#230000" }
                                    ]}
                                    imageStyle={[
                                        styles.imageStyle,
                                        mode !== "custom" && { opacity: 0 }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.modeText,
                                            mode === "custom" && styles.modeTextActive,
                                        ]}
                                    >
                                        Custom Split
                                    </Text>
                                </ImageBackground>
                            </Pressable>
                        </View>

                        <View style={styles.orderContainer}>
                            <SplitOrderCard currencySymbol="₹"/>
                        </View>
                    </View>
                    <FlatList
                        data={friendAmounts}
                        keyExtractor={(item) => item.user_id.toString()}
                        ListHeaderComponent={renderListHeader()}
                        renderItem={renderMemberCard}
                        contentContainerStyle={styles.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="on-drag"
                        removeClippedSubviews={false}
                    />

                    {!isKeyboardVisible && (
                        <View style={[styles.footerContainer]}>
                        <LinearGradient
                            colors={["rgba(26, 26, 26, 0.0)", "#1a1a1a"]}
                            style={styles.fadeEffect}
                        />
                        <TouchableOpacity
                            style={[
                                styles.splitConfirm,
                                mode === "custom" &&
                                remainingAmount.toFixed(2) !== "0.00" &&
                                styles.confirmButtonDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={
                                loading ||
                                (mode === "custom" && remainingAmount.toFixed(2) !== "0.00")
                            }
                        >
                            <View style={StyleSheet.absoluteFill}>
                                <SplitConfirm width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                            </View>

                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.confirmButtonText}>CONFIRM SPLIT</Text>
                            )}
                        </TouchableOpacity>

                        </View>
                    )}

                    {mode === "custom" && (
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.amountSummary}>₹{(totalAmount - remainingAmount).toFixed(0)} of ₹{totalAmount.toFixed(0)}</Text>

                                <Text
                                    style={[
                                        styles.remainingAmount,
                                        { color: remainingAmount < 0 ? 'red' : '#02BB37' }
                                    ]}
                                >
                                    (₹{remainingAmount.toFixed(0)} left)
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    darkenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000000",
        opacity: 0.4,
        zIndex: 1
    },
    contentWrapper: {
        flex: 1,
        overflow: "hidden",
    },
    innerPadding: {
        paddingHorizontal: 18,
        paddingVertical: 18,
    },
    scrollContentContainer: {
        paddingBottom: 50,
        paddingTop: 8,
    },
    orderContainer: {
        marginBottom: 20,
    },
    modeSwitch: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        marginVertical: 8,
    },
    imageButton: {
        width: 170,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff",
        overflow: "hidden",
        backgroundColor: "#8C0600",
    },
    imageStyle: {
        resizeMode: "cover",
    },
    inactiveButton: {
        opacity: 0.25,
    },
    modeText: {
        color: "#ffffff",
        fontFamily: "Proza Libre Bold",
        fontSize: 16,
    },
    modeTextActive: {
        color: "#fff",
        fontFamily: "Proza Libre Bold",
    },

    summaryContainer: {
        marginBottom: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    summaryTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4,
    },
    summaryLabel: {
        color: "#b0b0b0",
        fontSize: 16,
    },
    amountSummary: {
        fontSize: 18,
        fontFamily: "Quattrocento Sans",
        color: "#ffffff",
    },
    remainingAmount: {
        fontSize: 18,
        color: "#02BB37",
        fontFamily: "Quattrocento Sans",
    },
    summaryValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    remainingError: {
        color: "#ff4d4d",
    },
    remainingSuccess: {
        color: "#34d399",
    },

    cardOuter: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },

    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        backgroundColor: "#1a1a1a",
        borderWidth: 2,
        borderColor: "#C0C0C0",
        overflow: "hidden",
        minHeight: 60,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        paddingLeft: 12
    },
    recentAvatarTile: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    tileBgSvg: {
        position: "absolute",
        left: 0,
        top: 0,
    },
    recentAvatarInitial: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
    },
    friendName: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Quattrocento Sans",
        paddingLeft: 16,
    },
    amountInputBase: {
        color: "#fff",
        width: 100,
        textAlign: "right",
        fontSize: 18,
        fontFamily: "Quattrocento Sans Bold",
    },
    amountInputReadOnly: {
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 10,
    },
    amountInputEditable: {
        backgroundColor: "transparent",
        color: "#fff",
        padding: 10,
        fontSize: 18,
        textDecorationLine: "underline",
        fontFamily: "Quattrocento Sans Bold",
    },
    amountInputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    editIconWrapper: {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 8
    },

    invitedHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 20
    },
    invitedHeader: {
        fontSize: 18,
        fontFamily: "Proza Libre",
        color: "#ffffff",
    },
    invitedButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    invitedButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    addButton: {
        backgroundColor: "#1E8B3D",
    },
    removeButton: {
        backgroundColor: "#e74c3c",
    },
    invitedButtonText: {
        fontSize: 18,
        fontFamily: "Proza Libre",
    },
    addText: {
        color: "#fff",
    },
    removeText: {
        color: "#fff",
    },
    popoverContainer: {
        backgroundColor: "#000000",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#fffdfd",
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    popoverArrow: {
        backgroundColor: "#2a2a2a",
        borderTopColor: "#555",
    },
    popoverOverlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    popoverOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    popoverText: {
        color: "#fff",
        fontSize: 16,
    },
    popoverDivider: {
        height: 1,
        backgroundColor: "#444",
    },

    footerContainer: {
        position: "relative",
        width: "100%",
        alignItems: "center",
        paddingTop: 10,
        backgroundColor: "#1a1a1a",
        borderTopWidth: 1,
        borderTopColor: "#333",
    },
    fadeEffect: {
        position: "absolute",
        top: -50,
        width: "100%",
        height: 50,
    },
    splitConfirm: {
        height: 60,
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#8C0500",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        overflow: "hidden",
        marginVertical: 10,
    },
    confirmButtonDisabled: {
        backgroundColor: "#404040",
        borderColor: "#777777",
        opacity: 0.8,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 18,
        textTransform: "uppercase",
        fontFamily: "The Last Shuriken",
    },
    deleteButton: {
        width: 36,
        height: 36,
        backgroundColor: "#ff4444",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#ff7777",
    },
    deleteText: {
        fontSize: 18,
        color: "#fff",
    },
});
