import React, { useEffect, useState } from "react";
import {
    Dimensions,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Linking,
} from "react-native";
import { getStatusBarHeight } from "@/utils/safeArea";
import ScreenHeader from "@/components/ScreenHeader";
import { getSponsors } from "@api/sponsors.api";


const { width, height } = Dimensions.get("window");


interface Sponsor {
    id: number;
    name: string;
    url: string | null;
    description?: string | null;
    web_url?: string | null;
    order_no?: number;
}

//mehhhhhhhhh
//backend data isnt populated correctly, kuch toh dhang se nhi kr pate
export default function SponsorsScreen() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchSponsorsData = async () => {
        try {
            setLoading(true);
            const result = await getSponsors();
            const data: Sponsor[] = result.data;
            console.log("API Response Received:", JSON.stringify(data, null, 2));

            const validSponsors = (data || []).filter(
                (s) => s.url && s.url.trim() !== ""
            );

            if (validSponsors.length % 2 !== 0) {
                validSponsors.push({
                    id: -1,
                    name: "",
                    url: null,
                    description: "",
                    web_url: "",
                    order_no: 0,
                });
            }

            setSponsors(validSponsors);
        } catch (error: any) {
            console.error("Error fetching sponsors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsorsData();
    }, []);

    const renderSponsor = ({ item }: { item: Sponsor }) => {
        if (item.id === -1) {
            return <View style={[styles.sponsorCard, { backgroundColor: "transparent" }]} />;
        }

        return (
            <TouchableOpacity
                style={styles.sponsorCard}
                activeOpacity={0.8}
                onPress={() => {
                    if (item.web_url && item.web_url.trim() !== "") {
                        const link = item.web_url.startsWith("http")
                            ? item.web_url
                            : `https://${item.web_url}`;
                        Linking.openURL(link);
                    }
                }}
            >
                <Image
                    source={{ uri: item.url! }}
                    style={styles.sponsorImage}
                    resizeMode="contain"
                />
                <Text style={styles.sponsorDesc}>
                    {item.description ? item.description : " "}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("@assets/images/common-bg-png.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <ScreenHeader title="Sponsors" showBackButton={true} />
                <View style={styles.content}>
                    {loading ? (
                        <View style={styles.centerView}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.loadingText}>Loading sponsors...</Text>
                        </View>
                    ) : sponsors.length === 0 ? (
                        <View style={styles.centerView}>
                            <Text style={styles.emptyText}>No sponsors found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={sponsors}
                            renderItem={renderSponsor}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            numColumns={2}
                            columnWrapperStyle={styles.row}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const CARD_WIDTH = (width - 60) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        paddingTop: getStatusBarHeight(),
    },
    backgroundImage: {
        width,
        height,
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    centerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#ccc",
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
        fontWeight: "500",
    },
    sponsorCard: {
        backgroundColor: "transparent",
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
        width: CARD_WIDTH,
        height: 150,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sponsorImage: {
        width: "100%",
        height: 80,
        marginBottom: 5,
    },
    sponsorDesc: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        opacity: 0.85,
        minHeight: 18,
        fontFamily: "Quattrocento Sans",
    },
    listContent: {
        paddingBottom: 50,
    },
    row: {
        justifyContent: "space-between",
    },
});
