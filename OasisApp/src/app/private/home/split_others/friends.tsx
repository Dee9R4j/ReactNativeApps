import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import BackArrow from "@assets/images/wallet/back-arrow.svg";
// import BarcodeIcon from "@assets/images/wallet/barcode-icon.svg";
import { getStatusBarHeight } from "@utils/safeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFriends as fetchFriendsAPI, generateFriendRequestUrl as genFriendUrl, createSplit } from "@api/split.api";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
import SplitHeader from "@/components/food/SplitHeader";
import BackgroundImageSvg from "@assets/images/food/background-image.svg";
import CrossIcon from "@assets/images/food/split/cross.svg";
import AddMoreSvg from "@assets/images/food/split/addmore.svg";
import RecentsBgSvg from "@assets/images/food/split/recents.svg";
import OrangeRecSvg from "@assets/images/food/split/orange_rec.svg"; // <-- new: tile bg
import ContinueSvg from "@assets/images/food/split/continur.svg";
import { useCurrentSplitStore } from "@/state/base/currentSplitStore";
import { useSplitStore } from "@/state/base/SplitStore";
import { markOrdersAsSplitInDB } from "@/models/db/dbMethods";
import axios from "axios";

type Friend = {
    user_id: number;
    name: string;
    status: "pending" | "approved" | "rejected";
};

export default function FriendsScreen() {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const backgroundHeight = screenHeight + insets.top + insets.bottom;

    const params = useLocalSearchParams();
    const qrError =
        typeof params?.qrError === "string" ? params.qrError : undefined;
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    const selectedOrders = useSplitStore((state) => state.selectedOrders);
    const setSelectedOrders = useSplitStore((state) => state.setSelectedOrders);
    const setSplitId = useCurrentSplitStore((state) => state.setSplitId);


    // Reserve scroll space so FlatList ends above the pinned Continue button.
    // Tweak these values to experiment with spacing.
    const CONTINUE_SVG_HEIGHT = 48; // height of ContinueSvg
    const CONTINUE_BUTTON_BOTTOM = 24; // styles.continueButton.bottom
    const LIST_ABOVE_BUTTON_GAP = 16; // extra gap between list last item and button
    const listBottomSpacer =
        insets.bottom +
        CONTINUE_SVG_HEIGHT +
        CONTINUE_BUTTON_BOTTOM +
        LIST_ABOVE_BUTTON_GAP +
        200;

    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchFriends = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchFriendsAPI();
            const data = result.data ?? [];
            const formatted = data.map((f: any) => ({
                user_id: f.user_id || f.id,
                name: f.name,
                status: "pending" as const,
            }));
            setFriends(formatted);
        } catch (err: any) {
            console.error("Failed to fetch friends", err);
            showSnackbar({ message: "Failed to load friends", type: "error" });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDecision = (id: number, decision: "approved" | "rejected") => {
        setFriends((prev) =>
            prev.map((f) => (f.user_id === id ? { ...f, status: decision } : f))
        );
    };

    const toggleApproval = (id: number) => {
        setFriends((prev) =>
            prev.map((f) =>
                f.user_id === id
                    ? { ...f, status: f.status === "approved" ? "pending" : "approved" }
                    : f
            )
        );
    };

    const handleNext = async () => {
        const selectedOrderIds = selectedOrders.map((order) => order.id.toString());

        const payload = {
            order_ids: selectedOrderIds.map((id) => parseInt(id, 10)),
        };
        const approvedFriends = friends.filter((f) => f.status === "approved");

        try {
            const result = await createSplit(payload);
            console.log("Split created successfully:", result.data);
            const newSplitId = result.data?.id || result.data?.split?.id;

            await markOrdersAsSplitInDB(selectedOrderIds);
            console.log("Local SQLite DB updated successfully.");

            setSplitId(newSplitId);

            router.replace({
                pathname: "/private/home/split_others/split-bill",
                params: { approvedFriends: JSON.stringify(approvedFriends) },
            });

        } catch (error: any) {
            showSnackbar({ message: `Failed to create split: ${error?.message || "Unknown error"}`, type: "error" });
        }
    };


    const handleContinuePress = () => {
        const anyApproved = friends.some((f) => f.status === "approved");
        if (!anyApproved) {
            showSnackbar({
                message: "Select at least one person for split",
                type: "error",
            });
            return;
        }
        handleNext();
    };

    // Alphabetically sorted (case-insensitive) friend list for rendering
    const sortedFriends = useMemo(() => {
        return [...friends].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, {
                sensitivity: "base",
            })
        );
    }, [friends]);

    // const handleBackPress = () => {
    //   router.back();
    // };

    // Removing a friend from the split (not from your account). Keep API removal disabled for now.
    // const handleDelete = async (id: number) => {
    //   Alert.alert("Confirm", "Remove this friend?", [
    //     { text: "Cancel", style: "cancel" },
    //     {
    //       text: "Remove",
    //       style: "destructive",
    //       onPress: async () => {
    //         try {
    //           const api = await createAxiosInstance();
    //           const resp = await api.post(
    //             `${BACKEND_URL}/registrations/remove_friend/`,
    //             { user_id: id }
    //           );
    //           setFriends((prev) => prev.filter((f) => f.user_id !== id));
    //           showSnackbar({
    //             message: resp?.data?.detail ?? "Friend removed",
    //             type: "success",
    //           });
    //         } catch (err: any) {
    //           console.error("Remove friend failed", err);
    //           const msg =
    //             err?.response?.data?.error ??
    //             err?.response?.data?.detail ??
    //             "Failed to remove friend";
    //           showSnackbar({ message: msg, type: "error" });
    //         }
    //       },
    //     },
    //   ]);
    // };

    const removeFromSplit = (id: number) => {
        setFriends((prev) =>
            prev.map((f) => (f.user_id === id ? { ...f, status: "pending" } : f))
        );
    };

    const generateFriendRequestUrl = async () => {
        try {
            const result = await genFriendUrl();
            const link: string | undefined = result?.data?.url;
            if (!link)
                return showSnackbar({
                    message: "No link returned from the server",
                    type: "error",
                });

            Alert.alert("Your link is:", link, [
                {
                    text: "Copy",
                    onPress: async () => {
                        try {
                            const RN = require("react-native");
                            if (RN?.Clipboard?.setString) {
                                RN.Clipboard.setString(link);
                                showSnackbar({
                                    message: "Link copied to clipboard",
                                    type: "success",
                                });
                            }
                        } catch {
                            showSnackbar({
                                message: "Copy not supported on this device",
                                type: "error",
                            });
                        }
                    },
                },
                {
                    text: "Share",
                    onPress: async () => {
                        try {
                            await Share.share({ message: link, url: link });
                        } catch {
                            showSnackbar({
                                message: "Failed to open share dialog",
                                type: "error",
                            });
                        }
                    },
                },
                { text: "Close", style: "cancel" },
            ]);
        } catch (err: any) {
            console.error("Failed to generate link", err);
            showSnackbar({ message: err?.message || "Failed to generate link", type: "error" });
        }
    };

    // Fetch once on initial mount so returning from scan-qr doesn't reset selections
    useEffect(() => {
        void fetchFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchFriends]);

    // Show snackbar if returning from scan-qr with an error (e.g., 400)
    useEffect(() => {
        if (qrError) {
            showSnackbar({ message: qrError, type: "error" });
        }
    }, [qrError, showSnackbar]);

    const renderSideScrollerFriend = (friend: Friend) => (
        <View key={friend.user_id} style={styles.sideScrollerItem}>
            <View style={styles.sideScrollerTile}>
                {/* Background SVG fills the tile */}
                <OrangeRecSvg width="100%" height="100%" style={styles.tileBgSvg} />
                {/* Initial in absolute center */}
                <Text style={styles.tileInitial}>{friend.name?.[0] ?? "?"}</Text>
                {/* Name centered below initial */}
                <Text numberOfLines={2} ellipsizeMode="clip" style={styles.tileName}>
                    {friend.name}
                </Text>
            </View>

            {/* Cross slightly outside the top-right corner */}
            <TouchableOpacity
                style={styles.crossOutside}
                onPress={() => removeFromSplit(friend.user_id)}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
                <CrossIcon width={25} height={25} />
            </TouchableOpacity>
        </View>
    );

    const renderRecentFriend = ({ item }: { item: Friend }) => (
        <TouchableOpacity
            style={styles.recentTile}
            activeOpacity={0.85}
            onPress={() => toggleApproval(item.user_id)}
        >
            {/* Full-row background */}
            <RecentsBgSvg style={styles.recentBg} width="100%" height="100%" />

            {/* Left: avatar tile with initial only (same as side scroller tile) */}
            <View style={styles.recentContent}>
                <View style={styles.recentAvatarTile}>
                    <OrangeRecSvg width="100%" height="100%" style={styles.tileBgSvg} />
                    <Text style={styles.recentAvatarInitial}>
                        {item.name?.[0] ?? "?"}
                    </Text>
                </View>

                {/* Name to the right of the initial tile */}
                <Text style={styles.recentName} numberOfLines={2}>
                    {item.name}
                </Text>
            </View>

            {/* Right: checkbox toggle inside tile bounds */}
            <TouchableOpacity
                style={styles.recentCheckbox}
                onPress={() => toggleApproval(item.user_id)}
                accessibilityLabel={item.status === "approved" ? "Unselect" : "Select"}
            >
                <Ionicons
                    name={item.status === "approved" ? "checkbox" : "square-outline"}
                    size={24}
                    color={item.status === "approved" ? "#16a34a" : "#444"}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View pointerEvents="none" style={styles.backgroundLayer}>
                <BackgroundImageSvg
                    width={screenWidth}
                    height={backgroundHeight}
                    preserveAspectRatio="xMidYMid slice"
                />
            </View>
            <SplitHeader title="ADD/REMOVE" />

            <View style={styles.mainContainer}>
                {qrError && (
                    <View style={styles.inlineErrorWrap}>
                        <Text style={styles.inlineErrorText}>{qrError}</Text>
                    </View>
                )}
                {/* Added to Split section: only show when there are approved friends */}
                {(() => {
                    const approved = friends.filter((f) => f.status === "approved");
                    if (approved.length === 0) return null;
                    return (
                        <>
                            <Text style={styles.subHeader}>
                                Added to split ({approved.length}):
                            </Text>
                            <ScrollView
                                horizontal
                                style={styles.sideScroller}
                                contentContainerStyle={styles.sideScrollerContent}
                            >
                                {approved.map(renderSideScrollerFriend)}
                            </ScrollView>
                        </>
                    );
                })()}

                {/* Recent Friends List */}
                <View
                    style={[
                        styles.subHeaderRow,
                        friends.some((f) => f.status === "approved")
                            ? null
                            : { marginTop: 0 },
                    ]}
                >
                    <Text style={styles.subHeader}>Recents:</Text>
                    <TouchableOpacity
                        style={styles.addMoreInline}
                        onPress={() => router.push("/private/home/split_others/scan-qr")}
                        accessibilityLabel="Add more friends"
                    >
                        <AddMoreSvg height={40} />
                    </TouchableOpacity>
                </View>
                {/* Recent Friends List */}
                <View
                    style={{
                        flex: 1,
                        marginBottom: 420,
                        // marginTop: -10 /* take remaining vertical space */,
                    }}
                >
                    <FlatList
                        data={sortedFriends}
                        keyExtractor={(item) => item.user_id.toString()}
                        renderItem={renderRecentFriend}
                        style={{ flex: 1, marginBottom: -324 }}
                        contentContainerStyle={{
                            gap: 10, // optional - RN support is improving; harmless if ignored
                            flexGrow: 1, // so empty state can center properly
                            // paddingBottom: listBottomSpacer, // ensures content can scroll above the button
                        }}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyTitle}>
                                    Tap "Add more" to add friends.
                                </Text>
                                {/* <Text style={styles.emptySubtitle}>
                  Tap "Add more" to add friends.
                </Text> */}
                            </View>
                        }
                        // ListFooterComponent={<View style={{ height: listBottomSpacer }} />}
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            await fetchFriends();
                            setRefreshing(false);
                        }}
                    />
                </View>

                {/* Pinned Continue Button (always visible) */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinuePress}
                >
                    <ContinueSvg height={48} />
                </TouchableOpacity>
            </View>

            {/* Add Friends Modal */}
            {/* Split History button (left of FAB) */}
            {/* <TouchableOpacity
        style={[
          styles.historyButton,
          { bottom: friends.some((f) => f.status === "approved") ? 84 : 20 },
        ]}
        onPress={() => router.push("/private/home/split_others/history")}
        accessibilityLabel="Split history"
      >
        <Text style={styles.historyButtonText}>Split History</Text>
      </TouchableOpacity> */}

            {/** Modal disabled per request: open QR scanner directly via Add More button */}
            {/**
             <Modal visible={showAddModal} animationType="slide" transparent>
             <View style={styles.sheetContainer}>
             <View style={styles.sheet}>
             <TouchableOpacity
             style={styles.sheetButton}
             onPress={() => {
             setShowAddModal(false);
             void generateFriendRequestUrl();
             }}
             >
             <Text style={styles.sheetButtonText}>Share your Link</Text>
             </TouchableOpacity>

             <TouchableOpacity
             style={styles.sheetButton}
             onPress={() => {
             setShowAddModal(false);
             router.push("/private/home/split_others/scan-qr");
             }}
             >
             <Text style={styles.sheetButtonText}>Scan QR</Text>
             </TouchableOpacity>

             <TouchableOpacity
             style={[styles.sheetButton, styles.sheetCancel]}
             onPress={() => setShowAddModal(false)}
             >
             <Text style={[styles.sheetButtonText, styles.sheetCancelText]}>
             Cancel
             </Text>
             </TouchableOpacity>
             </View>
             </View>
             </Modal>
             */}
        </View>
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
    mainContainer: {
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 16,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: getStatusBarHeight(),
        backgroundColor: "transparent",
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 22,
        color: "#ffffff",
        fontFamily: "The Last Shuriken",
    },
    headerIconButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerUnderline: {
        position: "absolute",
        left: "7%",
        right: "7%",
        bottom: -4,
        height: 2,
        backgroundColor: "#FFFFFF",
        opacity: 0.9,
    },
    friendCard: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        backgroundColor: "#2a2a2a",
    },
    friendName: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 10,
    },
    actionRow: {
        flexDirection: "row",
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 20,
        minWidth: 140,
        height: 44,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: "#3b82f6",
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
    },
    fabText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    // modalOverlay: {
    //   flex: 1,
    //   backgroundColor: "rgba(0,0,0,0.4)",
    // },
    sheetContainer: {
        justifyContent: "flex-end",
        flex: 1,
    },
    sheet: {
        backgroundColor: "#121212",
        padding: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        // make sheet compact
        minHeight: 120,
        maxHeight: 260,
    },
    sheetButton: {
        paddingVertical: 12,
        alignItems: "center",
    },
    sheetButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    sheetCancel: {
        marginTop: 8,
        backgroundColor: "#222",
        borderRadius: 8,
    },
    sheetCancelText: {
        color: "#fff",
    },
    friendCardRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        backgroundColor: "#2a2a2a",
    },
    selectButton: {
        width: 84,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    selectText: {
        color: "#fff",
        fontWeight: "600",
    },
    friendInfo: {
        flex: 1,
    },
    smallDelete: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "#e11d48",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
    },
    smallDeleteText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },
    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#0f1720",
        borderTopWidth: 1,
        borderColor: "#222",
    },
    bottomText: {
        color: "#fff",
        fontSize: 16,
    },
    nextButton: {
        backgroundColor: "#3b82f6",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    nextButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
    fabCircle: {
        position: "absolute",
        right: 16,
        height: 56,
        width: 56,
        borderRadius: 28,
        backgroundColor: "#ef4444", // new color (red-500)
        alignItems: "center",
        justifyContent: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    historyButton: {
        position: "absolute",
        right: 88,
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: "#2563eb",
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
    },
    historyButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    emptyTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#9ca3af",
        fontSize: 14,
        textAlign: "center",
    },
    subHeader: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 8,
        color: "#fff",
        marginBottom: 20,
    },
    subHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12, // space below the side scroller
        marginBottom: 8,
    },
    addMoreInline: {
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    sideScroller: {
        flexDirection: "row",
        marginBottom: -3, // space so Recents header doesn't overlap
    },
    sideScrollerContent: {
        paddingTop: 10, // space so the outside cross isn't clipped
    },
    sideScrollerItem: {
        position: "relative",
        marginRight: 12,
    },
    sideScrollerTile: {
        width: 70,
        height: 70,
        borderRadius: 0,
        overflow: "hidden",
        backgroundColor: "transparent", // bg comes from SVG
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 28,
    },
    tileBgSvg: {
        position: "absolute",
        left: 0,
        top: 0,
    },
    tileInitial: {
        position: "absolute",
        top: "22%",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000ff",
    },
    tileName: {
        position: "absolute",
        top: "62%",
        left: 4,
        right: 4,
        textAlign: "center",
        fontSize: 9, // scaled down
        color: "#000000ff",
    },
    crossOutside: {
        position: "absolute",
        top: -8, // sits outside but within scroller padding
        right: -8,
        zIndex: 10,
        elevation: 10,
        backgroundColor: "transparent",
    },
    // keep for recent list
    recentTile: {
        position: "relative",
        // overflow: "hidden",
        borderRadius: 0,
        minHeight: 60,
        // paddingHorizontal: 12,
        // paddingVertical: 12,
    },
    recentBg: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    recentContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 44, // reserve space for checkbox
    },
    recentAvatarTile: {
        width: 40,
        height: 40,
        borderRadius: 0,
        marginLeft: 50,
        marginTop: 9,
        // overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        // paddingBottom: 25,
    },
    recentAvatarInitial: {
        position: "absolute",
        left: 0,
        right: 0,
        // top: "30%",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },
    recentName: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
        color: "#fff",
        fontSize: 14,
        lineHeight: 18,
        marginTop: 15,
    },
    recentCheckbox: {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: [{ translateY: -12 }],
    },
    tileBgWrap: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "30%",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        overflow: "hidden",
        opacity: 0.65,
    },
    addButton: {
        alignSelf: "center",
        marginVertical: 16,
        backgroundColor: "#3b82f6",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    continueButton: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 24, // increase space below button and screen edge
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    continueText: {
        display: "none",
    },
    inlineErrorWrap: {
        backgroundColor: "#7f1d1d",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    inlineErrorText: {
        color: "#ffdddd",
        fontSize: 14,
        fontWeight: "600",
    },
});
