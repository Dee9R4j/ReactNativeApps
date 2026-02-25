import React, { useCallback } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
    Layout, // Import Layout
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    useDerivedValue,
    Easing,
} from "react-native-reanimated";
import {
    Canvas,
    Path,
    Skia,
} from "@shopify/react-native-skia";

export const SkiaBorderWrapper = ({
    children,
}: {
    children?: React.ReactNode;
}) => {
    const animatedSize = {
        width: useSharedValue(0),
        height: useSharedValue(0),
    };
    const opacity = useSharedValue(0);
    const isFirstLayout = useSharedValue(true);
    const verticalOffset = 15;
    const horizontalOffset = 50;
    const borderColor = "#FFFFFF";

    const trapeziumPath = useDerivedValue(() => {
        const w = animatedSize.width.value;
        const h = animatedSize.height.value;

        if (w === 0 || h === 0) return Skia.Path.Make();

        const path = Skia.Path.Make();
        path.moveTo(0, 0);
        path.lineTo(w, 0);
        path.lineTo(w, h - verticalOffset);
        path.lineTo(w - horizontalOffset, h);
        path.lineTo(horizontalOffset, h);
        path.lineTo(0, h - verticalOffset);
        path.close();
        return path;
    });

    const animatedOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;

        if (
            width === animatedSize.width.value &&
            height === animatedSize.height.value &&
            !isFirstLayout.value
        ) {
            return;
        }

        if (isFirstLayout.value) {
            animatedSize.width.value = width;
            animatedSize.height.value = height;
            opacity.value = withTiming(1, { duration: 300 });
            isFirstLayout.value = false;
        } else {
            // This now runs on every frame of the animation
            animatedSize.width.value = width;
            animatedSize.height.value = height;
        }
    }, []);

    return (
        // This parent View does NOT get the layout prop
        <Animated.View
            style={[styles.wrapper, animatedOpacityStyle]}
        >
            {/* This child View DOES get the layout prop */}
            <Animated.View 
                onLayout={handleLayout}
                // ✅ ADDED THIS PROP
                layout={Layout.springify().mass(1).damping(80)}
            >
                {children}
            </Animated.View>

            <View style={styles.canvasContainer} pointerEvents="none">
                <Canvas style={StyleSheet.absoluteFill}>
                    <Path
                        path={trapeziumPath}
                        color={borderColor}
                        style="stroke"
                        strokeWidth={4}
                    />
                </Canvas>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
        marginBottom: 16,
    },
    canvasContainer: {
        ...StyleSheet.absoluteFillObject,
    },
});