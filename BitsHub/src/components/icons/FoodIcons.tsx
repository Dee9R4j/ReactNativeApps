import Svg, { Path, Circle, Rect } from "react-native-svg";
import React from "react";

interface IconProps { size?: number; color?: string; width?: number; height?: number }

export const StallsIcon: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M3 3h18v2H3V3zm0 4h18l-1.5 6H4.5L3 7zm1.5 8h15v2h-15v-2zm2 4h11v2H6.5v-2z" fill={color} /></Svg>
);

export const CartIcon: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M7 4h14l-2 9H9L7 4zM7 4L5.5 2H2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /><Circle cx={10} cy={20} r={1.5} fill={color} /><Circle cx={17} cy={20} r={1.5} fill={color} /><Path d="M9 13h10" stroke={color} strokeWidth={1.8} /></Svg>
);

export const FoodIcon: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" fill={color} /></Svg>
);

export const ShowsIcon: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M9 3v2m6-2v2M3 7h18M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7M9 12l2 2 4-4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></Svg>
);

export const WalletIcon: React.FC<IconProps> = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Rect x={2} y={5} width={20} height={16} rx={2} stroke={color} strokeWidth={1.8} /><Path d="M2 10h20M16 15h2" stroke={color} strokeWidth={1.8} strokeLinecap="round" /></Svg>
);

export const LocationPinFilledIcon: React.FC<IconProps> = ({ width = 11, height = 14, color = "#F5F5F5" }) => (
  <Svg width={width} height={height} viewBox="0 0 11 14" fill="none"><Path d="M5.5 0C2.46 0 0 2.46 0 5.5 0 9.63 5.5 14 5.5 14S11 9.63 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5a2 2 0 110-4 2 2 0 010 4z" fill={color} /></Svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 18, color = "#AFAFAF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" /></Svg>
);
