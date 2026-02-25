import React, { ReactNode, useCallback, useMemo } from "react";
import {
  Pressable,
  GestureResponderEvent,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  Image,
  Path as SkiaPathComponent,
  Skia,
  useImage,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";

type SkiaImageSource = Parameters<typeof useImage>[0];

type Point = { x: number; y: number };

/**
 * Point-in-polygon test using ray casting algorithm
 */
const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Create a Skia Path from four points (quadrilateral).
 */
const createPolygonPath = (p1: Point, p2: Point, p3: Point, p4: Point) => {
  const path = Skia.Path.Make();
  path.moveTo(p1.x, p1.y);
  path.lineTo(p2.x, p2.y);
  path.lineTo(p3.x, p3.y);
  path.lineTo(p4.x, p4.y);
  path.close();
  return path;
};

export type PolygonButtonProps = {
  imageSource?: SkiaImageSource;
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;
  onPress: () => void;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  fillColor?: string;
  imageFit?:
    | "cover"
    | "contain"
    | "fill"
    | "fitHeight"
    | "fitWidth"
    | "scaleDown";
};

/**
 * A pressable button with a quadrilateral shape, image background,
 * and a gradient border inspired by the provided SVG.
 */
export const PolygonButton: React.FC<PolygonButtonProps> = ({
  imageSource,
  p1,
  p2,
  p3,
  p4,
  onPress,
  width,
  height,
  style,
  contentStyle,
  children,
  fillColor = "transparent",
  imageFit = "fill",
}) => {
  const image = imageSource ? useImage(imageSource) : null;

  const polygon = useMemo(() => [p1, p2, p3, p4], [p1, p2, p3, p4]);
  const path = useMemo(
    () => createPolygonPath(p1, p2, p3, p4),
    [p1, p2, p3, p4]
  );

  // Animated values for press feedback
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      "worklet";
      const { locationX, locationY } = event.nativeEvent;
      const touchPoint = { x: locationX, y: locationY };
      const inside = isPointInPolygon(touchPoint, polygon);
      if (inside) {
        opacity.value = withTiming(0.9, { duration: 100 });
      }
    },
    [polygon, opacity]
  );

  const handlePressOut = useCallback(() => {
    "worklet";
    opacity.value = withTiming(1, { duration: 120 });
  }, [opacity]);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      const touchPoint = { x: locationX, y: locationY };
      if (isPointInPolygon(touchPoint, polygon)) {
        onPress();
      }
    },
    [polygon, onPress]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ width, height }, style, animatedStyle]}>
      <Pressable
        style={{ width, height }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Canvas pointerEvents="none" style={{ width, height }}>
          {/* --- Image or solid fill --- */}
          {image ? (
            <Group clip={path}>
              <Image
                image={image}
                x={0}
                y={0}
                width={width}
                height={height}
                fit={imageFit}
              />
            </Group>
          ) : (
            <SkiaPathComponent path={path} color={fillColor} style="fill" />
          )}

          {/* --- Gradient border (SVG style) --- */}
          <SkiaPathComponent
            path={path}
            style="stroke"
            strokeWidth={2.5}
            strokeJoin="round"
          >
            <LinearGradient
              start={vec(-4.7, 244.3)}
              end={vec(173.7, 206.5)}
              colors={["#FFFFFF", "#474747", "#E9E9E9"]}
              positions={[0, 0.12, 0.58]}
            />
          </SkiaPathComponent>
        </Canvas>

        {/* --- Content overlay (e.g., text SVGs) --- */}
        {children && (
          <View
            pointerEvents="none"
            style={[styles.contentOverlay, contentStyle]}
          >
            {children}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PolygonButton;
