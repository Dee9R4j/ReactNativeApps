import React, { useEffect } from 'react';
import { StyleSheet, View, Modal, StatusBar } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import { Svg, Path, G } from 'react-native-svg';

// This is the Mitsudomoe (Triple-Swirl).
// It's designed to look like it's in motion.
const MitsudomoeIcon = ({ size, color }: { size: number; color: string }) => {
    // Path for a single "tomoe" (comma)
    const tomoePath = "M 50 15 A 35 35 0 1 1 15 50 C 15 70 50 70 50 85 A 35 35 0 1 0 85 50 C 85 30 50 30 50 15 Z";

    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            <G>
                <Path d={tomoePath} fill={color} transform="rotate(0, 50, 50)" />
                <Path d={tomoePath} fill={color} transform="rotate(120, 50, 50)" />
                <Path d={tomoePath} fill={color} transform="rotate(240, 50, 50)" />
            </G>
        </Svg>
    );
};

// --- Props Interface ---
interface JapaneseLoadingScreenProps {
    visible: boolean;
    iconColor?: string;
    backgroundColor?: string;
}

// --- Main Loading Screen Component ---
export default function JapaneseLoadingScreen({
                                                  visible,
                                                  iconColor = '#DC2626', // Your theme's red
                                                  backgroundColor = '#000000',
                                              }: JapaneseLoadingScreenProps) {

    // --- We now have two animations ---

    // 1. For the continuous SPINNING
    const rotation = useSharedValue(0);

    // 2. For the PULSING glow
    const pulse = useSharedValue(0);

    useEffect(() => {
        // Start the spinning animation
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 2000,
                easing: Easing.linear, // Linear for a smooth, constant spin
            }),
            -1, // Infinite repeat
            false // Do not reverse
        );

        // Start the pulsing animation
        pulse.value = withRepeat(
            withTiming(1, {
                duration: 1800,
                easing: Easing.bezier(0.42, 0, 0.58, 1),
            }),
            -1, // Infinite repeat
            true // Reverse (pulse in and out)
        );
    }, [rotation, pulse]);

    // Style for the SPIN
    const animatedRotationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    // Style for the PULSE (glow)
    const animatedPulseStyle = useAnimatedStyle(() => {
        const scale = interpolate(pulse.value, [0, 1], [1, 1.1]); // Scale up 10%
        const opacity = interpolate(pulse.value, [0, 1], [0.7, 1]); // Fade from 70% to 100%

        return {
            transform: [{ scale: scale }],
            opacity: opacity,
        };
    });

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <StatusBar barStyle="light-content" />
            <View style={[styles.container, { backgroundColor }]}>

                {/* We nest the animations */}
                {/* Outer view handles the SPINNING */}
                <Animated.View style={animatedRotationStyle}>
                    {/* Inner view handles the PULSING/GLOW */}
                    <Animated.View style={animatedPulseStyle}>
                        <MitsudomoeIcon size={100} color={iconColor} />
                    </Animated.View>
                </Animated.View>

            </View>
        </Modal>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});