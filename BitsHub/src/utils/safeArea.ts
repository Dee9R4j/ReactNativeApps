/**
 * Safe Area Edge Constants
 * Reusable edge configurations for SafeAreaView
 */
export const SAFE_AREA_EDGES = {
  top: ["top"] as const,
  bottom: ["bottom"] as const,
  horizontal: ["left", "right"] as const,
  all: ["top", "bottom", "left", "right"] as const,
  topHorizontal: ["top", "left", "right"] as const,
  bottomHorizontal: ["bottom", "left", "right"] as const,
} as const;
