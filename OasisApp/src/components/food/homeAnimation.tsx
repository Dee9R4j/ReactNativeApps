import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnUI,
  cancelAnimation,
  ReduceMotion,
} from "react-native-reanimated";
import { useEffect, useMemo } from "react";

// ========================
// SPRING AND TIMING CONFIGS
// ========================

export const HOME_SPRING_CONFIGS = {
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  },
  bouncy: {
    damping: 15,
    stiffness: 150,
    mass: 1,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  },
  snappy: {
    damping: 25,
    stiffness: 200,
    mass: 0.8,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  },
  button: {
    damping: 18,
    stiffness: 180,
    mass: 0.9,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  },
} as const;

export const HOME_TIMING_CONFIGS = {
  fast: {
    duration: 200,
    easing: Easing.out(Easing.quad),
    reduceMotion: ReduceMotion.System,
  },
  medium: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
    reduceMotion: ReduceMotion.System,
  },
  slow: {
    duration: 500,
    easing: Easing.out(Easing.cubic),
    reduceMotion: ReduceMotion.System,
  },
  entrance: {
    duration: 600,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    reduceMotion: ReduceMotion.System,
  },
} as const;

// ========================
// SCREEN ENTRANCE CHOREOGRAPHY
// ========================

/**
 * Hook for orchestrating home screen entrance animations.
 * Returns animated values and styles for background, header, and buttons.
 * All animations run on UI thread via worklets.
 *
 * @param enabled - Whether animations should run (default: true)
 * @returns Object with animated styles for each screen section
 *
 * @example
 * ```tsx
 * const { backgroundStyle, headerStyle, getButtonStyle } = useHomeScreenEntrance();
 * <Animated.View style={backgroundStyle}>...</Animated.View>
 * ```
 */
export const useHomeScreenEntrance = (enabled: boolean = true) => {
  const backgroundOpacity = useSharedValue(0);
  const backgroundScale = useSharedValue(0.95);
  // const headerTranslateY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (!enabled) return;

    const animateEntrance = () => {
      "worklet";
      // Background animation
      backgroundOpacity.value = withTiming(1, HOME_TIMING_CONFIGS.entrance);
      backgroundScale.value = withSpring(1, HOME_SPRING_CONFIGS.gentle);

      // Header reveal with delay
      // headerTranslateY.value = withDelay(
      //   150,
      //   withSpring(0, HOME_SPRING_CONFIGS.bouncy)
      // );
      headerOpacity.value = withDelay(
        150,
        withTiming(1, HOME_TIMING_CONFIGS.medium)
      );

      // Content fade-in
      contentOpacity.value = withDelay(
        300,
        withTiming(1, HOME_TIMING_CONFIGS.medium)
      );
    };

    runOnUI(animateEntrance)();

    return () => {
      cancelAnimation(backgroundOpacity);
      cancelAnimation(backgroundScale);
      // cancelAnimation(headerTranslateY);
      cancelAnimation(headerOpacity);
      cancelAnimation(contentOpacity);
    };
  }, [enabled]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    transform: [{ scale: backgroundScale.value }],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    // transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return { backgroundStyle, headerStyle, contentStyle };
};

// ========================
// STAGGERED BUTTON ANIMATIONS
// ========================

export const useStaggeredButtonEntrance = (
  index: number,
  delay: number = 400,
  enabled: boolean = true
) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!enabled) return;

    const staggerDelay = delay + index * 80;

    const animateButton = () => {
      "worklet";
      scale.value = withDelay(
        staggerDelay,
        withSpring(1, HOME_SPRING_CONFIGS.bouncy)
      );
      opacity.value = withDelay(
        staggerDelay,
        withTiming(1, HOME_TIMING_CONFIGS.medium)
      );
    };

    runOnUI(animateButton)();

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [index, delay, enabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
};

// ========================
// BUTTON PRESS WITH DIRECTIONAL FEEDBACK
// ========================

/**
 * Enhanced press animation hook with directional visual feedback.
 * Provides scale, opacity, and optional directional shift on press.
 * All animations run as worklets on UI thread.
 *
 * @param direction - Direction for press shift: 'none' | 'up' | 'down' | 'left' | 'right'
 * @returns Object with animated style and press handlers
 *
 * @example
 * ```tsx
 * const { animatedStyle, onPressIn, onPressOut } = useDirectionalPressAnimation('down');
 * <Animated.View style={animatedStyle}>
 *   <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>...</Pressable>
 * </Animated.View>
 * ```
 */
export const useDirectionalPressAnimation = (
  direction: "none" | "up" | "down" | "left" | "right" = "none"
) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  // const translateY = useSharedValue(0);

  const onPressIn = () => {
    "worklet";
    scale.value = withSpring(0.96, HOME_SPRING_CONFIGS.snappy);
    opacity.value = withTiming(0.85, HOME_TIMING_CONFIGS.fast);

    // Apply directional shift
    //   if (direction === "up") {
    //     translateY.value = withSpring(-3, HOME_SPRING_CONFIGS.snappy);
    //   } else if (direction === "down") {
    //     translateY.value = withSpring(3, HOME_SPRING_CONFIGS.snappy);
    //   }
    //    else if (direction === "left") {
    //     translateX.value = withSpring(-3, HOME_SPRING_CONFIGS.snappy);
    //   } else if (direction === "right") {
    //     translateX.value = withSpring(3, HOME_SPRING_CONFIGS.snappy);
    //   }
  };

  const onPressOut = () => {
    "worklet";
    scale.value = withSpring(1, HOME_SPRING_CONFIGS.bouncy);
    opacity.value = withTiming(1, HOME_TIMING_CONFIGS.medium);
    translateX.value = withSpring(0, HOME_SPRING_CONFIGS.bouncy);
    // translateY.value = withSpring(0, HOME_SPRING_CONFIGS.bouncy);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      // { translateY: translateY.value },
    ],
  }));

  return { animatedStyle, onPressIn, onPressOut };
};

// ========================
// DRAWER ANIMATION UTILITIES
// ========================

/**
 * Hook for drawer overlay and parallax animations.
 * Provides smooth dim effect and content parallax when drawer opens.
 *
 * @param isOpen - Whether drawer is open
 * @returns Animated styles for overlay and content
 *
 * @example
 * ```tsx
 * const { overlayStyle, contentStyle } = useDrawerAnimation(isDrawerOpen);
 * ```
 */
export const useDrawerAnimation = (isOpen: boolean) => {
  const overlayOpacity = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      "worklet";
      if (isOpen) {
        overlayOpacity.value = withTiming(0.6, HOME_TIMING_CONFIGS.medium);
        contentTranslateX.value = withSpring(20, HOME_SPRING_CONFIGS.gentle);
      } else {
        overlayOpacity.value = withTiming(0, HOME_TIMING_CONFIGS.medium);
        contentTranslateX.value = withSpring(0, HOME_SPRING_CONFIGS.gentle);
      }
    };

    runOnUI(animate)();
  }, [isOpen]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentTranslateX.value }],
  }));

  return { overlayStyle, contentStyle };
};

// ========================
// LAYOUT METRICS CACHING
// ========================

/**
 * Hook to cache layout metrics as shared values for performance.
 * Prevents re-measuring on each render by storing values on UI thread.
 *
 * @param metrics - Object containing layout measurements
 * @returns Cached metrics object
 *
 * @example
 * ```tsx
 * const metrics = useLayoutMetrics({ width: 100, height: 200 });
 * ```
 */
export const useLayoutMetrics = <T extends Record<string, number>>(
  metrics: T
) => {
  return useMemo(() => {
    const cached: Record<string, any> = {};
    Object.entries(metrics).forEach(([key, value]) => {
      cached[key] = value;
    });
    return cached as T;
  }, [JSON.stringify(metrics)]);
};

// ========================
// ICON ROTATION ANIMATION
// ========================

/**
 * Hook for smooth icon rotation animations (e.g., menu, filter icons).
 * Runs on UI thread for jank-free rotation.
 *
 * @param isActive - Whether icon should be in active/rotated state
 * @param rotation - Target rotation in degrees (default: 180)
 * @returns Animated style with rotation
 *
 * @example
 * ```tsx
 * const iconStyle = useIconRotation(isFilterOpen, 90);
 * <Animated.View style={iconStyle}>...</Animated.View>
 * ```
 */
export const useIconRotation = (isActive: boolean, rotation: number = 180) => {
  const rotate = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      "worklet";
      rotate.value = withSpring(
        isActive ? rotation : 0,
        HOME_SPRING_CONFIGS.snappy
      );
    };

    runOnUI(animate)();
  }, [isActive, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return animatedStyle;
};

// ========================
// SEQUENTIAL TRANSITION UTILITY
// ========================

/**
 * Utility function to create sequential animations with delays.
 * Useful for choreographed multi-element transitions.
 *
 * @param animations - Array of animation configs with delays
 * @returns Function to trigger all animations
 *
 * @example
 * ```tsx
 * const triggerSequence = useSequentialTransition([
 *   { value: opacity, target: 1, delay: 0 },
 *   { value: scale, target: 1, delay: 100 }
 * ]);
 * ```
 */
export const createSequentialAnimation = (
  animations: Array<{
    value: any;
    target: number;
    delay: number;
    type?: "spring" | "timing";
  }>
) => {
  "worklet";
  animations.forEach(({ value, target, delay, type = "spring" }) => {
    if (type === "spring") {
      value.value = withDelay(
        delay,
        withSpring(target, HOME_SPRING_CONFIGS.bouncy)
      );
    } else {
      value.value = withDelay(
        delay,
        withTiming(target, HOME_TIMING_CONFIGS.medium)
      );
    }
  });
};
