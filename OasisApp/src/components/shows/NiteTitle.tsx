import React from "react";
import {ColorValue, StyleProp, Text, TextStyle, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

import {r_h, r_t, r_w} from "@utils/responsive";
import {GradientText} from "@components/GradientText";



interface proptypes {
    type: "Indie" | "HipHop" | "Bolly" | "N2O";
}

export function NiteTitle(props: proptypes) {


    return (
        <View style={{
            flexDirection: "row",
        }}>
            <Text style={{
                fontFamily: "The Last Shuriken",
                fontSize: r_t(42),
                color: "#fff",
                letterSpacing: -1 * r_t(0.55),
                fontWeight: 400
            }}>
                {props.type.toUpperCase()}
            </Text>
            {
                props.type !== "N2O" && (
                    <View style={{
                        marginLeft: -1 * r_w(-18),
                        marginTop: r_h(15),
                    }}>
                        <GradientText text={props.type.toUpperCase()} colors={["#EB0000", "#920606"]} style={{
                            fontFamily: "The Last Shuriken",
                            fontSize: r_t(40),
                            fontWeight: 400,
                            letterSpacing: -1 * r_t(1),
                        }}/>
                    </View>
                )
            }
        </View>
    );
}
