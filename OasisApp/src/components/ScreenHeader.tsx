import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useFastStore } from "@/state/fast/fast";
import AnimatedBackIcon from "./AnimatedBackIcon";
import { r_t } from "@/utils/responsive";

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = true,
}) => {
  const navigation = useNavigation();
  const prefStore = useFastStore((state) => state.signedStoreIn);
  const onBackPress = !prefStore
    ? () => navigation.dispatch(DrawerActions.jumpTo("index"))
    : () => router.replace("/private/home/events" as any);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        {showBackButton ? (
          <AnimatedBackIcon onPress={onBackPress} style={styles.backButton} />
        ) : (
          <View style={styles.backButton} />
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.backButton} />
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 8,
  },

  bookmarkDotContainer: {
    position: "absolute",
    top: 0,
    right: 4,
  },
  separator: {
    marginVertical: 4,
    height: 2,
    width: "88%",
    backgroundColor: "white",
    alignSelf: "center",
  },
  title: {
    fontSize: r_t(22),
    fontFamily: "The Last Shuriken",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ScreenHeader;
