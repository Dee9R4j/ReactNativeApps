import { useEffect } from "react";
import { BackHandler } from "react-native";

export function useConditionalBackGuard(enabled: boolean, onBack: () => boolean) {
  useEffect(() => {
    if (!enabled) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBack
    );

    return () => backHandler.remove();
  }, [enabled, onBack]);
}
