import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Button,
    Linking,
    SafeAreaView,
    StyleSheet,
    Text, TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {addFriend, qrAddFriend} from "@/api/split.api";
import {simulateNetworkDelay} from "@/api/dummyData";
import {useSnackbar} from "@/utils/contextprovider/SnackbarProvider";
import BackgroundPattern from "@assets/images/food/background-image.svg";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type Requester = {
    id: number;
    user: string;
    bitsian_id: string;
};

export default function AddFriendTokenScreen() {
    const params = useLocalSearchParams() as { token?: string };
    const [rawToken, setRawToken] = useState<string | undefined>(params.token);
    const router = useRouter();
    const {showSnackbar} = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [requester, setRequester] = useState<Requester | null>(null);

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const backgroundHeight = screenHeight + insets.top + insets.bottom;

    const extractTokenFromString = (s?: string | null) => {
        if (!s) return null;
        try {
            if (s.startsWith("http://") || s.startsWith("https://")) {
                const u = new URL(s);
                const parts = u.pathname.split("/").filter(Boolean);
                return parts.length ? parts[parts.length - 1] : null;
            }
            const parts = s.split("/").filter(Boolean);
            return parts.length ? parts[parts.length - 1] : null;
        } catch (e: any) {
            const parts = String(s).split("/").filter(Boolean);
            return parts.length ? parts[parts.length - 1] : null;
        }
    };

    useEffect(() => {
        if (rawToken) return;
        (async () => {
            try {
                const initial = await Linking.getInitialURL();
                if (initial) setRawToken(initial);
            } catch (err: any) {
                // ignore
            }
        })();
    }, [rawToken]);

    const tokenValue = extractTokenFromString(rawToken ?? null);

    useEffect(() => {
        if (!tokenValue) return;

        const fetchRequester = async () => {
            setLoading(true);
            try {
                await simulateNetworkDelay(300, 600);
                // Mock requester data
                setRequester({
                    id: 1001,
                    user: "Aarav Patel",
                    bitsian_id: "2024A3PS0042",
                });
            } catch (err: any) {
                console.error("Failed to fetch friend request", err);
                showSnackbar({message: err?.message ?? "Failed to load friend request", type: "error"});
            } finally {
                setLoading(false);
            }
        };

        void fetchRequester();
    }, [tokenValue]);

    const onAccept = async () => {
        if (!tokenValue) return;
        try {
            await addFriend(tokenValue);
            showSnackbar({message: "Friend added", type: "success"});
            router.replace("/private/home");
        } catch (err: any) {
            console.error("Accept failed", err);
            showSnackbar({message: err?.message ?? "Failed to accept friend", type: "error"});
        }
    };

    const onReject = () => {
        showSnackbar({message: "Friend request rejected", type: "error"});
        router.replace("/private/home");
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#56A8E8"/>
            </SafeAreaView>
        );
    }

    if (!requester) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>No friend request found.</Text>
                    <Button
                        title="Go to home"
                        onPress={() => router.replace("/private/home")}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View pointerEvents="none" style={styles.backgroundLayer}>
                <BackgroundPattern
                    width={screenWidth}
                    height={screenHeight}
                    preserveAspectRatio="xMidYMid slice"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>FRIEND REQUEST</Text>

                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{requester.user}</Text>

                    <Text style={styles.label}>Bitsian ID</Text>
                    <Text style={styles.value}>{requester.bitsian_id}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={onAccept}
                        activeOpacity={0.8}
                        style={[styles.actionButton, styles.acceptButton]}
                    >
                        <Text style={styles.actionText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onReject}
                        activeOpacity={0.8}
                        style={[styles.actionButton, styles.rejectButton]}
                    >
                        <Text style={styles.actionText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#0d0d0d",
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    card: {
        marginHorizontal: 24,
        padding: 24,
        backgroundColor: "#000000",
        borderWidth: 1,
        borderColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontFamily: "Quattrocento Sans",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    infoBlock: {
        marginBottom: 28,
    },
    label: {
        color: "#aaa",
        marginTop: 8,
        fontSize: 14,
    },
    value: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        marginTop: 2,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
    },
    acceptButton: {
        backgroundColor: "#00c853",
        borderWidth: 1,
        borderColor: "#ffffff",
        shadowColor: "#00e676",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
    },
    rejectButton: {
        backgroundColor: "#d32f2f",
        borderWidth: 1,
        borderColor: "#ffffff",
        shadowColor: "#ff6659",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
    },
    actionText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Quattrocento Sans",
    },
    goHomeButton: {
        marginTop: 16,
        backgroundColor: "#2196f3",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    goHomeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    }
});
