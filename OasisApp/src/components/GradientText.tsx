import React from "react";
import {StyleProp, Text, TextProps, TextStyle} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import {LinearGradient, LinearGradientProps} from "expo-linear-gradient";

interface GradientTextProps {
    text: string;
    colors: LinearGradientProps["colors"];
    style?: StyleProp<TextStyle>;
    start?: LinearGradientProps["start"];
    end?: LinearGradientProps["end"];
    locations?: LinearGradientProps["locations"];
    textProps?: Omit<TextProps, "children" | "style" | "numberOfLines">;
    numberOfLines?: number;
}

export function GradientText({
    text,
    colors,
    style,
    start = {x: 0, y: 0},
    end = {x: 1, y: 0},
    locations,
    numberOfLines,
    textProps
}: GradientTextProps) {
    return (
    <MaskedView maskElement={<Text {...textProps} style={style} numberOfLines={numberOfLines}>{text}</Text>}>
            <LinearGradient colors={colors} start={start} end={end} locations={locations}>
                <Text
                    {...textProps}
                    style={[style, {opacity: 0}]}
                    numberOfLines={numberOfLines}
                >
                    {text}
                </Text>
            </LinearGradient>
        </MaskedView>
    );
}
