import React from "react";
import { Tabs, useNavigation } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useAnimatedProps,
} from "react-native-reanimated";

import Header from "@/components/Header";
import EventsIcon from "@assets/icons/tabevents.svg";
import MyEventsIcon from "@assets/icons/tabmyevents.svg";

const AnimatedEventsIcon = Animated.createAnimatedComponent(EventsIcon);
const AnimatedMyEventsIcon = Animated.createAnimatedComponent(MyEventsIcon);

interface SvgIconProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
}

function TabBarIcon({
  IconComponent,
  label,
  color,
  focused,
  isOutline,
}: {
  IconComponent: React.ComponentType<SvgIconProps & { animatedProps?: any }>;
  label: string;
  color: string;
  focused: boolean;
  isOutline?: boolean;
}) {
  const isFocused = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    isFocused.value = withTiming(focused ? 1 : 0, {
      duration: 200,
    });
  }, [focused]);

  const iconProps: SvgIconProps = {
    width: 44,
    height: 44,
  };

  const animatedWrapperStyle = useAnimatedStyle(() => {
    const minWidth = label === "Events" ? 134 : 164;
    return {
      minWidth: withTiming(isFocused.value ? minWidth : 44),
      paddingHorizontal: withTiming(isFocused.value ? 12 : 0),
      paddingVertical: withTiming(isFocused.value ? 8 : 0),
      borderWidth: withTiming(isFocused.value ? 1 : 0),
      borderRadius: 6,
      borderColor: "#AAAAAA",
    };
  });

  const animatedIconProps = useAnimatedProps(() => {
    const colorValue = interpolateColor(
      isFocused.value,
      [0, 1],
      [color, "white"]
    );
    if (isOutline) {
      return { stroke: colorValue, fill: "none" };
    }
    return { fill: colorValue };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: isFocused.value,
      marginLeft: withTiming(isFocused.value ? 5 : 0),
      width: withTiming(isFocused.value ? "auto" : 0),
    };
  });

  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        animatedWrapperStyle,
        { flexDirection: "row" },
      ]}
    >
      <IconComponent {...iconProps} animatedProps={animatedIconProps} />
      <Animated.Text style={[styles.labelTextFocused, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Animated.View>
  );
}

const AnimatedTabBarButton = ({
  children,
  onPress,
  ...rest
}: {
  children: React.ReactNode;
  onPress?: (event: any) => void;
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withTiming(0.9, { duration: 100 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
      onPress={onPress}
      style={{ flex: 1 }}
      {...rest}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        header: () => (
          <Header
            onMenuPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        ),
        tabBarActiveTintColor: "#D9D9D9",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#09011C",
          borderWidth: 0.5,
          borderBottomWidth: 0,
          borderColor: "#1F005B",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: "absolute",
          paddingHorizontal: 43,
          paddingTop: 8,
          paddingBottom: 8,
          bottom: 0,
          height: 92,
          shadowColor: "#5600FD",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 1,
          shadowRadius: 4,
          elevation: 4,
          display: "flex",
        },
      }}
    >
      <Tabs.Screen
        name="events/index"
        options={{
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              IconComponent={AnimatedEventsIcon}
              color={color}
              focused={focused}
              label="Events"
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="myevents/index"
        options={{
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              IconComponent={AnimatedMyEventsIcon}
              color={color}
              focused={focused}
              label="My Events"
              isOutline={true}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="eventdetails/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="myeventdetails/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  labelTextFocused: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Manrope-SemiBold-600",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 21,
    marginLeft: 5,
  },
});
