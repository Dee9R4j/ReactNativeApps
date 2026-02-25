import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { getStatusBarHeight } from "@/utils/safeArea";
import { useFastStore } from "@/state/fast/fast";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { BackIcon, BookmarkEmpty, BookmarkDot } from "@assets/images/events";
import DrawerMenuIcon from "@assets/images/homescreen/drawermenu-icon.svg";
import BarcodeIcon from "@assets/images/homescreen/barcode-icon.svg";
import { IEventProps } from "@/utils/events/types";
import AnimatedBackIcon from "../AnimatedBackIcon";

interface HeaderProps {
  bookmarkedEvents: IEventProps[] | null;
  showBookmarks: boolean;
  setShowBookmarks: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  bookmarkedEvents,
  showBookmarks,
  setShowBookmarks,
}) => {
  const prefStore = useFastStore((state) => state.signedStoreIn);
  const navigation = useNavigation();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const handleBackPress = () => {
    if (showBookmarks) setShowBookmarks(false);
    else router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        {prefStore ? (
          <TouchableOpacity onPress={openDrawer} style={styles.drawerButton}>
            <DrawerMenuIcon width={30} height={22} />
          </TouchableOpacity>
        ) : (
          <AnimatedBackIcon
            onPress={handleBackPress}
            style={styles.backButton}
          />
        )}

        <Text style={styles.headerTitle}>
          {showBookmarks ? "BOOKMARKS" : "EVENTS"}
        </Text>

        <Pressable
          style={styles.bookmarkButton}
          onPress={() => setShowBookmarks(!showBookmarks)}
        >
          <BookmarkEmpty
            width={28}
            height={28}
            fill={showBookmarks ? "#AD0103" : "#ffffff"}
          />
          {bookmarkedEvents && bookmarkedEvents.length > 0 && (
            <View style={styles.bookmarkDotContainer}>
              <BookmarkDot width={12} height={12} />
            </View>
          )}
        </Pressable>
        {prefStore && !showBookmarks ? (
          <TouchableOpacity
            onPress={() => router.push("/private/home/qr" as any)}
            style={styles.bookmarkButton}
          >
            <BarcodeIcon width={28} height={28} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  topHeader: {
    paddingTop: 18,
    paddingBottom: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  backButton: {
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: 8,
  },
  drawerButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: "The Last Shuriken",
    color: "#fff",
  },
  bookmarkButton: {
    backgroundColor: "transparent",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkDotContainer: {
    position: "absolute",
    top: 0,
    right: 4,
  },
  separator: {
    height: 2,
    width: "88%",
    backgroundColor: "white",
    alignSelf: "center",
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default Header;
