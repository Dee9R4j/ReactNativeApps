import React, { useMemo, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSegments, router } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useFastStore } from "@/state/fast/fast";
import { useSecureStore } from "@/state/secure/secure";
import {
  AboutUs,
  Map,
  Blog,
  ContactUs,
  Developers,
  GeneralInfo,
  LogOut,
  Sponsors,
  Accommodation,
  HamCloud,
  HamContainer,
  Oasis25,
} from "@assets/images/ham";
import { LinearGradient } from "expo-linear-gradient";
import { r_h, r_t, r_w } from "@/utils/responsive";
import { useSnackbar } from "@/providers/SnackbarProvider";
import accomodationCard from "./accomodationCard";
import { LogoutWipeData } from "@/models/db/WipeEverything";

// ✅ Drawer item type
type DrawerItemType = {
  href: string;
  icon: React.ComponentType<any>;
  text: string;
  isActive: boolean;
  customPress?: () => void;
  onPress?: () => void;
};

const DrawerItem = React.memo(
  ({
    href,
    icon: Icon,
    text,
    isActive,
    onPress,
    index,
    customPress,
  }: {
    href: string;
    icon: React.ComponentType<any>;
    text: string;
    isActive: boolean;
    onPress: () => void;
    index: number;
    customPress?: () => void;
  }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(20);

    useEffect(() => {
      opacity.value = withDelay(index * 40, withTiming(1, { duration: 250 }));
      // opacity.value = withTiming(withTiming(1, {duration: 250}))
      translateX.value = withDelay(
        index * 40,
        withSpring(0, { damping: 20, stiffness: 150 }),
      );
    }, [index, opacity, translateX]);

    const pressHandlers = useMemo(
      () => ({
        onPressIn: () => {
          scale.value = withSpring(0.98, { damping: 25, stiffness: 400 });
        },
        onPressOut: () => {
          scale.value = withSpring(1, { damping: 25, stiffness: 400 });
        },
      }),
      [scale],
    );

    const animatedStyle = useAnimatedStyle(
      () => ({
        transform: [{ scale: scale.value }, { translateX: translateX.value }],
        opacity: opacity.value,
      }),
      [],
    );

    const itemStyle = useMemo(
      () => [styles.drawerItem, isActive && styles.activeDrawerItem],
      [isActive],
    );

    const handlePress = React.useCallback(() => {
      onPress?.();

      if (typeof customPress === "function") {
        customPress();
        return;
      }

      router.push(href as any);
    }, [href, onPress, customPress]);

    return (
      <Pressable {...pressHandlers} onPress={handlePress}>
        <Animated.View style={animatedStyle}>
          <View style={itemStyle}>
            <HamContainer
              style={{
                position: "absolute",
                top: 2,
                left: 0.4,
                width: "100%",
                height: "100%",
              }}
              preserveAspectRatio="none"
            />
            <View style={styles.drawerIcon}>
              <Icon
                width={20}
                height={20}
                color={isActive ? "#1f005b" : "#fff"}
              />
            </View>
            <Text
              style={[
                styles.drawerItemText,
                isActive && styles.activeDrawerItemText,
              ]}
              numberOfLines={1}
            >
              {text}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  },
);

DrawerItem.displayName = "DrawerItem";

function DrawerContent(props: DrawerContentComponentProps) {
  const pref = useFastStore();
  const { showSnackbar } = useSnackbar();
  const segments = useSegments();
  const setLogout = useFastStore((state) => state.setLogout);
  const logOut = useSecureStore((state) => state.logOut);
  const prefStore = useFastStore((state) => state.signedStoreIn);

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    titleTranslateY.value = withDelay(
      100,
      withSpring(0, { damping: 20, stiffness: 150 }),
    );
  }, []);

  const activeStates = useMemo(() => {
    const page: string =
      segments.length > 0 && typeof segments[0] === "string" ? segments[0] : "";
    return {
      map: page === "(map)",
      accommodation: page === "(accommodation)",
      hpc_blog: page === "(hpc_blog)",
      epc_blog: page === "(epc_blog)",
      sponsors: page === "(sponsors)",
      contact: page === "(contact_us)",
      developers: page === "(developers)",
      generalInfo: page === "(general_info)",
      aboutUs: page === "(about_us)",
    };
  }, [segments]);

  const closeDrawer = React.useCallback(() => {
    props.navigation.dispatch(DrawerActions.closeDrawer());
  }, [props.navigation]);

  const handleLogout = React.useCallback(async () => {
    closeDrawer();
    try {
      logOut();
      setLogout();
      await LogoutWipeData();
    } catch (error: any) {
      console.warn("Logout cleanup failed, continuing logout:", error);
    } finally {
      pref.setShouldShowOnboarding(false);
      router.replace("/authentication" as any);
    }
  }, [closeDrawer, logOut, setLogout, pref]);

  const logoutScale = useSharedValue(1);

  const logoutPressHandlers = useMemo(
    () => ({
      onPressIn: () => {
        logoutScale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
      },
      onPressOut: () => {
        logoutScale.value = withSpring(1, { damping: 20, stiffness: 300 });
      },
    }),
    [logoutScale],
  );

  const logoutScaleAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: logoutScale.value }],
    }),
    [],
  );

  const drawerItemsOriginal: DrawerItemType[] = useMemo(
    () => [
      {
        href: "/private/drawer/map",
        icon: Map,
        text: "MAP",
        isActive: activeStates.map,
        // customPress: () => showSnackbar({ message: "Wallet coming soon!", type: "error" }),
      },
      // {
      //   href: "/(standup_sandbox)",
      //   icon: StandupSandbox,
      //   text: "STANDUP SANDBOX",
      //   isActive: activeStates.standup_sandbox,
      //   customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      // },
      {
        href: "/private/drawer/epc_blog",
        icon: Blog,
        text: "EPC BLOG",
        isActive: activeStates.epc_blog,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/hpc_blog",
        icon: Blog,
        text: "HPC BLOG",
        isActive: activeStates.hpc_blog,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/sponsors",
        icon: Sponsors,
        text: "SPONSORS",
        isActive: activeStates.sponsors,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/contact_us",
        icon: ContactUs,
        text: "CONTACT US",
        isActive: activeStates.contact,
      },
      {
        href: "/private/drawer/developers",
        icon: Developers,
        text: "DEVELOPERS",
        isActive: activeStates.developers,
        customPress: () =>
          showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/general_info",
        icon: GeneralInfo,
        text: "GENERAL INFO",
        isActive: activeStates.generalInfo,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/about_us",
        icon: AboutUs,
        text: "ABOUT US",
        isActive: activeStates.aboutUs,
      },
      // {
      //   href: "/private/drawer/accommodation",
      //   icon: StandupSandbox,
      //   text: "ACCOMMODATION",
      //   isActive: activeStates.standup_sandbox,
      //   // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      // },
    ],
    [activeStates, showSnackbar],
  );
  const drawerItemsNonbitsian: DrawerItemType[] = useMemo(
    () => [
      {
        href: "/private/drawer/map",
        icon: Map,
        text: "MAP",
        isActive: activeStates.map,
        // customPress: () => showSnackbar({ message: "Wallet coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/accommodation",
        icon: Accommodation,
        text: "ACCOMMODATION",
        isActive: activeStates.accommodation,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/epc_blog",
        icon: Blog,
        text: "EPC BLOG",
        isActive: activeStates.epc_blog,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/hpc_blog",
        icon: Blog,
        text: "HPC BLOG",
        isActive: activeStates.hpc_blog,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/sponsors",
        icon: Sponsors,
        text: "SPONSORS",
        isActive: activeStates.sponsors,
        customPress: () =>
          showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/contact_us",
        icon: ContactUs,
        text: "CONTACT US",
        isActive: activeStates.contact,
      },
      {
        href: "/private/drawer/developers",
        icon: Developers,
        text: "DEVELOPERS",
        isActive: activeStates.developers,
        customPress: () =>
          showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/general_info",
        icon: GeneralInfo,
        text: "GENERAL INFO",
        isActive: activeStates.generalInfo,
        // customPress: () => showSnackbar({ message: "Coming soon!", type: "error" }),
      },
      {
        href: "/private/drawer/about_us",
        icon: AboutUs,
        text: "ABOUT US",
        isActive: activeStates.aboutUs,
      },
    ],
    [activeStates, showSnackbar],
  );

  const drawerItemsStore: DrawerItemType[] = useMemo(
    () => [
      {
        href: "/private/drawer/map",
        icon: Map,
        text: "MAP",
        isActive: activeStates.map,
      },
      {
        href: "/private/drawer/about_us",
        icon: AboutUs,
        text: "ABOUT US",
        isActive: activeStates.aboutUs,
      },
    ],
    [activeStates],
  );

  const isBitsian = useSecureStore((state) => state.isbitsian);

  let drawerItems: DrawerItemType[] = drawerItemsOriginal;

  if (prefStore) {
    drawerItems = drawerItemsStore;
  } else if (isBitsian === false) {
    drawerItems = drawerItemsNonbitsian;
  }

  return (
    <LinearGradient
      colors={["#000000", "#350000"]}
      start={{ x: 0, y: 0.5 }}
      style={styles.drawerContainer}
    >
      <View style={styles.backgroundContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <HamCloud key={index} width={"100%"} />
        ))}
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.9)",
            "rgba(0, 0, 0, 0.9)",
            "rgba(0, 0, 0, 1)",
            "rgba(0, 0, 0, 1)",
            "rgba(0, 0, 0, 1)",
            "rgba(0, 0, 0, 0.5)",
            "rgba(0, 0, 0, 0)",
          ]}
          locations={[0, 0.35, 0.55, 0.75, 0.8, 0.86, 1]}
          style={styles.cloudOverlay}
        />
      </View>

      <View style={styles.drawerHeader}>
        <Oasis25 height={r_h(99)} width={r_w(204)} />
      </View>

      <View style={styles.drawerItemsContainer}>
        {drawerItems.map((item, index) => (
          <DrawerItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            isActive={item.isActive}
            onPress={closeDrawer}
            index={index}
            customPress={item.customPress}
          />
        ))}

        <Pressable {...logoutPressHandlers} onPress={handleLogout}>
          <Animated.View style={logoutScaleAnimatedStyle}>
            <View style={[styles.drawerItem, styles.logoutButton]}>
              <HamContainer
                style={{
                  position: "absolute",
                  top: 1,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                preserveAspectRatio="none"
              />
              <View style={styles.drawerIcon}>
                <LogOut width={18} height={18} color="#fff" />
              </View>
              <Text style={styles.drawerItemText}>LOGOUT</Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      <Text style={styles.drawerFooter}>Made with ❤️ by DVM</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.2,
  },
  cloudOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    backgroundColor: "transparent",
    opacity: 1,
  },
  drawerHeader: {
    paddingTop: r_h(50),
    paddingBottom: r_h(20),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  drawerItemsContainer: {
    display: "flex",
    // width: 168,
    alignItems: "flex-start",
    gap: 10,
    marginLeft: 20,
  },
  drawerItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 50,
    width: 250,
  },
  activeDrawerItem: {
    width: 186,
  },
  drawerIcon: {
    marginRight: 20,
    marginLeft: 19,
  },
  drawerItemText: {
    fontSize: r_t(13),
    fontFamily: "The Last Shuriken",
    color: "#fff",
    textAlign: "center",
    // textWrap: "nowrap",
    paddingLeft: 9,
  },
  activeDrawerItemText: {
    color: "#ffffff",
  },
  drawerFooter: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: r_t(13),
    fontFamily: "The Last Shuriken",
  },
  logoutButton: {},
});

export default React.memo(DrawerContent);
