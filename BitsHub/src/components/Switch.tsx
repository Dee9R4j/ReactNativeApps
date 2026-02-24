import React, { FC, useEffect} from 'react';
import { View, ViewStyle, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useDerivedValue, withTiming, interpolateColor } from 'react-native-reanimated';

interface SwitchProps {
    active: boolean;
    activeColor: string;
    inactiveColor: string;
    thumbColor: string;
    duration?: number;
    scale?: number;
    onToggle: (isActive: boolean) => void;
    style?: ViewStyle;
}

const Switch: FC<SwitchProps> = ({
    active,
    activeColor,
    inactiveColor,
    thumbColor,
    duration = 150,
    scale = 1,
    onToggle,
    style,
}) => {
    const slide = useSharedValue(active ? 18 : 0);
    const progress = useSharedValue(active ? 1 : 0);

    useEffect(() => {
        slide.value = withSpring(active? 18 : 0, {
            damping: 15,
            stiffness: 250,
        })

        progress.value = withTiming(active ? 1 : 0, {
            duration,
        })
    }, [active]);

    const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: slide.value}],
    }))

    const animatedBackground = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0,1],
            [inactiveColor, activeColor]
        )
        return {backgroundColor};
    })

    return (
        <Pressable
            onPress={() => onToggle(!active)} >
            <Animated.View
                style={[
                    styles.container,
                    animatedBackground,
                    {
                        transform: [{ scale }],
                    },
                    style,
                ]}
            >
                <Animated.View
                    style={[
                        styles.circle,
                        animatedCircleStyle,
                        {
                            backgroundColor: thumbColor,
                        },
                    ]}
                />
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 20,
        borderRadius: 30,
        justifyContent: 'center',
        padding: 2,
        elevation: 2,
    },
    circle: {
        width: 18,
        height: 18,
        borderRadius: 30,
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        elevation: 5,
    },
});


export default Switch;
