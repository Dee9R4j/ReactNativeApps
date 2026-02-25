import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import {OrderWithSplitStatus} from "@/utils/food-types";
import {getAllOrdersForDebug, getNonSplitFinishedOrdersFromDB, markOrdersAsSplitInDB,} from "@/models/db/dbMethods";
import {useRouter} from "expo-router";
import SelectableOrderCard from "@components/food/SeletableOrderCard";
import {useSplitStore} from "@/state/base/SplitStore";
import {getAllSplits} from "@api/split.api";
import {useCurrentSplitStore} from "@/state/base/currentSplitStore";
import SplitHeader from "@/components/food/SplitHeader";
import BackgroundPattern from "@assets/images/food/background-image.svg";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useFocusEffect} from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import SplitConfirm from "@assets/images/food/split-confirm.svg";
import OrdersTabSelected from "@assets/images/food/split/splitselectpng.png";
import OrdersTabUnselected from "@assets/images/food/split/splitunselectpng.png";
import HistoryTileBg from "@assets/images/food/split/historytile.png";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";

export default function SplitScreen() {
    const {width: screenWidth, height: screenHeight} = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const {showSnackbar} = useSnackbar();
    const backgroundHeight = screenHeight + insets.top + insets.bottom;
    const [orders, setOrders] = useState<OrderWithSplitStatus[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    // Tabs: 'orders' | 'history'
    const [activeTab, setActiveTab] = useState<"orders" | "history">("orders");
    // History state
    const [splits, setSplits] = useState<any[]>([]);
    const [histLoading, setHistLoading] = useState<boolean>(false);

    const setSelectedOrders = useSplitStore((state) => state.setSelectedOrders);
    const setSplitId = useCurrentSplitStore((state) => state.setSplitId);

    const handleOrderSelection = (orderId: string) => {
        setSelectedOrderIds((currentSelectedIds) => {
            if (currentSelectedIds.includes(orderId)) {
                return currentSelectedIds.filter((id) => id !== orderId);
            } else {
                return [...currentSelectedIds, orderId];
            }
        });
    };
    const router = useRouter();
    const widthScale = screenWidth / 393;
    const headerPadding = 25 * widthScale;
    const contentPaddingStyle = useMemo(
        () => ({
            paddingHorizontal: headerPadding,
        }),
        [headerPadding]
    );

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            console.log("SplitScreen: useFocusEffect triggered. Fetching orders...");

            const fetchOrders = async () => {
                if (isActive) setLoading(true);
                try {
                    console.log(
                        "SplitScreen: Calling getNonSplitFinishedOrdersFromDB..."
                    );
                    const debugFetch = async () => {
                        const allOrders = await getAllOrdersForDebug();
                        console.log(
                            "SplitScreen DEBUG: ALL ORDERS IN LOCAL DB:",
                            JSON.stringify(allOrders, null, 2)
                        );
                    };
                    debugFetch();

                    const data = await getNonSplitFinishedOrdersFromDB();

                    console.log(
                        "SplitScreen: Fetched data from DB:",
                        JSON.stringify(data, null, 2)
                    );
                    console.log(
                        `SplitScreen: Found ${data.length} non-split, finished orders.`
                    );

                    if (isActive) {
                        setOrders(data);
                        console.log("SplitScreen: React state updated with orders.");
                    }
                } catch (err: any) {
                    console.error("SplitScreen: Error fetching orders from SQLite", err);
                } finally {
                    if (isActive) {
                        setLoading(false);
                        console.log(
                            "SplitScreen: Fetch complete, setting loading to false."
                        );
                    }
                }
            };

            fetchOrders();

            return () => {
                console.log(
                    "SplitScreen: useFocusEffect cleaning up (screen unfocused)."
                );
                isActive = false;
            };
        }, [])
    );


    const fetchSplits = useCallback(async () => {
        setHistLoading(true);
        try {
            const result = await getAllSplits();
            const arr = Array.isArray(result.data) ? result.data : [];
            setSplits(arr);
        } catch (err: any) {
            setSplits([]);
        } finally {
            setHistLoading(false);
        }
    }, []);

    // Refetch history when screen regains focus and history tab is active
    useFocusEffect(
        useCallback(() => {
            if (activeTab === "history") {
                fetchSplits();
            }
        }, [activeTab, fetchSplits])
    );

    // Load history when tab switches to history the first time (or always refresh)
    useEffect(() => {
        if (activeTab === "history") {
            fetchSplits();
        }
    }, [activeTab, fetchSplits]);

    const handleSplitPress = async () => {
        const selectedOrders = orders.filter((order) =>
            selectedOrderIds.includes(order.id.toString())
        );
        setSelectedOrders(selectedOrders);
        router.push("/private/home/split_others/friends");
        setSelectedOrderIds([]);
    };

    const selectedCount = selectedOrderIds.length;

    return (
        <View style={styles.container}>
            <View pointerEvents="none" style={styles.backgroundLayer}>
                <BackgroundPattern
                    width={screenWidth}
                    height={backgroundHeight}
                    preserveAspectRatio="xMidYMid slice"
                />
            </View>
            <SplitHeader title="SPLIT"/>
            {/* Tabs under header */}
            <View style={[styles.tabsRow, contentPaddingStyle]}>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => setActiveTab("orders")}
                    activeOpacity={0.8}
                >
                    <Image
                        source={
                            activeTab === "orders" ? OrdersTabSelected : OrdersTabUnselected
                        }
                        style={styles.tabImage}
                        resizeMode="stretch"
                    />
                    <View pointerEvents="none" style={styles.tabTextWrap}>
                        <Text style={styles.tabText}>ORDERS</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() => setActiveTab("history")}
                    activeOpacity={0.8}
                >
                    <Image
                        source={
                            activeTab === "history" ? OrdersTabSelected : OrdersTabUnselected
                        }
                        style={styles.tabImage}
                        resizeMode="stretch"
                    />
                    <View pointerEvents="none" style={styles.tabTextWrap}>
                        <Text style={styles.tabText}>HISTORY</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {activeTab === "orders" ? (
                <View style={styles.mainContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FFFFFF"/>
                            <Text style={styles.loadingText}>Loading finished orders...</Text>
                        </View>
                    ) : orders.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>
                                Finished orders show up here.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={orders}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({item}) => (
                                    <SelectableOrderCard
                                        order={item}
                                        isSelected={selectedOrderIds.includes(item.id.toString())}
                                        onSelect={() => handleOrderSelection(item.id.toString())}
                                    />
                                )}
                                contentContainerStyle={[
                                    styles.listContent,
                                    {paddingHorizontal: headerPadding},
                                ]}
                                showsVerticalScrollIndicator={false}
                            />
                            {selectedCount > 0 && (
                                <>
                                    <LinearGradient
                                        colors={["rgba(26, 26, 26, 0.0)", "#1a1a1a"]}
                                        style={styles.fadeEffect}
                                    />
                                    <View style={styles.splitButtonContainer}>
                                        <TouchableOpacity
                                            style={styles.splitButton}
                                            onPress={handleSplitPress}
                                        >
                                            <View style={StyleSheet.absoluteFill}>
                                                <SplitConfirm
                                                    width="100%"
                                                    height="100%"
                                                    preserveAspectRatio="xMidYMid slice"
                                                />
                                            </View>
                                            <Text style={styles.splitButtonText}>
                                                PROCEED TO SPLIT ({selectedCount})
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.mainContainer}>
                    {histLoading ? (
                        <ActivityIndicator
                            size="large"
                            color="#FFFFFF"
                            style={{marginTop: 24}}
                        />
                    ) : splits.length === 0 ? (
                        <Text style={styles.historyEmpty}>
                            Place an order to get history.
                        </Text>
                    ) : (
                        <FlatList
                            data={splits}
                            keyExtractor={(item) => String(item.id)}
                            contentContainerStyle={{
                                paddingVertical: 12,
                                paddingHorizontal: headerPadding,
                            }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) => {
                                const name = item?.user?.name ?? "Unknown";
                                const images: string[] = Array.isArray(item?.vendor_images)
                                    ? item.vendor_images
                                    : [];
                                const preview = images.slice(0, 3);
                                const extra = Math.max(0, images.length - preview.length);
                                const statusCompleted = !!item?.is_completed;

                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            if (item.locked === true && item.is_owner === true) {
                                                router.push({
                                                    pathname: "/private/home/split_others/split-status",
                                                    params: { split_id: item.id },
                                                })
                                            } else if (item.locked === true && item.is_owner === false) {
                                                router.push({
                                                    pathname: "/private/home/split_others/split-approve",
                                                    params: { split_id: item.id },
                                                });
                                            } else if (item.locked === false && item.is_owner === true) {
                                                router.push({
                                                    pathname: "/private/home/split_others/split-bill",
                                                    params: { split_id: item.id },
                                                });
                                            } else if (item.locked === true && item.is_owner === false && item.is_completed === true) {
                                                router.push({
                                                    pathname: "/private/home/split_others/split-status",
                                                    params: { split_id: item.id },
                                                });
                                            } else if (item.locked === false && item.is_owner === false && item.is_completed === false) {
                                                showSnackbar({ message:"Pending Split, The owner hasn't finalized this split yet.", type: "error" })
                                            }
                                        }}
                                    >
                                        <ImageBackground
                                            source={HistoryTileBg}
                                            resizeMode="stretch"
                                            style={styles.histTile}
                                            imageStyle={styles.histTileImage}
                                        >
                                            <View style={styles.histHeaderRow}>
                                                <Text style={styles.histTitle}>{name + "’s Split"}</Text>
                                                <Text style={styles.histAmount}>₹{item.current_amount}</Text>
                                            </View>

                                            <View style={styles.histVendorsRow}>
                                                <View style={styles.vendorLogosRow}>
                                                    {preview.map((uri, idx) => (
                                                        <Image key={idx} source={{ uri }} style={styles.vendorImg} />
                                                    ))}
                                                    {extra > 0 && (
                                                        <Text style={styles.vendorExtraText}>{`+${extra}`}</Text>
                                                    )}
                                                </View>
                                                <View
                                                    style={[
                                                        styles.statusPill,
                                                        statusCompleted ? styles.statusDone : styles.statusNotDone,
                                                    ]}
                                                >
                                                    <Text style={styles.statusText}>
                                                        {statusCompleted ? "Completed" : "Not Completed"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>

                                );
                            }}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    tabsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        gap: 12,
    },
    tabButton: {
        flex: 1,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    tabImage: {
        width: "100%",
        height: "100%",
    },
    tabTextWrap: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    tabText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "The Last Shuriken",
        letterSpacing: 1,
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    mainContainer: {
        flex: 1,
        paddingTop: 12,
        backgroundColor: "transparent",
    },
    fadeEffect: {
        position: "absolute",
        bottom: 80,
        left: 16,
        right: 16,
        height: 50,
        zIndex: 1,
    },
    splitButtonContainer: {
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        borderWidth: 2,
        borderColor: "#fff",
        zIndex: 2,
    },
    splitButton: {
        backgroundColor: "#8C0500",
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    splitButtonText: {
        color: "white",
        fontSize: 18,
        fontFamily: "The Last Shuriken",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 140,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    loadingText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginTop: 10,
        fontFamily: "The Last Shuriken",
    },
    // History styles - redesigned tile
    histTile: {
        width: "105%",
        minHeight: 84,
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "center",
    },
    histTileImage: {
        borderRadius: 0,
    },
    histHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    histTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    histAmount: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginRight: 25,
    },
    histVendorsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    vendorLogosRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    vendorImg: {
        width: 40,
        height: 36,
        borderRadius: 0,
        backgroundColor: "#111",
    },
    vendorExtraText: {
        color: "#fff",
        fontSize: 12,
        marginLeft: -3,
    },
    statusPill: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 0,
        marginRight: 16,
        width: 110,
        alignItems: "center",
        justifyContent: "center",
    },
    statusDone: {backgroundColor: "#16a34a"},
    statusNotDone: {backgroundColor: "#dc2626"},
    statusText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
        textAlign: "center",
    },
    historyEmpty: {color: "#aaa", marginTop: 24, textAlign: "center"},
});
