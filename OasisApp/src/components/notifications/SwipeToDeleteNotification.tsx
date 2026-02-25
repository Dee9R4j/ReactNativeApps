import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import type { NotificationItem } from '@/state/base/notificationSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.2;
const MAX_SWIPE_DISTANCE = -SCREEN_WIDTH * 0.25;

interface SwipeToDeleteNotificationProps {
  notification: NotificationItem;
  onDelete: (id: number) => void;
  children: React.ReactNode;
}

const SwipeToDeleteNotification: React.FC<SwipeToDeleteNotificationProps> = ({
  notification,
  onDelete,
  children,
}) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(1);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const isDeleting = useSharedValue(false);

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, []);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      isDeleting.value = false; 
    },
    onActive: (event, ctx) => {
      const newTranslateX = ctx.startX + event.translationX;
      translateX.value = Math.max(MAX_SWIPE_DISTANCE, Math.min(0, newTranslateX));
    },
    onEnd: () => {
      const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;

      if (shouldBeDismissed) {
        isDeleting.value = true;
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
        itemHeight.value = withTiming(0, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onDelete)(notification.id);
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
    opacity: opacity.value,
    height: itemHeight.value === 1 ? undefined : itemHeight.value,
  }));

  const rDeleteBackgroundStyle = useAnimatedStyle(() => {
    const bgOpacity = interpolate(
      translateX.value,
      [0, TRANSLATE_X_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity: bgOpacity,
    };
  });
  
  const rDeleteContentStyle = useAnimatedStyle(() => {
    const swipeOpacity = interpolate(
      translateX.value,
      [0, TRANSLATE_X_THRESHOLD * 0.8],
      [0, 1],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      translateX.value,
      [0, TRANSLATE_X_THRESHOLD],
      [0.8, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity: isDeleting.value ? withTiming(0, { duration: 150 }) : swipeOpacity,
    };
  });


  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteBackground, rDeleteBackgroundStyle]}>
        <Animated.View style={[styles.deleteContent, rDeleteContentStyle]}>
          <Ionicons name="trash" size={24} color="#fff" />
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </Animated.View>

      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={rStyle}>{children}</Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 12,
    paddingRight: 30,
  },
  deleteContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default SwipeToDeleteNotification;