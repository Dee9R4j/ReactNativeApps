import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    BackHandler,
    ImageBackground,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { router } from "expo-router";
import { getStatusBarHeight } from "@/utils/safeArea";
import QRCode from "react-native-qrcode-skia";
import Timer from "@components/Timer";
import { useSecureStore } from "@/state/secure/secure";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { useAuth } from "@/hooks/useAuthentication";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { r_t } from "@/utils/responsive";
import {
    BottomLeft,
    BottomRight,
    TopLeft,
    TopRight,
} from "@assets/images/contact";
import { useFastStore } from "@/state/fast/fast";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";

export default function Qr() {
    useEffect(() => {
        const backAction = () => {
            if (useFastStore.getState().signedStoreIn) {
                router.replace("/private/home/events");
            } else {
                router.back();
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        router.back();
    };
    const { isAuthenticating, authenticateUser } = useAuth();

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const backgroundHeight = screenHeight + insets.top + insets.bottom;

    const [qrValue, setQrvalue] = useState("");
    const [timeLeft, setTimeLeft] = useState(30);
    const [isQrReady, setIsQrReady] = useState(false);

    const secret = useSecureStore((state) => state.qr_code);
    const {showSnackbar} = useSnackbar();
    const userID = useSecureStore((state) => state.user_id);
    const name = useSecureStore((state) => state.name);

    const generateQr = async () => {
        if (secret) {
            const timecode = Math.floor(Date.now() / 1000 / 30);
            console.log("datenow", +Math.floor(Date.now()));
            console.log("timecode:" + timecode);
            const input = `${timecode}${secret}`;

            const digest = HmacSHA256(Utf8.parse(input), Utf8.parse(secret));
            console.log("digest", digest);

            const payload = `${userID}::::${digest.toString()}`;
            console.log("payload", payload);

            const base64Payload = Utf8.parse(payload).toString(Base64);
            setQrvalue(base64Payload);
            console.log("QR Value: ", base64Payload);
            setIsQrReady(true);
        } else {
            console.log("Secret not loaded yet!");
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuth = await authenticateUser();
            if (!isAuth) {
                showSnackbar({ message: "Authentication required to access QR screen.", type: "error" })

                router.back();
                return;
            }

            if (secret) {
                generateQr();
                const interval = setInterval(() => {
                    generateQr();
                    setTimeLeft(30);
                }, 30000);
                return () => clearInterval(interval);
            }
        };

        verifyAuth();
    }, [secret]);
    return (
        <SafeAreaView
            style={[
                styles.container,
                { paddingTop: Platform.OS === "android" ? getStatusBarHeight() : 0 },
            ]}
        >
            <ImageBackground
                style={styles.backgroundLayer}
                source={require("@assets/images/qr-cloud.png")}
                imageStyle={{ opacity: 0.8 }}
            >
                <ScreenHeader title="YOUR QR" />
                <View style={styles.content}>
                    <View style={styles.nameContainer}>
                        <View style={{ marginBottom: 8 }}>
                            <Text style={styles.nameText}>{name || "Null"}</Text>
                        </View>

                        <Text style={styles.userIdText}>User ID : {userID || "No ID"}</Text>
                    </View>
                    {qrValue ? (
                        <>
                            <View style={styles.qrWrapper}>
                                <View style={styles.topLeftCorner}>
                                    <TopLeft />
                                </View>
                                <View style={styles.topRightCorner}>
                                    <TopRight />
                                </View>
                                <View style={styles.bottomLeftCorner}>
                                    <BottomLeft />
                                </View>
                                <View style={styles.bottomRightCorner}>
                                    <BottomRight />
                                </View>
                                <View style={styles.qrContainer}>
                                    <QRCode value={qrValue} size={220} />
                                </View>
                            </View>

                            {isQrReady && (
                                <>
                                    <Text style={styles.qrText}>Refresh in</Text>
                                    <Timer />
                                </>
                            )}
                        </>
                    ) : (
                        <View style={styles.qrContainer}>
                            <ActivityIndicator size="small" color="#ffffff" />
                        </View>
                    )}
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: getStatusBarHeight(),
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingTop: getStatusBarHeight(),
    },
    header: {
        paddingVertical: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 24,
        paddingTop: 40,
        // gap: 10,
    },
    qrWrapper: {
        position: "relative",
        alignSelf: "center",
        marginBottom: 22,
    },
    qrContainer: {
        borderWidth: 2,
        borderColor: "#00rgba(253, 253, 253, 1)",
        padding: 10,
        backgroundColor: "#ffffffff",
        elevation: 6,
    },
    topLeftCorner: {
        top: -5,
        left: -5,
        position: "absolute",
    },
    topRightCorner: {
        position: "absolute",
        top: -5,
        right: -5,
    },
    bottomLeftCorner: {
        position: "absolute",
        bottom: -5,
        left: -5,
    },
    bottomRightCorner: {
        position: "absolute",
        bottom: -5,
        right: -5,
    },
    qrText: {
        fontFamily: "Proza Libre",
        fontSize: r_t(20),
        color: "#ffffff",
        marginTop: 16,
        textAlign: "center",
    },
    nameText: {
        fontSize: r_t(30),
        fontFamily: "Quattrocento Sans Bold",
        color: "#ffffff",
        marginBottom: 6,
        textAlign: "center",
    },
    userIdText: {
        fontSize: r_t(30),
        fontFamily: "Quattrocento Sans",
        color: "#ffffff",
        marginBottom: 12,
        textAlign: "center",
    },
    nameContainer: {
        alignItems: "center",
        paddingHorizontal: 22,
        marginVertical: 20,
        paddingBottom: 10,
        justifyContent: "space-between",
    },
    divider: {
        width: "100%",
        maxWidth: "100%",
        height: 2,
        backgroundColor: "#FFF",
    },
});