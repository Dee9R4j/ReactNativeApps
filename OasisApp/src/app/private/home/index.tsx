import React, { useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ImageBackground,
  BackHandler,
} from "react-native";
import { useNavigation, router, useFocusEffect } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { debounce } from "lodash";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { r_h, r_w, r_t, r_r } from "@/utils/responsive";
import {
  useHomeScreenEntrance,
  useStaggeredButtonEntrance,
} from "@/components/food/homeAnimation";
import { MOCK_POSTER_IMAGE } from "@/api/dummyData";

import DrawerMenuIcon from "@assets/images/homescreen/drawermenu-icon.svg";
import SosIcon from "@assets/images/homescreen/sos-icon.svg";
import NotificationIcon from "@assets/images/homescreen/notification-icon.svg";
import BarcodeIcon from "@assets/images/homescreen/barcode-icon.svg";
import HeaderBottomLine from "@assets/images/homescreen/header-bottomline.svg";
import OasisTitle from "@assets/images/homescreen/oasis-title.svg";
import MerchText from "@assets/images/homescreen/merch-text.svg";
import EventText from "@assets/images/homescreen/event-text.svg";
import ShowsText from "@assets/images/homescreen/shows-text.svg";
import WalletText from "@assets/images/homescreen/wallet-text.svg";
import FoodText from "@assets/images/homescreen/food-text.svg";
import GalleryText from "@assets/images/homescreen/gallary-text.svg";
import PolygonButton from "@/components/PolygonButton";
const BASE_HEIGHT = 852;
import { relations } from "drizzle-orm";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";

export default function Index() {
  const { showSnackbar } = useSnackbar();
  const navigation = useNavigation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const [posterImage, setPosterImage] = useState<string | null>(MOCK_POSTER_IMAGE);

  // No real backend call needed — using mock poster image

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  // Entrance animations
  const { backgroundStyle, headerStyle, contentStyle } =
    useHomeScreenEntrance();

  // Button staggered animations
  const raftaarButtonStyle = useStaggeredButtonEntrance(0);
  const oasisButtonStyle = useStaggeredButtonEntrance(1);
  const merchButtonStyle = useStaggeredButtonEntrance(2);
  const showsButtonStyle = useStaggeredButtonEntrance(3);
  const eventsButtonStyle = useStaggeredButtonEntrance(4);
  const foodButtonStyle = useStaggeredButtonEntrance(5);
  const walletButtonStyle = useStaggeredButtonEntrance(6);
  const galleryButtonStyle = useStaggeredButtonEntrance(7);

  // Use responsive functions for all dimensions
  const horizontalPadding = r_w(25);
  const buttonGap = r_w(16);
  const headerHeight = r_h(70);
  const headerPaddingTop = Math.max(topInset, r_h(12)) + r_h(12);
  const homeIndicatorHeight = Math.max(bottomInset, r_h(20));

  const contentWidth = screenWidth - horizontalPadding * 2;
  const availableHeight =
    screenHeight - topInset - headerHeight - homeIndicatorHeight;

  const raftaarHeight = r_h(265);
  const oasisTitleHeight = r_h(60);
  const smallButtonHeight = r_h(185);
  const walletRowHeight = r_h(245);
  const galleryHeight = r_h(62);

  const columnWidthLeft = (contentWidth - buttonGap) * 0.57;
  const columnWidthRight = (contentWidth - buttonGap) * 0.43 + r_w(6);

  const walletButtonWidth = (contentWidth - buttonGap * 2) * 0.37 + r_w(40);
  const sideButtonWidth = (contentWidth - buttonGap * 2) * 0.33 + r_w(21);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const headerLineWidth = contentWidth;
  const buttonShearOffset = r_h(50);
  const walletCornerOffset = r_w(40);
  const sideStartOffset = r_w(40);
  const walletShift = r_w(50);
  const foodShift = r_w(100);
  const eventsLift = r_h(50);
  const merchOffset = 0;
  const walletRowLift = r_h(50);
  const galleryShift = r_h(50);

  const debouncedPush = useCallback(
    debounce(
      (path: string) => {
        router.push(path as any);
      },
      15,
      { leading: true, trailing: false },
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, backgroundStyle]}>
        <ImageBackground
          source={require("@assets/images/food/background-image.png")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: headerPaddingTop,
            paddingHorizontal: horizontalPadding,
          },
          headerStyle,
        ]}
      >
        <View
          style={[
            styles.headerContent,
            {
              width: contentWidth,
              height: r_h(40),
            },
          ]}
        >
          <TouchableOpacity
            onPress={openDrawer}
            style={[
              styles.drawerButton,
              {
                height: r_h(30),
                width: r_w(50),
              },
            ]}
          >
            <DrawerMenuIcon width={r_w(29.84)} height={r_h(21.91)} />
          </TouchableOpacity>

          <View style={[styles.rightIcons, { gap: r_w(15) }]}>
            <TouchableOpacity
              onPress={() => router.push("/private/notifications" as any)}
              style={styles.iconButton}
            >
              <NotificationIcon width={r_w(24.3)} height={r_h(28.8)} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/private/sos" as any)}
              // onPress={() => showSnackbar({ message: "Coming soon!", type: "error" ,  })}
            >
              <SosIcon width={r_w(30)} height={r_h(30)} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/private/home/qr" as any)}
              style={styles.iconButton}
            >
              <BarcodeIcon width={r_w(30)} height={r_h(30)} />
            </TouchableOpacity>
          </View>
        </View>
        <HeaderBottomLine
          width={headerLineWidth + r_w(10)}
          height={r_h(4)}
          style={styles.headerLine}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: r_h(15),
            paddingBottom: Math.max(homeIndicatorHeight, r_h(15)),
          },
          contentStyle,
        ]}
      >
        <View style={[styles.buttonsContainer, { gap: buttonGap }]}>
          <View style={[styles.topRow, { gap: buttonGap - r_w(6) }]}>
            <View
              style={[
                styles.leftColumn,
                { width: columnWidthLeft, gap: buttonGap },
              ]}
            >
              <Animated.View
                style={[
                  { width: columnWidthLeft, height: raftaarHeight },
                  raftaarButtonStyle,
                ]}
              >
                <PolygonButton
                  imageSource={
                    posterImage
                      ? { uri: posterImage }
                      : require("@assets/images/homescreen/default-image.png")
                  }
                  p1={{ x: 0, y: 0 }}
                  p2={{ x: columnWidthLeft, y: 0 }}
                  p3={{ x: columnWidthLeft, y: raftaarHeight }}
                  p4={{ x: 0, y: raftaarHeight }}
                  onPress={() => {}}
                  width={columnWidthLeft}
                  height={raftaarHeight}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.oasisTitleContainer,
                  {
                    width: columnWidthLeft,
                    height: oasisTitleHeight,
                    position: "relative",
                    top: -r_h(7),
                  },
                  oasisButtonStyle,
                ]}
              >
                <View style={styles.oasisTitleGlowWrapper}>
                  <View
                    style={[
                      styles.oasisTitleGlowBackdrop,
                      {
                        shadowRadius: r_w(40),
                        elevation: 20,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.oasisTitleGlowBackdrop,
                      {
                        shadowRadius: r_w(25),
                        shadowColor: "#fff644ff",
                        shadowOpacity: 0.9,
                        elevation: 15,
                      },
                    ]}
                  />
                  <OasisTitle
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                  />
                </View>
              </Animated.View>
            </View>

            <View
              style={[
                styles.rightColumn,
                { width: columnWidthRight, gap: buttonGap - r_w(6) },
              ]}
            >
              <Animated.View
                style={[
                  {
                    width: columnWidthRight,
                    height: smallButtonHeight,
                    top: merchOffset,
                  },
                  merchButtonStyle,
                ]}
              >
                <PolygonButton
                  imageSource={require("@assets/images/homescreen/merch-button.png")}
                  p1={{ x: 0, y: 0 }}
                  p2={{ x: columnWidthRight, y: 0 }}
                  p3={{
                    x: columnWidthRight,
                    y: smallButtonHeight - buttonShearOffset,
                  }}
                  p4={{ x: 0, y: smallButtonHeight }}
                  onPress={() => debouncedPush("/private/home/merch")}
                  // onPress={() => showSnackbar({ message: "Coming soon!", type: "error" ,  })}
                  width={columnWidthRight}
                  height={smallButtonHeight}
                  style={styles.merchButton}
                >
                  <MerchText
                    style={[
                      styles.merchButtonText,
                      { width: columnWidthRight * 0.62 },
                      { height: columnWidthRight * 0.112 },
                      { top: r_h(13.33) },
                    ]}
                  />
                </PolygonButton>
              </Animated.View>

              <Animated.View
                style={[
                  {
                    width: columnWidthRight,
                    height: smallButtonHeight,
                    top: -eventsLift,
                  },
                  showsButtonStyle,
                ]}
              >
                <PolygonButton
                  imageSource={require("@assets/images/homescreen/event-button.png")}
                  p1={{ x: 0, y: buttonShearOffset }}
                  p2={{ x: columnWidthRight, y: 0 }}
                  p3={{ x: columnWidthRight, y: smallButtonHeight }}
                  p4={{ x: 0, y: smallButtonHeight }}
                  onPress={() => debouncedPush("/private/home/events")}
                  width={columnWidthRight}
                  height={smallButtonHeight}
                  style={styles.eventsButton}
                >
                  <EventText
                    style={[
                      styles.merchButtonText,
                      { width: columnWidthRight * 0.62 },
                      { height: columnWidthRight * 0.112 },
                      { bottom: r_h(13.33) },
                    ]}
                  />
                </PolygonButton>
              </Animated.View>
            </View>
          </View>

          <View
            style={[
              styles.walletRow,
              {
                height: walletRowHeight,
                gap: buttonGap + r_w(4),
                top: -walletRowLift,
              },
            ]}
          >
            <Animated.View
              style={[
                { width: sideButtonWidth, height: walletRowHeight },
                eventsButtonStyle,
              ]}
            >
              <PolygonButton
                imageSource={require("@assets/images/homescreen/shows-button.png")}
                p1={{ x: 0, y: 0 }}
                p2={{ x: sideButtonWidth - walletCornerOffset, y: 0 }}
                p3={{ x: sideButtonWidth, y: walletRowHeight }}
                p4={{ x: 0, y: walletRowHeight }}
                onPress={() => debouncedPush("/private/home/shows")}
                // onPress={() => showSnackbar({ message: "Coming soon!", type: "error" ,  })}
                width={sideButtonWidth}
                height={walletRowHeight}
                style={styles.showsButton}
              >
                <ShowsText
                  style={[
                    styles.merchButtonText,
                    { width: columnWidthRight * 0.62 },
                    { height: columnWidthRight * 0.112 },
                    { bottom: 0 },
                    { left: r_w(7) },
                  ]}
                />
              </PolygonButton>
            </Animated.View>

            <Animated.View
              style={[
                {
                  width: walletButtonWidth,
                  height: walletRowHeight,
                  left: -walletShift,
                },
                walletButtonStyle,
              ]}
            >
              <PolygonButton
                imageSource={require("@assets/images/homescreen/wallet-button.png")}
                p1={{ x: 0, y: 0 }}
                p2={{ x: walletButtonWidth, y: 0 }}
                p3={{
                  x: walletButtonWidth - walletCornerOffset,
                  y: walletRowHeight,
                }}
                p4={{ x: walletCornerOffset, y: walletRowHeight }}
                onPress={() => debouncedPush("/private/home/wallet")}
                // onPress={() => showSnackbar({ message: "Coming soon!", type: "error" ,  })}
                width={walletButtonWidth}
                height={walletRowHeight}
                style={styles.walletButton}
              >
                <WalletText
                  style={[
                    styles.merchButtonText,
                    { width: columnWidthRight * 0.62 },
                    { height: columnWidthRight * 0.112 },
                    { top: r_h(13.33) },
                    { left: r_w(14) },
                  ]}
                />
              </PolygonButton>
            </Animated.View>

            <Animated.View
              style={[
                {
                  width: sideButtonWidth,
                  height: walletRowHeight,
                  left: -foodShift,
                },
                foodButtonStyle,
              ]}
            >
              <PolygonButton
                imageSource={require("@assets/images/homescreen/food-button.png")}
                p1={{ x: sideStartOffset, y: 0 }}
                p2={{ x: sideButtonWidth, y: 0 }}
                p3={{ x: sideButtonWidth, y: walletRowHeight }}
                p4={{ x: 0, y: walletRowHeight }}
                onPress={() => debouncedPush("/private/home/food")}
                // onPress={() => showSnackbar({ message: "Coming soon!", type: "error" ,  })}
                width={sideButtonWidth}
                height={walletRowHeight}
                style={styles.foodButton}
              >
                <FoodText
                  style={[
                    styles.merchButtonText,
                    { width: columnWidthRight * 0.62 },
                    { height: columnWidthRight * 0.112 },
                    { bottom: r_h(10) },
                    { left: r_w(20) },
                  ]}
                />
              </PolygonButton>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              {
                width: contentWidth,
                height: galleryHeight,
                top: -galleryShift,
              },
              galleryButtonStyle,
            ]}
          >
            <PolygonButton
              imageSource={require("@assets/images/homescreen/gallary-button.png")}
              p1={{ x: 0, y: 0 }}
              p2={{ x: contentWidth, y: 0 }}
              p3={{ x: contentWidth, y: galleryHeight }}
              p4={{ x: 0, y: galleryHeight }}
              onPress={() => debouncedPush("/private/home/gallery" as any)}
              // onPress={() => showSnackbar({ message: "Coming soon!", type: "error" ,  })}
              width={contentWidth}
              height={galleryHeight}
              style={styles.galleryButton}
            >
              <GalleryText
                style={[
                  styles.merchButtonText,
                  { width: columnWidthRight * 0.62 },
                  { height: columnWidthRight * 0.112 },
                  { bottom: r_h(3) },
                ]}
              />
            </PolygonButton>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    width: "100%",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerButton: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingBottom: 21,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 21,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerLine: {
    alignSelf: "center",
  },
  content: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
  },
  leftColumn: {},
  raftaarButton: {},
  oasisTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  rightColumn: {},
  merchButton: {
    position: "relative",
  },
  merchButtonText: {
    position: "absolute",
  },
  eventsButton: {
    position: "relative",
  },
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    // marginBottom: 20
  },
  showsButton: {},
  walletButton: {
    position: "relative",
  },
  foodButton: {
    position: "relative",
  },
  galleryButton: {
    position: "relative",
  },
  oasisTitleGlowWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  oasisTitleGlowBackdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    shadowColor: "#FF0000",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
  },
});
