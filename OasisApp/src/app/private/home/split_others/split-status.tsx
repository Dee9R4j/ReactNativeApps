import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ListRenderItem,
    SafeAreaView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import SplitOrderCard from "@components/food/SplitOrderCard";
import {useCurrentSplitStore} from "@/state/base/currentSplitStore";
import {useSecureStore} from "@/state/secure/secure";
import {getSplitStatus} from "@api/split.api";
import {simulateNetworkDelay} from "@/api/dummyData";
import BackgroundImageSvg from "@assets/images/food/background-image.svg";
import SplitHeader from "@components/food/SplitHeader";
import SplitPattern from "@assets/images/food/button-pattern.svg";
import OrangeRecSvg from "@assets/images/food/split/orange_rec.svg";
import {useFocusEffect} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";


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
    vendor: { id: number; name: string; image_url: string };
    order_image_url: string;
    rating: null;
}

interface FriendSplit {
    user_id: number;
    name: string;
    amount: number;
    status: "pending" | "accepted" | "rejected" | "owner";
    pfp_url: string;
}

interface ApiUser {
    id: number;
    name: string;
    pfp_url: string;
}

interface SplitMember {
    id: number;
    user: ApiUser;
    status: number;
    amount: number;
    decided_at: string | null;
    split: number;
}

interface SplitDetails {
    id: number;
    user: ApiUser;
    locked: boolean;
    date: string;
    current_amount: number;
    is_completed: boolean;
    is_owner: boolean | null;
}

interface ApiResponse {
    split: SplitDetails;
    split_members: SplitMember[];
    user0_amount: number;
    split_url: string;
    orders: Order[];
}


const mapStatusToString = (status: number | string): "pending" | "accepted" | "rejected" => {
    if (typeof status === "string") {
        switch (status.toLowerCase()) {
            case "pending":
                return "pending";
            case "accepted":
                return "accepted";
            case "rejected":
                return "rejected";
            default:
                return "pending";
        }
    }

    switch (status) {
        case 0:
            return "pending";
        case 1:
            return "accepted";
        case 2:
            return "rejected";
        default:
            return "pending";
    }
};

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const widthScale = SCREEN_WIDTH / 430;
const horizontalPadding = 25 * widthScale;
const backgroundHeight = SCREEN_HEIGHT * 0.6;


export default function SplitStatusScreen() {
    const {split_id} = useLocalSearchParams<{ split_id: string }>();
    const router = useRouter();

    const {width: screenWidth, height: screenHeight} = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const backgroundHeight = screenHeight + insets.top + insets.bottom;

    const currentUserId = useSecureStore((state) => state.user_id);
    const name = useSecureStore((state) => state.name);
    const currentSplitId = useCurrentSplitStore((state) => state.splitId);

    const [membersData, setMembersData] = useState<FriendSplit[]>([]);
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<
        "connecting" | "connected" | "reconnecting" | "closed"
    >("connecting");
    const [token, setToken] = useState<string | null>(null);

    const splitid = currentSplitId ? currentSplitId : split_id;

    useEffect(() => {
        const fetchSplitDetails = async () => {
            try {
                if (!splitid) return;
                const result = await getSplitStatus(Number(splitid));
                const data: any = result.data;

                const ownerShare: FriendSplit = {
                    user_id: data?.split?.user?.id || 0,
                    name: data?.split?.user?.name || "Owner",
                    amount: data?.user0_amount || 0,
                    status: "owner",
                    pfp_url: data?.split?.user?.pfp_url || "",
                };

                const mappedFriends: FriendSplit[] = (data?.split_members || []).map((member: any) => ({
                    user_id: member.user.id,
                    name: member.user.name,
                    amount: member.amount,
                    status: mapStatusToString(member.status),
                    pfp_url: member.user.pfp_url,
                }));

                setMembersData([ownerShare, ...mappedFriends]);
                setSelectedOrders(data?.orders || []);
            } catch (e: any) {
                console.error("[FETCH_ERROR]:", e);
            }
        };
        fetchSplitDetails();
    }, [currentSplitId, currentUserId]);


    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
    const attemptRef = useRef<number>(1);

    const fetchAuthToken = async () => {
        try {
            await simulateNetworkDelay(200, 400);
            const mockToken = "mock-auth-token-" + Date.now();
            setToken(mockToken);
            return mockToken;
        } catch (err: any) {
            console.error(" [FETCH_TOKEN_ERROR]:", err);
            throw err;
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;
            if (!splitid) return;

            const setupWebSocket = async () => {
                let websocketToken = token || (await fetchAuthToken());
                if (!websocketToken) return;

                const connect = () => {
                    if (wsRef.current) {
                        try {
                            wsRef.current.close();
                        } catch {
                        }
                        wsRef.current = null;
                    }

                    const wsUrl = `wss://realtime.bits-oasis.org/ws?split_id=${splitid}&token=${websocketToken}`;
                    const ws = new WebSocket(wsUrl);
                    wsRef.current = ws;

                    ws.onopen = () => {
                        setConnectionStatus("connected");
                        ws.send(JSON.stringify({action: "subscribe", split_id: splitid}));
                    };

                    ws.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            if (data.event_type === "split_status_update" && data.payload) {
                                const {user_id, new_status} = data.payload;
                                const stringStatus = mapStatusToString(new_status);
                                setMembersData((prev) =>
                                    prev.map((m) =>
                                        m.user_id === user_id ? {...m, status: stringStatus} : m
                                    )
                                );
                            }
                        } catch (e: any) {
                            console.error(" WS MESSAGE ERROR:", e);
                        }
                    };

                    ws.onclose = () => {
                        if (!isMounted) return;
                        setConnectionStatus("reconnecting");
                        const delay = Math.min(30000, Math.pow(2, attemptRef.current) * 1000);
                        reconnectTimerRef.current = setTimeout(connect, delay) as unknown as NodeJS.Timeout;
                    };
                };

                connect();
            };

            setupWebSocket();

            return () => {
                isMounted = false;
                if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
                if (wsRef.current) wsRef.current.close(1000, "Component un-focused");
                setConnectionStatus("closed");
            };
        }, [splitid, token])
    );


    const renderItem: ListRenderItem<FriendSplit> = ({item}) => {
        const amount = item.amount || 0;
        const isOwner = item.status === "owner";

        return (
            <View style={[styles.memberCard, {width: SCREEN_WIDTH - horizontalPadding * 2}]}>
                <View style={StyleSheet.absoluteFill}>
                    <SplitPattern width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>
                </View>

                <View style={styles.leftSection}>
                    <View style={styles.avatar}>
                        <OrangeRecSvg width="100%" height="100%" style={styles.tileBgSvg}/>
                        <Text style={styles.avatarInitial}>{item.name?.[0]?.toUpperCase() ?? "?"}</Text>
                    </View>
                    <Text style={styles.friendName}>
                        {item.name}
                        {isOwner ? " (Owner)" : ""}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    <Text style={[styles.amountText]}>₹{amount.toFixed(0)}</Text>
                </View>

                {!isOwner && (
                    <View
                        style={[
                            styles.statusButton,
                            item.status === "pending"
                                ? {backgroundColor: "#410070"}
                                : item.status === "accepted"
                                    ? {backgroundColor: "#1E8B3D"}
                                    : {backgroundColor: "#AE0000"},
                        ]}
                    >
                        <View style={styles.statusSlantOverlay}/>
                        <Text style={styles.statusText}>
                            {item.status === "pending"
                                ? "Pending"
                                : item.status === "accepted"
                                    ? "Sent Money"
                                    : "Rejected"}
                        </Text>
                    </View>
                )}
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
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

            <View style={[styles.mainContent, {paddingHorizontal: horizontalPadding}]}>
                <View style={styles.orderSection}>
                    <SplitOrderCard selectedOrders={selectedOrders} currencySymbol="₹"/>
                </View>

                <View style={styles.headerRow}>
                    <Text style={styles.memberHeader}>Members ({membersData.length})</Text>
                    <View style={styles.connectionStatus}>
                        {connectionStatus === "connecting" && (
                            <>
                                <ActivityIndicator size="small" color="#9b59b6"/>
                                <Text style={styles.connectingText}>Connecting…</Text>
                            </>
                        )}
                        {connectionStatus === "reconnecting" && (
                            <>
                                <ActivityIndicator size="small" color="#f59e0b"/>
                                <Text style={styles.reconnectingText}>Reconnecting…</Text>
                            </>
                        )}
                        {connectionStatus === "connected" && (
                            <Text style={styles.connectedText}>Connected</Text>
                        )}
                        {connectionStatus === "closed" && (
                            <Text style={styles.disconnectedText}>Disconnected</Text>
                        )}
                    </View>
                </View>

                <FlatList
                    data={membersData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.user_id?.toString() || Math.random().toString()}
                    contentContainerStyle={[
                        styles.listContent,
                        membersData.length === 0 && styles.emptyScrollContent,
                    ]}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No members found</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent"
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0
    },
    darkenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000000",
        opacity: 0.4,
        zIndex: 1
    },
    backgroundPattern: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: backgroundHeight
    },
    mainContent: {
        flex: 1,
        paddingTop: 10
    },
    orderSection: {
        marginBottom: 15,
        alignItems: "center"
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    memberHeader: {
        fontSize: 18,
        fontFamily: "Proza Libre",
        color: "#ffffff",
        fontWeight: "600",
    },
    connectionStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    connectingText: {
        color: "#9b59b6",
        fontSize: 12
    },
    reconnectingText: {
        color: "#f59e0b",
        fontSize: 12
    },
    connectedText: {
        color: "lightgreen",
        fontSize: 12
    },
    disconnectedText: {
        color: "grey",
        fontSize: 12
    },
    listContent: {paddingBottom: 40},
    emptyScrollContent: {
        flexGrow: 1,
        justifyContent: "center"
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#b0b0b0"
    },
    memberCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#1a1a1a",
        borderWidth: 2,
        borderColor: "#C0C0C0",
        overflow: "hidden",
        minHeight: 60,
        alignSelf: "center",
        marginBottom: 10,
    },
    leftSection: {flexDirection: "row", alignItems: "center", flex: 1},
    avatar: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
        marginRight: 12,
        overflow: "hidden",
    },
    tileBgSvg: {position: "absolute", left: 0, top: 0},
    avatarInitial: {fontSize: 18, fontWeight: "700", color: "#ffffff"},
    friendName: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Quattrocento Sans",
        flex: 1,
    },
    rightSection: {alignItems: "flex-end", justifyContent: "center"},
    amountText: {
        color: "#fff",
        textAlign: "right",
        fontSize: 16,
        fontFamily: "Quattrocento Sans",
        minWidth: 80,
    },
    statusButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        paddingVertical: 6,
        paddingHorizontal: 20,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: "#fff"
    },
    statusSlantOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255,255,255,0.1)",
        transform: [{skewX: "-15deg"}],
    },
    statusText: {
        color: "white",
        fontSize: 12,
        fontFamily: "Quattrocento Sans",
        fontWeight: "500",
        zIndex: 1,
    },
});