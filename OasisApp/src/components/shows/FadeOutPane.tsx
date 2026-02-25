import React from "react";
import {Canvas, LinearGradient, Rect, vec} from "@shopify/react-native-skia";

interface proptypes {
    height: number,
    width: number,
    zIndex?: number,
}

export function FadeOutPane({height, width, zIndex}: proptypes) {
    return (
        <Canvas style={{width, height, zIndex}} pointerEvents="none">
            <Rect x={0} y={0} width={width} height={height}>
                <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, height)}
                    colors={["rgba(0,0,0,0.95)", "rgba(0,0,0,0.0)"]}
                />
            </Rect>
        </Canvas>
    );
}