/**
 * Responsive scaling utilities
 * Uses a reference design width of 393 (iPhone 15 Pro) for proportional scaling
 */
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Reference design dimensions (iPhone 15 Pro)
const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

/**
 * Scale width proportionally to screen width
 */
export const r_w = (size: number): number => {
  const scale = SCREEN_WIDTH / DESIGN_WIDTH;
  return PixelRatio.roundToNearestPixel(size * scale);
};

/**
 * Scale height proportionally to screen height
 */
export const r_h = (size: number): number => {
  const scale = SCREEN_HEIGHT / DESIGN_HEIGHT;
  return PixelRatio.roundToNearestPixel(size * scale);
};

/**
 * Scale text size proportionally (based on width for consistency)
 */
export const r_t = (size: number): number => {
  const scale = SCREEN_WIDTH / DESIGN_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Scale border radius (alias for r_w for backward compat)
 */
export const r_r = r_w;

export { SCREEN_WIDTH, SCREEN_HEIGHT };

