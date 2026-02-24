import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Link, useSegments, router } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useAnimatedProps,
} from "react-native-reanimated";

import EventsIcon from "@assets/icons/drawerevents.svg";
import MyEventsIcon from "@assets/icons/drawermyevents.svg";
import LogoutIcon from "@assets/icons/drawerlogout.svg";
import { useSecureStore } from "@/state/secure/secure";

import type { DrawerContentComponentProps } from "@react-navigation/drawer";

const AnimatedEventsIcon = Animated.createAnimatedComponent(EventsIcon);
const AnimatedMyEventsIcon = Animated.createAnimatedComponent(MyEventsIcon);

function DrawerContent(props: DrawerContentComponentProps) {
  const segments = useSegments();
  const logOut = useSecureStore((state) => state.logOut);

  const isActive = (screenSegment: string) => {
    const page = segments.length > 1 ? segments[1] : "";
    const tab = segments.length > 2 ? segments[2] : "";

    if (screenSegment === "events") {
      return page === "tabs" && (tab === "events" || tab === "");
    }
    if (screenSegment === "myevents") {
      return page === "tabs" && tab === "myevents";
    }
    return false;
  };

  const closeDrawer = () => {
    props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  const eventsScale = useSharedValue(1);
  const myEventsScale = useSharedValue(1);
  const logoutScale = useSharedValue(1);

  const eventsActive = useSharedValue(0);
  const myEventsActive = useSharedValue(0);

  React.useEffect(() => {
    eventsActive.value = withTiming(isActive("events") ? 1 : 0, {
      duration: 200,
    });
    myEventsActive.value = withTiming(isActive("myevents") ? 1 : 0, {
      duration: 200,
    });
  }, [segments]);

  const eventsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eventsScale.value }],
  }));
  const myEventsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: myEventsScale.value }],
  }));
  const logoutAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoutScale.value }],
  }));

  const eventsItemAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      eventsActive.value,
      [0, 1],
      ["#1f005b", "#f2f2f2"]
    );
    const width = withTiming(eventsActive.value ? 186 : 158);
    const opacity = withTiming(eventsActive.value ? 0.99 : 0.8);
    return { backgroundColor, width, opacity };
  });

  const eventsIconAnimatedProps = useAnimatedProps(() => {
    return {
      color: interpolateColor(eventsActive.value, [0, 1], ["#fff", "#1F005B"]),
      fill: interpolateColor(
        eventsActive.value,
        [0, 1],
        ["#fff", "rgba(0,0,0,0)"]
      ),
    };
  });

  const eventsTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(eventsActive.value, [0, 1], ["#fff", "#1f005b"]),
    };
  });

  const myEventsItemAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      myEventsActive.value,
      [0, 1],
      ["#1f005b", "#f2f2f2"]
    );
    const width = withTiming(myEventsActive.value ? 186 : 158);
    const opacity = withTiming(myEventsActive.value ? 0.99 : 0.8);
    return { backgroundColor, width, opacity };
  });

  const myEventsIconAnimatedProps = useAnimatedProps(() => {
    return {
      stroke: interpolateColor(
        myEventsActive.value,
        [0, 1],
        ["#fff", "#1F005B"]
      ),
      fill: interpolateColor(
        myEventsActive.value,
        [0, 1],
        ["#fff", "rgba(0,0,0,0)"]
      ),
    };
  });

  const myEventsTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        myEventsActive.value,
        [0, 1],
        ["#fff", "#1f005b"]
      ),
    };
  });

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>BITSHub</Text>
      </View>

      <View style={styles.drawerItemsContainer}>
        <Link href="/private/tabs/events" asChild>
          <Pressable
            onPressIn={() =>
              (eventsScale.value = withTiming(0.95, { duration: 100 }))
            }
            onPressOut={() =>
              (eventsScale.value = withTiming(1, { duration: 100 }))
            }
            onPress={closeDrawer}
          >
            <Animated.View style={eventsAnimatedStyle}>
              <Animated.View
                style={[styles.drawerItem, eventsItemAnimatedStyle]}
              >
                <View style={styles.drawerIcon}>
                  <AnimatedEventsIcon
                    width={29.32}
                    height={29.32}
                    animatedProps={eventsIconAnimatedProps}
                  />
                </View>
                <Animated.Text
                  style={[
                    styles.drawerItemText,
                    eventsTextAnimatedStyle,
                    isActive("events") && styles.activeDrawerItemText,
                  ]}
                >
                  Events
                </Animated.Text>
              </Animated.View>
            </Animated.View>
          </Pressable>
        </Link>

        <Link href="/private/tabs/myevents" asChild>
          <Pressable
            onPressIn={() =>
              (myEventsScale.value = withTiming(0.95, { duration: 100 }))
            }
            onPressOut={() =>
              (myEventsScale.value = withTiming(1, { duration: 100 }))
            }
            onPress={closeDrawer}
          >
            <Animated.View style={myEventsAnimatedStyle}>
              <Animated.View
                style={[styles.drawerItem, myEventsItemAnimatedStyle]}
              >
                <AnimatedMyEventsIcon
                  width={27.789}
                  height={32}
                  style={styles.drawerIcon}
                  animatedProps={myEventsIconAnimatedProps}
                />
                <Animated.Text
                  style={[
                    styles.drawerItemText,
                    myEventsTextAnimatedStyle,
                    isActive("myevents") && styles.activeDrawerItemText,
                  ]}
                >
                  My Events
                </Animated.Text>
              </Animated.View>
            </Animated.View>
          </Pressable>
        </Link>

        <Pressable
          onPressIn={() =>
            (logoutScale.value = withTiming(0.95, { duration: 100 }))
          }
          onPressOut={() =>
            (logoutScale.value = withTiming(1, { duration: 100 }))
          }
          onPress={() => {
            closeDrawer();
            logOut();
            router.replace("/login/authentication");
          }}
        >
          <Animated.View style={logoutAnimatedStyle}>
            <View style={[styles.drawerItem, styles.logoutButton]}>
              <LogoutIcon
                width={25.781}
                height={26.853}
                stroke={"#fff"}
                fill={"none"}
                style={styles.drawerIcon}
              />
              <Text style={styles.drawerItemText}>Logout</Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>
      <Text style={styles.drawerFooter}>Made with ❤️ by DVM</Text>
    </View>
  );
}

export default function PrivateLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerType: "front",
        drawerStyle: {
          width: 249,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="tabs" />
      <Drawer.Screen name="qr" options={{ drawerItemStyle: { display: "none" } }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#1A083E",
  },
  drawerHeader: {
    paddingLeft: 46,
    paddingRight: 46.04,
    paddingTop: 85.58,
    paddingBottom: 36.58,
  },
  drawerTitle: {
    color: "white",
    width: 157,
    fontSize: 29,
    lineHeight: 40,
    fontWeight: "500",
    fontFamily: "own-regular",
  },
  drawerItemsContainer: {
    display: "flex",
    width: 186,
    alignItems: "flex-start",
    gap: 15,
    marginLeft: 32,
    marginRight: 31,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    height: 60,
    width: 158,
    backgroundColor: "#1f005b",
    opacity: 0.8,
  },
  activeDrawerItem: {},
  drawerIcon: {
    marginRight: 15.2,
    marginLeft: 26.58,
    color: "#fff",
  },
  drawerItemText: {
    fontSize: 15,
    fontFamily: "Manrope-SemiBold-600",
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
  activeDrawerItemText: {
    color: "#1f005b",
    fontWeight: "600",
  },
  drawerFooter: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  logoutButton: {},
});
