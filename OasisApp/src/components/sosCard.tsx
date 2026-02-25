import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Linking,
    TouchableOpacity,

} from "react-native";
import Accomodation from "@assets/images/accommodation.svg";
const { width, height } = Dimensions.get("window");
import { r_w, r_t } from "@/utils/responsive";
import { ContactUs } from "@assets/images/ham";

import { useSnackbar } from "@/providers/SnackbarProvider";



export interface SosCardProps {
    name1: string;
    contact1: number;
    name2: string;
    contact2: number;
    name3: string;
    contact3: number;
}

function SosCard({
    name1,
    contact1,
    name2,
    contact2,
    name3,
    contact3
}: SosCardProps) {

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
                    <Text style={styles.headingtext}>SOS</Text>
                </View>
                <View style={styles.hostelContainer}>
                    <View style={styles.left}>
                        <Text style={styles.keyText}>Emergency Contact 1:</Text>
                        <Text style={styles.valueText}>{name1}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.right}
                        onPress={() => handlePress(`tel:${contact1}`)}
                    >
                        <ContactUs width={28} height={28} />
                    </TouchableOpacity>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.left}>
                        <Text style={styles.keyText}>Emergency Contact 2:</Text>
                        <Text style={styles.valueText}>{name2}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.right}
                        onPress={() => handlePress(`tel:${contact2}`)}
                    >
                        <ContactUs width={28} height={28} />
                    </TouchableOpacity>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.left}>
                        <Text style={styles.keyText}>Emergency Contact 3:</Text>
                        <Text style={styles.valueText}>{name3}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.right}
                        onPress={() => handlePress(`tel:${contact3}`)}
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
        justifyContent: "center",
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

export default React.memo(SosCard);