import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

// @ts-ignore
const CustomHandle = ({ animatedIndex }) => {
    const animatedHandleStyle = useAnimatedStyle(() => {
        const scale = interpolate(animatedIndex.value, [0, 1], [1, 1.2]);
        const opacity = interpolate(animatedIndex.value, [0, 1], [0.8, 1]);
        return {
            transform: [{ scale }],
            opacity,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedHandleStyle]}>
            <View style={styles.handle} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    handle: {
        width: 100,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#fff',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
});

export default CustomHandle;
