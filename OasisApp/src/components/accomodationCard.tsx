import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ImageBackground,
    Dimensions,
    Linking,
    TouchableOpacity,
    // LayoutChangeEvent is no longer needed
} from "react-native";
import Accomodation from "@assets/images/accommodation.svg";

const { width, height } = Dimensions.get("window");
import { r_h, r_w, r_t } from "@/utils/responsive";
import { ContactUs } from "@assets/images/ham";
import { LocationIcon } from "@assets/images/events";
import { useSnackbar } from "@/providers/SnackbarProvider";


export interface AccomodationCardProps {
    hostel: string;
    // location: string;
    contact: number;
    name: string | null;
}

function AccomodationCard({
    hostel,
    contact,
    name,
}: AccomodationCardProps) {
    // These are no longer needed for the layout animation
    // const minCardHeight = 165;
    // const cardHeight = useSharedValue(minCardHeight);
    const { showSnackbar } = useSnackbar();

    const handlePress = async (url: string): Promise<void> => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            showSnackbar({
                message: `Can't handle URL: ${url}`,
                type: "error",
            });
        }
    };



    return (
        <View style={styles.eventCard}>
            <Accomodation style={{ position: "absolute", top: 0, left: -10 }} />
            <View style={styles.textContainer}>
                <View style={styles.header}>
                    <Text style={styles.headingtext}>Your Accommodation</Text>
                </View>
                <View style={styles.hostelContainer}>
                    <View style={styles.left}>
                        <Text style={styles.keyText}>Your hostel:</Text>
                        <Text style={styles.valueText}>{hostel}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.right}
                        // onPress={() => handlePress(`tel:${654}`)}
                    >
                        <LocationIcon width={28} height={28} />
                    </TouchableOpacity>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.left}>
                        <Text style={styles.keyText}>Your name:</Text>
                        <Text style={styles.valueText}>{name}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.right}
                        onPress={() => handlePress(`tel:${contact}`)}
                    >
                        <ContactUs width={28} height={28} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    eventCard: {
        overflow: "hidden",
        borderColor: "white",
        width: r_w(348),
        height: r_w(350),
        borderWidth: 1,
        flexDirection: "row",
        minHeight: 165,
        marginBottom: 1,
    },
    backgroundImage: {
        width: width,
        height: height,
    },

    textContainer: {
        marginLeft: 40,
        paddingTop: 15,
        paddingLeft: 16,
        paddingRight: 20,
        justifyContent: "flex-start",
        zIndex: 1,
        flex: 1,
    },
    left: {
        // flex: 1,
    },
    right: {
        borderColor: "white",
        borderWidth: 1,
        justifyContent: "center",
        padding: 6,
        // flex: 1,
        // alignItems: "flex-end",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
    },
    nameContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    hostelContainer: {
        marginTop: 4,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headingtext: {
        fontSize: r_t(24),
        fontFamily: "Proza Libre",
        color: "#ffffff",
    },

    keyText: {
        fontSize: r_t(18),
        fontFamily: "Proza Libre",
        color: "#ffffff",
        opacity: 0.9,
    },
    valueText: {
        fontSize: r_t(18),
        fontFamily: "Quattrocento Sans",
        color: "#ffffff",
        textDecorationStyle: "solid",
    },
});

export default React.memo(AccomodationCard);