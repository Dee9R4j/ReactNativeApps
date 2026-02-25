import {StyleSheet, View} from "react-native";
import {Image} from "expo-image";
import React from "react";

import PaperbackgroundPNG from "@/../assets/images/common/paper_background.png";
import {r_h, r_w} from "@utils/responsive";

interface proptypes {
    children: React.ReactNode;
}

export function Background({children}: proptypes) {
    return (
        <View style={styles.container}>
            <Image
                source={PaperbackgroundPNG}
                style={styles.backgroundImage}
                contentFit={"cover"}
            />
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#000"
    },
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        height: r_h(852),
        width: r_w(393),
        opacity: 0.4
    },
    content: {
        height: r_h(852),
        width: r_w(393),
        zIndex: 1,
    },
});