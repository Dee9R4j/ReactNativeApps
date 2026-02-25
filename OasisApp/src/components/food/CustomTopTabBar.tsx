import React, { useCallback } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import { type MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  Easing,
  withSpring,
} from "react-native-reanimated";

const TabButton = React.memo(
  ({
    route,
    index,
    isFocused,
    onPress,
    onLongPress,
    animatedPosition,
    accessibilityLabel,
  }: {
    route: any;
    index: number;
    isFocused: boolean;
    onPress: () => void;
    onLongPress: () => void;
    animatedPosition: Animated.SharedValue<number>;
    accessibilityLabel?: string;
  }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const onPressIn = useCallback(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0.7, { duration: 100 });
    }, []);

    const onPressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 150 });
    }, []);

    const animatedTextStyle = useAnimatedStyle(() => {
      const progress = Math.abs(animatedPosition.value - index);
      const isActive = progress < 0.5;
      return {
        color: withTiming(isActive ? "#fff" : "#666", { duration: 250 }),
      };
    }, [index]);

    const animatedButtonStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    });

    const label = route.name === "index" ? "Active" : "Completed";

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={{
          flex: 1,
          alignItems: "center",
          padding: 16,
        }}
      >
        <Animated.View style={animatedButtonStyle}>
          <Animated.Text
            style={[
              {
                fontSize: 16,
                fontWeight: "600",
                textTransform: "capitalize",
              },
              animatedTextStyle,
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

const Indicator = React.memo(
  ({
    state,
    animatedPosition,
  }: {
    state: MaterialTopTabBarProps["state"];
    animatedPosition: Animated.SharedValue<number>;
  }) => {
    const { width } = useWindowDimensions();
    const indicatorWidth = width / state.routes.length;

    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: indicatorWidth,
        transform: [
          {
            translateX: withSpring(animatedPosition.value * indicatorWidth, {
              damping: 20,
              stiffness: 150,
            }),
          },
        ],
      };
    }, [indicatorWidth]);

    return (
      <Animated.View
        style={[
          {
            height: 2,
            backgroundColor: "#fff",
            borderRadius: 1,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 3,
          },
          animatedStyle,
        ]}
      />
    );
  }
);

function CustomTopTabBar({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) {
  const animatedPosition = useSharedValue(state.index);
  React.useEffect(() => {
    animatedPosition.value = withTiming(state.index, { duration: 250 });
  }, [state.index]);

  React.useEffect(() => {
    if (!position) return;
    const listenerId = position.addListener(({ value }) => {
      animatedPosition.value = value;
    });
    return () => {
      position.removeListener(listenerId);
    };
  }, [position]);

  const createOnPress = useCallback(
    (routeName: string, routeKey: string, isFocused: boolean) => {
      return () => {
        const event = navigation.emit({
          type: "tabPress",
          target: routeKey,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(routeName);
        }
      };
    },
    [navigation]
  );

  const createOnLongPress = useCallback(
    (routeKey: string) => {
      return () => {
        navigation.emit({
          type: "tabLongPress",
          target: routeKey,
        });
      };
    },
    [navigation]
  );

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <View style={{ flexDirection: "row", backgroundColor: "transparent" }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          return (
            <TabButton
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              onPress={createOnPress(route.name, route.key, isFocused)}
              onLongPress={createOnLongPress(route.key)}
              animatedPosition={animatedPosition}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            />
          );
        })}
      </View>
      <Indicator state={state} animatedPosition={animatedPosition} />
    </View>
  );
}

export default CustomTopTabBar;
