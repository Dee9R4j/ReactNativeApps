//app/(tabs)/_layout.tsx
import React, { useState } from "react";
import { Tabs, useRouter, usePathname } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay, // Import withDelay
} from "react-native-reanimated";
import MenuModal from "../../src/components/MenuModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const router = useRouter();
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchWidth = useSharedValue(40);
  // const searchOpacity = useSharedValue(1); // Not directly used for animation in this version
  const inputOpacity = useSharedValue(0);

  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const toggleSearch = () => {
    const newVisibility = !searchVisible;
    setSearchVisible(newVisibility);
    if (newVisibility) {
      searchWidth.value = withTiming(Platform.OS === "ios" ? 250 : 220, {
        duration: 300,
      });
      // Use withDelay for the input opacity animation
      inputOpacity.value = withDelay(100, withTiming(1, { duration: 200 })); // Fade in input after 100ms delay
    } else {
      searchWidth.value = withTiming(40, { duration: 300 });
      inputOpacity.value = withTiming(0, { duration: 100 }); // Fade out input
      setSearchText("");
    }
  };

  const searchContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: searchWidth.value,
    };
  });

  const searchInputAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: inputOpacity.value,
    };
  });

  const showHeader = !pathname.startsWith("/product/");

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: showHeader,
          tabBarActiveTintColor: "#3498db",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height:
              60 +
              (insets.bottom > 0 ? 0 : 5) -
              (Platform.OS === "ios" ? 0 : 5),
            paddingBottom: insets.bottom > 0 ? 0 : 5,
            paddingTop: 5,
          },
          headerStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          },
          headerTitleStyle: { fontWeight: "bold" },
          headerTransparent: true,
          header: () => {
            if (!showHeader) return null;
            return (
              <View
                style={[
                  styles.headerContainer,
                  { paddingTop: insets.top, height: 60 + insets.top },
                ]}
              >
                <View style={styles.headerLeftPlaceholder} />
                <Animated.View
                  style={[
                    styles.searchBarOuterContainer,
                    searchContainerAnimatedStyle,
                  ]}
                >
                  <TouchableOpacity
                    onPress={!searchVisible ? toggleSearch : () => {}}
                    style={styles.searchIconTouchable}
                  >
                    <Icon
                      name={searchVisible ? "search" : "search"}
                      size={28}
                      color="black"
                      style={!searchVisible ? { opacity: 1 } : { opacity: 0 }}
                    />
                  </TouchableOpacity>
                  {searchVisible && (
                    <Animated.View
                      style={[{ flex: 1 }, searchInputAnimatedStyle]}
                    >
                      <TextInput
                        placeholder="Search MerchShop..."
                        style={styles.searchInput}
                        placeholderTextColor="#777"
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus
                        onSubmitEditing={() => {
                          console.log("Search submitted:", searchText);
                          if (searchText.trim()) {
                            // router.push(`/search_results?q=${searchText.trim()}`);
                          }
                        }}
                      />
                    </Animated.View>
                  )}
                  {searchVisible && (
                    <TouchableOpacity
                      onPress={toggleSearch}
                      style={styles.closeIconTouchableInSearch}
                    >
                      <Icon name="close" size={24} color="black" />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              </View>
            );
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <Icon name="shopping-cart" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, size }) => (
              <Icon name="menu" color={color} size={size} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setMenuModalVisible(true);
            },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Icon name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      {menuModalVisible && (
        <MenuModal 
          isVisible={menuModalVisible} 
          onClose={() => setMenuModalVisible(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerLeftPlaceholder: {
    flex: 1,
  },
  searchBarOuterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.025)",
    borderRadius: 25,
    height: 40,
    paddingHorizontal: 1,
  },
  searchIconTouchable: {
    padding: 6,
    position: "absolute",
    left: 5,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#333",
    marginLeft: 30,
    marginRight: 25,
  },
  closeIconTouchableInSearch: {
    padding: 8,
    position: "absolute",
    right: 0,
  },
});
