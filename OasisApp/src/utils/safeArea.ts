/**
 * Safe area edge constants for consistent usage across screens
 */
import { Platform, StatusBar } from "react-native";

/**
 * Get the status bar height for the current platform
 */
export const getStatusBarHeight = (): number => {
  if (Platform.OS === "ios") {
    return 44; // Default iOS status bar height (adjust for notch devices)
  }
  return StatusBar.currentHeight || 24;
};

export const SAFE_AREA_EDGES = {
  top: ["top"] as const,
  bottom: ["bottom"] as const,
  horizontal: ["left", "right"] as const,
  all: ["top", "bottom", "left", "right"] as const,
  topAndHorizontal: ["top", "left", "right"] as const,
};

/** Alias for backward compat */
export const sBarHeight = getStatusBarHeight();

