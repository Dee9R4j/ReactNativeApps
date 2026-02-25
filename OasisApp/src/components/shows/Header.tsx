import React from "react";
import {Pressable, StyleSheet, TouchableOpacity, View} from "react-native"
import {SharedValue} from "react-native-reanimated";
import {Ionicons} from "@expo/vector-icons";
import {r_h, r_w} from "@/utils/responsive";
import {router} from "expo-router";
import {BackIcon} from "@assets/images/events";

interface proptypes {
    headings: React.ReactNode[];
    index: number;
    animatedIndex: SharedValue<number>;
}

export function Header(props: proptypes) {

    const handleBack = () => {
        router.back()
    }

    return (
        <View style={styles.box}>
            <View style={{
                position: "absolute",
                left: r_w(16)
            }}>
                <Pressable style={styles.backButton} onPress={handleBack}>
                    <BackIcon width={27} height={38} fill={'#fff'}/>
                </Pressable>
            </View>
            <View style={{
                flex: 4,
                justifyContent: "center",
                height: r_h(90),
                alignItems: "center"
            }}>
                {props.headings[props.index]}
            </View>
            <View/>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: r_h(20),
        height: r_h(80),
    },
    back_button: {
        justifyContent: "center",
        alignItems: "center",
        height: r_h(40),
        width: r_h(40),
    },
    backButton: {
        width: r_w(40),
        height: r_h(40),
        justifyContent: "center",
        alignItems: "center",
    },
})