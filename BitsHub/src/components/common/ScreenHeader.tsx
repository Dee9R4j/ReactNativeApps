import { r_h, r_t, r_w } from "@/utils/responsive";
import { useRouter } from "expo-router";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./BackButton";

interface ScreenHeaderProps { title: string; showBackButton?: boolean; onBackPress?: () => void; rightComponent?: React.ReactNode; leftComponent?: React.ReactNode; showSeparator?: boolean; containerStyle?: StyleProp<ViewStyle>; titleStyle?: StyleProp<TextStyle>; backgroundColor?: string; titleColor?: string }

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, showBackButton = true, onBackPress, rightComponent, leftComponent, showSeparator = true, containerStyle, titleStyle, backgroundColor = "transparent", titleColor = "#fff" }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { backgroundColor }, containerStyle]}>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.leftSection}>
          {leftComponent ? leftComponent : showBackButton ? <BackButton onPress={onBackPress || (() => router.back())} style={styles.backButton} /> : <View style={styles.placeholder} />}
        </View>
        <Text style={[styles.title, { color: titleColor }, titleStyle]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <View style={styles.rightSection}>{rightComponent || <View style={styles.placeholder} />}</View>
      </View>
      {showSeparator && <View style={styles.separator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  container: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: r_w(16), paddingBottom: r_h(8) },
  leftSection: { width: r_w(40), alignItems: "flex-start" },
  rightSection: { width: r_w(40), alignItems: "flex-end" },
  backButton: { padding: r_w(4) },
  placeholder: { width: r_w(28), height: r_h(28) },
  title: { flex: 1, fontSize: r_t(20), fontWeight: "600", textAlign: "center", marginHorizontal: r_w(8) },
  separator: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.2)", marginHorizontal: r_w(16) },
});

export default ScreenHeader;
