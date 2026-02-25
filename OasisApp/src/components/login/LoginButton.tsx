import React from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Dragon1 from "@/../assets/images/login/dragon1.svg";
import Dragon2 from "@/../assets/images/login/dragon_2.svg";
import {r_h, r_t, r_w} from "@utils/responsive";
import {Canvas, LinearGradient, Rect, vec} from "@shopify/react-native-skia";
import LoginButtonSVG from "@/../assets/images/login/login_button.svg";

const BUTTON_WIDTH = r_w(320);
const BUTTON_HEIGHT = r_h(51);

const H = BUTTON_HEIGHT
const W = BUTTON_WIDTH
const BORDER = 2;

interface proptypes {
    disabled: boolean,
    onPress: () => void,
}

export function LoginButton(props: proptypes) {

    const border = Math.max(1, Math.round(r_w(BORDER)));
    const borderX = border;
    const borderY = border;

    const innerW = Math.max(0, W - 2 * borderX);
    const innerH = Math.max(0, H - 2 * borderY);

    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled} style={styles.Box}>
            {/* Background gradient Canvas below content, doesn't block touches */}
            <Canvas style={{
                width: W,
                height: H,
            }} pointerEvents="none">
                {/* Outer gradient fill */}
                <Rect x={0} y={0} width={W} height={H}>
                    <LinearGradient start={vec(0, 0)} end={vec(W, H)} colors={["#fff", "#7f7f7f", "#fff"]}/>
                </Rect>
                {/* Inner solid fill to create the visible border on all sides */}
                <Rect x={borderX} y={borderY} width={innerW} height={innerH} color="#000000"/>
            </Canvas>
            {/* Foreground content (dragons) above the canvas */}
            <View style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                zIndex: 5,
                elevation: 3,
                position: 'absolute',
                top: borderY,
                left: borderX,
                right: borderX,
                bottom: borderY,
                backgroundColor: '#aa0000',
                overflow: 'hidden',
            }}>
                <LoginButtonSVG width={r_w(320)-BORDER} height={r_h(51)-BORDER}/>
            </View>
            {/* Centered text label over the button */}
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, {
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10000,
                elevation: 5
            }]}>
                {
                    props.disabled && <ActivityIndicator size="large" color="#fff"/>
                }
                {
                    !props.disabled && <Text style={{
                        color: "#FFFFFF",
                        fontSize: r_t(20),
                        fontWeight: "600",
                        fontFamily: "The Last Shuriken"
                    }}>
                        Log In
                    </Text>
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    Box: {
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        position: "relative",
        marginTop: r_h(26),
        backgroundColor: "#8c0600"
    }
})