import {StyleSheet, View} from "react-native"
import {Canvas, vec, LinearGradient, Rect} from "@shopify/react-native-skia";
import React from "react";
import {r_w} from "@utils/responsive";

interface proptypes {
    width: number,
    height: number,
    border: number,
    children: React.ReactNode,
    padding?: number,
}

export function GradientBox(props: proptypes) {

    const W = props.width
    const H = props.height
    const BORDER = props.border

    const border = Math.max(1, Math.round(r_w(BORDER)));
    const borderX = border;
    const borderY = border;

    const innerW = Math.max(0, W - 2 * borderX);
    const innerH = Math.max(0, H - 2 * borderY);
    return (
        <View style={{
            width: W,
            height: H,
            margin: props.padding ? props.padding : 0,
        }}>
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
            <View style={{
                position: 'absolute',
                
                top: borderY,
                left: borderX,
                right: borderX,
                bottom: borderY,
                // backgroundColor: '#aa0000',
                overflow: 'hidden',
            }}>
                {props.children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})