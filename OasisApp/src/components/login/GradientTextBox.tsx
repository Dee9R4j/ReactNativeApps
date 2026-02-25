import {StyleSheet, TextInput, View} from "react-native";
import {r_h, r_t, r_w} from "@utils/responsive";
import React, {useState} from "react";
import {Canvas, LinearGradient, Rect, vec} from "@shopify/react-native-skia";

import SvgUsername from "@/../assets/images/login/username.svg";
import SvgPassword from "@/../assets/images/login/password.svg";
import {Ionicons} from "@expo/vector-icons";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";

const HEIGHT = 51;
const WIDTH = 320;
const BORDER = 2; // visual border thickness before scaling

interface proptypes {
    type: "username" | "password",
    usernameRef?: React.RefObject<TextInput | null>,
    passwordRef?: React.RefObject<TextInput | null>,
    value: string,
    onChangeText?: (text: string) => void,
    onSubmitEditing?: () => void,
    style?: any,
    placeholder?: string,
}

export function GradientTextBox(props: proptypes) {
    // Default sizes
    const defaultW = Math.round(r_w(WIDTH));
    const defaultH = Math.round(r_h(HEIGHT));

    // Measure actual final size so Canvas/overlay align with custom styles
    const [measured, setMeasured] = React.useState<{ w: number; h: number } | null>(null);

    const W = measured?.w ?? defaultW;
    const H = measured?.h ?? defaultH;

    // Border thickness based on dp scaling, minimum 1px when rounded
    const border = Math.max(1, Math.round(r_w(BORDER)));
    const borderX = border;
    const borderY = border;

    // Inner dimensions
    const innerW = Math.max(0, W - 2 * borderX);
    const innerH = Math.max(0, H - 2 * borderY);

    // Icon size capped to inner height
    const iconSize = Math.max(12, Math.min(innerH - 12, Math.round(r_h(24))));

    const [pwVisible, setPwVisible] = useState(true)

    return (
        <View
            style={[styles.Box, props.style]}
            onLayout={(e) => {
                const {
                    width,
                    height
                } = e.nativeEvent.layout;
                if (!measured || measured.w !== width || measured.h !== height) {
                    setMeasured({
                        w: Math.round(width),
                        h: Math.round(height)
                    });
                }
            }}
        >
            <Canvas style={{
                width: W,
                height: H
            }} pointerEvents="none">
                {/* Outer gradient fill */}
                <Rect x={0} y={0} width={W} height={H}>
                    <LinearGradient start={vec(0, 0)} end={vec(W, H)} colors={["#fff", "#7f7f7f", "#fff"]}/>
                </Rect>
                {/* Inner solid fill to create the visible border on all sides */}
                <Rect x={borderX} y={borderY} width={innerW} height={innerH} color="#000000"/>
            </Canvas>

            {/* Content overlay inset inside the inner fill so it cannot cover the border */}
            <View style={{
                position: 'absolute',
                top: borderY,
                left: borderX,
                right: borderX,
                bottom: borderY,
                backgroundColor: 'transparent',
                overflow: 'hidden',
            }}>
                {
                    props.type === "username" && (
                        <View
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                height: '100%',
                            }}
                        >
                            <SvgUsername
                                width={iconSize}
                                height={iconSize}
                                style={{marginLeft: r_w(10)}}
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    height: '100%',
                                    paddingHorizontal: r_w(10),
                                    paddingVertical: 0,
                                    color: '#fff',
                                    fontSize: 20,
                                    fontFamily: "Quattrocento Sans",
                                }}
                                placeholder={props.placeholder || "Username"}
                                placeholderTextColor="#B5B5B5FF"
                                ref={props.usernameRef}
                                onSubmitEditing={props.onSubmitEditing}
                                onChangeText={props.onChangeText}
                                value={props.value}
                                autoCapitalize={"none"}
                                cursorColor={"#fff"}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    )
                }
                {
                    props.type === "password" && (
                        <View style={{
                            alignItems: "center",
                            flexDirection: "row",
                            height: '100%',
                        }}>
                            <SvgPassword
                                width={iconSize}
                                height={iconSize}
                                style={{marginLeft: r_w(10)}}
                                fill={"#fff"}
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    height: '100%',
                                    paddingHorizontal: r_w(10),
                                    paddingVertical: 0,
                                    color: '#fff',
                                    fontSize: 20,
                                    fontFamily: "Quattrocento Sans",
                                }}
                                placeholder={props.placeholder || "Password"}
                                placeholderTextColor="#B5B5B5FF"
                                secureTextEntry={pwVisible}
                                ref={props.passwordRef}
                                onSubmitEditing={props.onSubmitEditing}
                                onChangeText={props.onChangeText}
                                value={props.value}
                                autoCapitalize={"none"}
                                cursorColor={"#fff"}
                                underlineColorAndroid="transparent"
                            />
                            {
                                pwVisible && (
                                    <Animated.View entering={FadeIn} exiting={FadeOut} onTouchEnd={() => setPwVisible(false)}>
                                        <Ionicons
                                            name="eye-off-outline"
                                            size={iconSize}
                                            color="#fff"
                                            style={{marginRight: r_w(10)}}
                                        />
                                    </Animated.View>
                                )
                            }
                            {
                                !pwVisible && (
                                    <Animated.View entering={FadeIn} exiting={FadeOut} onTouchStart={() => {
                                        // haptic feedback

                                    }} onTouchEnd={() => setPwVisible(true)}>
                                        <Ionicons
                                            name="eye-outline"

                                            size={iconSize}
                                            color="#fff"
                                            style={{marginRight: r_w(10)}}
                                        />
                                    </Animated.View>
                                )
                            }
                        </View>
                    )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Box: {
        marginBottom: 16,
        // Provide sensible default size; can be overridden by props.style
        width: Math.round(r_w(WIDTH)),
        height: Math.round(r_h(HEIGHT)),
    }
})