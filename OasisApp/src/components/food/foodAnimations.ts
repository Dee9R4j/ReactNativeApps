import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnUI,
  cancelAnimation,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  useDerivedValue,
  ReduceMotion,
} from "react-native-reanimated";
import { useEffect, useCallback } from "react";

export const SPRING_CONFIGS = {
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
  ultra: {
    damping: 30,
    stiffness: 250,
    mass: 0.6,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  },
} as const;

export const TIMING_CONFIGS = {
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
  linear: {
    duration: 300,
    easing: Easing.linear,
    reduceMotion: ReduceMotion.System,
  },
  entrance: {
    duration: 400,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    reduceMotion: ReduceMotion.System,
  },
} as const;

// ========================
// PRESS ANIMATION HOOK
// ========================

/**
 * Hook for press feedback animations
 * Returns scale shared value and animated style for button/card press interactions
 *
 * @param initialScale - Initial scale value (default: 1)
 * @returns Object containing scale, animatedStyle, onPressIn, and onPressOut handlers
 *
 * @example
 * ```tsx
 * const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
 *
 * <Animated.View style={animatedStyle}>
 *   <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
 *     ...
 *   </Pressable>
 * </Animated.View>
 * ```
 */
export const usePressAnimation = (initialScale: number = 1) => {
  const scale = useSharedValue(initialScale);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    "worklet";
    scale.value = withSpring(0.95, SPRING_CONFIGS.snappy);
  };

  const onPressOut = () => {
    "worklet";
    scale.value = withSpring(1, SPRING_CONFIGS.bouncy);
  };

  return { scale, animatedStyle, onPressIn, onPressOut };
};

// ========================
// FOOD SCREEN ENTRANCE ANIMATIONS
// ========================

/**
 * Hook for food screen entrance choreography.
 * Orchestrates header slide, search expansion, and content reveal.
 * All animations run on UI thread.
 *
 * @param enabled - Whether animations should run (default: true)
 * @returns Animated styles for different screen sections
 *
 * @example
 * ```tsx
 * const { headerStyle, searchStyle, contentStyle } = useFoodScreenEntrance();
 * <Animated.View style={headerStyle}>...</Animated.View>
 * ```
 */
export const useFoodScreenEntrance = (enabled: boolean = true) => {
  // const headerTranslateY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const searchScale = useSharedValue(0.9);
  const searchOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (!enabled) return;

    const animateEntrance = () => {
      "worklet";
      // Header slide and fade
      // headerTranslateY.value = withSpring(0, SPRING_CONFIGS.bouncy);
      headerOpacity.value = withTiming(1, TIMING_CONFIGS.medium);

      // Search bar expansion
      searchScale.value = withDelay(150, withSpring(1, SPRING_CONFIGS.gentle));
      searchOpacity.value = withDelay(
        150,
        withTiming(1, TIMING_CONFIGS.medium)
      );

      // Content reveal
      contentOpacity.value = withDelay(
        300,
        withTiming(1, TIMING_CONFIGS.entrance)
      );
    };

    runOnUI(animateEntrance)();

    return () => {
      // cancelAnimation(headerTranslateY);
      cancelAnimation(headerOpacity);
      cancelAnimation(searchScale);
      cancelAnimation(searchOpacity);
      cancelAnimation(contentOpacity);
    };
  }, [enabled]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    // transform: [{ translateY: headerTranslateY.value }],
  }));

  const searchStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ scale: searchScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return { headerStyle, searchStyle, contentStyle };
};

// ========================
// FILTER MODAL ANIMATIONS
// ========================

/**
 * Hook for filter modal spring-down animations.
 * Modal chips spring from header position with stagger effect.
 *
 * @param isVisible - Whether modal is visible
 * @param itemCount - Number of items to animate
 * @returns Array of animated styles for each item
 *
 * @example
 * ```tsx
 * const filterStyles = useFilterModalAnimation(isOpen, 3);
 * filterOptions.map((opt, i) => <Animated.View style={filterStyles[i]}>...</Animated.View>)
 * ```
 */
export const useFilterModalAnimation = (
  isVisible: boolean,
  itemCount: number = 1
) => {
  const items = Array.from({ length: itemCount }, () => ({
    translateY: useSharedValue(0),
    opacity: useSharedValue(0),
    scale: useSharedValue(0.8),
  }));

  useEffect(() => {
    items.forEach((item, index) => {
      const animate = () => {
        "worklet";
        if (isVisible) {
          const delay = index * 50;
          item.translateY.value = withDelay(
            delay,
            withSpring(0, SPRING_CONFIGS.bouncy)
          );
          item.opacity.value = withDelay(
            delay,
            withTiming(1, TIMING_CONFIGS.medium)
          );
          item.scale.value = withDelay(
            delay,
            withSpring(1, SPRING_CONFIGS.snappy)
          );
        } else {
          item.translateY.value = withTiming(0, TIMING_CONFIGS.fast);
          item.opacity.value = withTiming(0, TIMING_CONFIGS.fast);
          item.scale.value = withTiming(0.8, TIMING_CONFIGS.fast);
        }
      };

      runOnUI(animate)();
    });
  }, [isVisible]);

  return items.map((item) =>
    useAnimatedStyle(() => ({
      opacity: item.opacity.value,
      transform: [
        { translateY: item.translateY.value },
        { scale: item.scale.value },
      ],
    }))
  );
};

// ========================
// STALL CARD STREAMING ANIMATION
// ========================

/**
 * Hook for stall card streaming entrance with cross-fade on filter changes.
 * Provides smooth transitions when cards update.
 *
 * @param index - Card index for stagger
 * @param filterVersion - Version number that changes when filter updates
 * @returns Animated style for card
 *
 * @example
 * ```tsx
 * const cardStyle = useStallCardStream(index, filterVersion);
 * <Animated.View style={cardStyle}>...</Animated.View>
 * ```
 */
export const useStallCardStream = (
  index: number,
  filterVersion: number = 0
) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(15);

  useEffect(() => {
    const animate = () => {
      "worklet";
      const delay = Math.min(index * 60, 500);

      opacity.value = withDelay(delay, withTiming(1, TIMING_CONFIGS.medium));
      scale.value = withDelay(delay, withSpring(1, SPRING_CONFIGS.gentle));
      translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIGS.snappy));
    };

    runOnUI(animate)();
  }, [index, filterVersion]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));
};

// ========================
// HERO PARALLAX AND SCROLL ANIMATIONS
// ========================

/**
 * Hook for advanced hero parallax with smooth header collapse.
 * Provides scroll-based animations for hero image, text, and header.
 *
 * @returns Object with scroll handler and animated styles
 *
 * @example
 * ```tsx
 * const { scrollHandler, heroStyle, headerStyle } = useHeroParallax();
 * <Animated.ScrollView onScroll={scrollHandler}>...</Animated.ScrollView>
 * ```
 */
export const useHeroParallax = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroImageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 250],
      [0, -60],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.4, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const heroOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 180],
      [1, 0.2],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const heroTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 150],
      [0, -20],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const headerStickyStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [150, 200],
      [50, 0],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [150, 200],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return {
    scrollHandler,
    scrollY,
    heroImageStyle,
    heroOpacityStyle,
    heroTextStyle,
    headerStickyStyle,
  };
};

// ========================
// MENU ITEM QUANTITY ANIMATION
// ========================

/**
 * Hook for menu item quantity pill animations.
 * Runs entirely as worklet for smooth UI-thread updates.
 *
 * @param quantity - Current quantity value
 * @returns Animated styles for quantity display
 *
 * @example
 * ```tsx
 * const { quantityStyle, pulseStyle } = useQuantityAnimation(quantity);
 * <Animated.Text style={quantityStyle}>{quantity}</Animated.Text>
 * ```
 */
export const useQuantityAnimation = (quantity: number) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (quantity > 0) {
      const animate = () => {
        "worklet";
        scale.value = withSequence(
          withSpring(1.3, SPRING_CONFIGS.ultra),
          withSpring(1, SPRING_CONFIGS.gentle)
        );
        opacity.value = withSequence(
          withTiming(0.7, TIMING_CONFIGS.fast),
          withTiming(1, TIMING_CONFIGS.fast)
        );
      };

      runOnUI(animate)();
    }
  }, [quantity]);

  const quantityStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { quantityStyle };
};

// ========================
// CART SUCCESS/ERROR MICRO-ANIMATIONS
// ========================

/**
 * Hook for cart action success/error feedback animations.
 * Provides visual confirmation with color and scale effects.
 *
 * @param status - Current status: 'idle' | 'success' | 'error'
 * @returns Animated style for feedback
 *
 * @example
 * ```tsx
 * const feedbackStyle = useCartFeedbackAnimation(orderStatus);
 * <Animated.View style={feedbackStyle}>...</Animated.View>
 * ```
 */
export const useCartFeedbackAnimation = (
  status: "idle" | "success" | "error"
) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const animate = () => {
      "worklet";
      if (status === "success") {
        scale.value = withSequence(
          withSpring(1.15, SPRING_CONFIGS.bouncy),
          withSpring(1, SPRING_CONFIGS.gentle)
        );
      } else if (status === "error") {
        scale.value = withSequence(
          withSpring(0.95, SPRING_CONFIGS.snappy),
          withSpring(1.05, SPRING_CONFIGS.snappy),
          withSpring(1, SPRING_CONFIGS.gentle)
        );
      }
    };

    if (status !== "idle") {
      runOnUI(animate)();
    }
  }, [status]);

  const feedbackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return feedbackStyle;
};

// ========================
// CROSS-FADE TRANSITION
// ========================

/**
 * Hook for cross-fade transitions when content changes.
 * Useful for filter changes, search results, etc.
 *
 * @param trigger - Value that triggers transition
 * @returns Animated style with opacity transition
 *
 * @example
 * ```tsx
 * const fadeStyle = useCrossFadeTransition(searchQuery);
 * <Animated.View style={fadeStyle}>...</Animated.View>
 * ```
 */
export const useCrossFadeTransition = (trigger: any) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    const animate = () => {
      "worklet";
      opacity.value = withSequence(
        withTiming(0, TIMING_CONFIGS.fast),
        withTiming(1, TIMING_CONFIGS.medium)
      );
    };

    runOnUI(animate)();
  }, [trigger]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
};

// ========================
// SCROLL-TO-TOP BUTTON
// ========================

/**
 * Hook for scroll-to-top button visibility animation.
 * Shows/hides button based on scroll position.
 *
 * @param scrollY - Shared value tracking scroll position
 * @param threshold - Scroll threshold to show button (default: 300)
 * @returns Animated style for button
 *
 * @example
 * ```tsx
 * const buttonStyle = useScrollToTopButton(scrollY, 300);
 * <Animated.View style={buttonStyle}>...</Animated.View>
 * ```
 */
export const useScrollToTopButton = (scrollY: any, threshold: number = 300) => {
  const isVisible = useDerivedValue(() => {
    return scrollY.value > threshold;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(isVisible.value ? 1 : 0, TIMING_CONFIGS.medium);
    const scale = withSpring(isVisible.value ? 1 : 0.8, SPRING_CONFIGS.snappy);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return animatedStyle;
};
