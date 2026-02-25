import React from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {r_h, r_t, r_w} from "@utils/responsive";
import {Box, Canvas, LinearGradient, Rect, vec} from "@shopify/react-native-skia";
import LoginButtonSVG from "@/../assets/images/login/login_button.svg";
import { BoxGradientBorder } from "@assets/images/merch";
import {GradientBox} from "@components/GradientBox";

const BUTTON_WIDTH = r_w(320);
const BUTTON_HEIGHT = r_h(51);
const BUTTON_WIDTH_BORDER = r_w(325);
const BUTTON_HEIGHT_BORDER = r_h(54);

interface proptypes {
    disabled: boolean,
    onPress: () => void,
    loading: boolean
}

export function BuyButton(props: proptypes) {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled} style={styles.Box}>

            {/*/!* Background gradient Canvas below content, doesn't block touches *!/*/}
            {/*<View pointerEvents="none" style={[StyleSheet.absoluteFill, {*/}
            {/*    zIndex: 0,*/}
            {/*    elevation: 0,*/}
            {/*    overflow: "hidden"*/}
            {/*}]}>*/}
            {/*    <Canvas style={StyleSheet.absoluteFill}>*/}
            {/*        <Rect width={BUTTON_WIDTH} height={BUTTON_HEIGHT} x={0} y={0}>*/}
            {/*            <LinearGradient*/}
            {/*                start={vec(0, BUTTON_HEIGHT / 2)}*/}
            {/*                end={vec(BUTTON_WIDTH, BUTTON_HEIGHT / 2)}*/}
            {/*                colors={["#450000", "#AB0000", "#450000"]}*/}
            {/*            />*/}
            {/*        </Rect>*/}
            {/*    </Canvas>*/}
            {/*</View>*/}

            {/* Foreground content (dragons) above the canvas */}
            <View style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                zIndex: 1,
                elevation: 1,
            }}>
                <GradientBox width={r_w(320)} height={r_h(51)} border={r_w(2)}>
                    <View style={{
                        backgroundColor: "#ae0000"
                    }}>
                        <LoginButtonSVG width={r_w(320)} height={r_h(51)}/>
                    </View>
                </GradientBox>
            </View>
            {/* Centered text label over the button */}
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, {
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10000,
                elevation: 2
            }]}>
                {
                    props.loading && <ActivityIndicator size="large" color="#fff"/>
                }
                {
                    !props.loading && <Text style={{
                        color: "#FFFFFF",
                        fontSize: r_t(20),
                        fontWeight: "600",
                        fontFamily: "The Last Shuriken"
                    }}>
                        BUY
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
        marginTop: r_h(22),

    }
})