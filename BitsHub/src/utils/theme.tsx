/**
 * Custom Navigation Theme
 * Dark theme matching the app's design language
 */
import { Theme } from "@react-navigation/native";

const myTheme: Theme = {
  dark: true,
  colors: {
    primary: "#F95A00",
    background: "#000000",
    card: "#1a1a1a",
    text: "#ffffff",
    border: "#333333",
    notification: "#F95A00",
  },
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "700",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "900",
    },
  },
};

export default myTheme;
