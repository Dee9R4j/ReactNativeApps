// navigation.ts
// For expo-router, specific screen parameter types are often defined
// directly with useLocalSearchParams or useGlobalSearchParams.
// This file can be used for shared types or more complex navigation prop types if needed.

export type ProductStackParamList = {
  'product/[id]': { id: string }; // Example for product screen params
  // other stack screens if any outside tabs
};

export type TabParamList = {
    index: undefined; // Home
    cart: undefined;
    menu: undefined; // This is an action tab, no screen params typically
    settings: undefined;
}

// You might not need RootNavigationProp as much with expo-router's hooks (useRouter, useNavigation)
// but if you pass navigation objects around, this can be useful.
// import { NavigationProp } from '@react-navigation/native';
// export type AppNavigationProp = NavigationProp<RootStackParamList & TabParamList>;

// Example of how you might use types with useLocalSearchParams
// const { id } = useLocalSearchParams<{ id: string }>();