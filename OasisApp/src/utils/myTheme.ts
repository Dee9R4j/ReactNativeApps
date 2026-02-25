import { DarkTheme } from "@react-navigation/native";

const myTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: "white",
      background: "#1a1a1a",
      card: "#1a1a1a",
      text: "#ffffff",
      border: "#333333",
      notification: "#ffffff",
    },
  };

export default myTheme;
