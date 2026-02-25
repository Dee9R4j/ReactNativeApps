/**
 * Custom navigation theme — dark theme matching Oasis design
 */
import { Theme } from "@react-navigation/native";

const myTheme: Theme = {
  dark: true,
  colors: {
    primary: "#C05424",
    background: "#000000",
    card: "#1a1a1a",
    text: "#ffffff",
    border: "#333333",
    notification: "#F95A00",
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "700" },
    heavy: { fontFamily: "System", fontWeight: "900" },
  },
};

export default myTheme;
