import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import {r_h, r_w} from "@utils/responsive";

interface SegmentHighlightProps {
  activeSegment: SharedValue<number>;
  segmentCount?: number;
  style?: ViewStyle;
  segmentStyle?: ViewStyle;
  activeColor?: string;
  inactiveColor?: string;
}

export const SegmentHighlight: React.FC<SegmentHighlightProps> = ({
  activeSegment,
  segmentCount = 4,
  style,
  segmentStyle,
  activeColor = '#ff0000',
  inactiveColor = '#ffffff',
}) => {
  const segments = Array.from({ length: segmentCount }, (_, i) => i);

  return (
    <View style={[styles.container, style]}>
      {segments.map((index) => (
        <Segment
          key={index}
          index={index}
          activeSegment={activeSegment}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          style={segmentStyle}
        />
      ))}
    </View>
  );
};

interface SegmentProps {
  index: number;
  activeSegment: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
  style?: ViewStyle;
}

const Segment: React.FC<SegmentProps> = ({
  index,
  activeSegment,
  activeColor,
  inactiveColor,
  style,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = activeSegment.value === index;
    return {
      backgroundColor: withTiming(isActive ? activeColor : inactiveColor, {
        duration: 300,
      }),
      opacity: withTiming(isActive ? 1 : 0.5, {
        duration: 300,
      }),
      transform: [
        {
          scale: withTiming(isActive ? 1.1 : 1, {
            duration: 300,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.segment, animatedStyle, style]} />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: r_w(12),
  },
  segment: {
    width: r_w(32),
    height: r_h(4),
  },
});
