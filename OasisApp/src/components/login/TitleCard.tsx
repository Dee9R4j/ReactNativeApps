import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {r_h, r_t, r_w} from "@utils/responsive";

export function OasisTitleCard() {
    return (
        <View style={styles.Arrangement} collapsable={false}>
            <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.EnglishText} numberOfLines={1}>Oasis</Text>
                <Text style={styles.JapaneseText} numberOfLines={1}>オアシス</Text>
            </View>
            <View style={{alignItems: "flex-end"}}>
                <Text style={styles.EditionBox}>The 53rd Edition</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    EnglishText: {
        fontWeight: 400,
        fontSize: r_t(57.37),
        // lineHeight: r_h(29.24),
        letterSpacing: r_t(0.05),
        color: '#FFFFFF',
        fontFamily: "The Last Shuriken"

    },
    JapaneseText: {
        fontWeight: 400,
        fontSize: r_t(38.25),
        letterSpacing: r_t(3.5),
        color: '#FF0004',
        transform: [
            {
                rotate: '-6.26deg',
            }
        ],
        opacity: 0.7,
        marginTop: r_h(-57),
        zIndex: 10
    },
    Arrangement: {
        height: r_h(85.6),
        width: "100%",
        marginTop: -1 * r_h(44),
        paddingRight: r_w(23),
        marginBottom: r_h(36),
        overflow: "visible",
    },

    EditionBox: {
        fontWeight: 400,
        fontSize: r_t(20),
        color: "#fff",
        alignItems: "flex-end",
        letterSpacing: -1 * r_t(0.2),
        fontFamily: "CantoraOne-Regular"
    }
})