import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FoodHeader from "@/components/food/FoodHeader";

interface SplitHeaderProps {
  title: string;
  showBackButton?: boolean;
  onQrPress?: (event: GestureResponderEvent) => void;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
}

const SplitHeader: React.FC<SplitHeaderProps> = ({
  title,
  showBackButton = true,
  onQrPress,
  rightComponent,
  onBackPress,
}) => {
  const router = useRouter();

  const handleQrPress = useCallback(
    (event: GestureResponderEvent) => {
      if (onQrPress) {
        onQrPress(event);
        return;
      }
      router.push("/private/home/qr" as any);
    },
    [onQrPress, router]
  );

  const computedRightComponent = useMemo(() => {
    if (rightComponent) return rightComponent;

    return (
      <TouchableOpacity
        onPress={handleQrPress}
        style={styles.qrButton}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Scan QR"
      >
        <Ionicons name="qr-code-outline" size={28} color="#FFF" />
      </TouchableOpacity>
    );
  }, [handleQrPress, rightComponent]);

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [onBackPress, router]);

  return (
    <FoodHeader
      title={title}
      showBackButton={showBackButton}
      showCartIcon={false}
      rightComponent={computedRightComponent}
      onBackPress={handleBackPress}
    />
  );
};

const styles = StyleSheet.create({
  qrButton: {
    width: 40,
    height: 40,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 6,
    paddingLeft: 11,
  },
});

export default SplitHeader;
