// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ShopProvider } from "./src/context/ShopContext";
import HomeScreen from "./src/components/Home";
import ShoppingCartScreen from "./src/components/ShoppingCart";
import WishlistScreen from "./src/components/Wishlist";
import OrdersScreen from "./src/components/Orders";
import Sidebar from "./src/components/Sidebar";
import { RootDrawerParamList } from "./src/types/navigation";
import NetworkProvider from "./src/components/NetworkProvider";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <ShopProvider>
        <NetworkProvider>
          <NavigationContainer>
            <Drawer.Navigator
              drawerContent={(props) => <Sidebar {...props} />}
              screenOptions={{
                headerShown: false,
                drawerStyle: {
                  width: 300,
                  paddingTop: 50,
                },
              }}
            >
              <Drawer.Screen name="Home" component={HomeScreen} />
              <Drawer.Screen name="Cart" component={ShoppingCartScreen} />
              <Drawer.Screen name="Wishlist" component={WishlistScreen} />
              <Drawer.Screen name="Orders" component={OrdersScreen} />
            </Drawer.Navigator>
          </NavigationContainer>
        </NetworkProvider>
      </ShopProvider>
    </SafeAreaProvider>
  );
};

export default App;
