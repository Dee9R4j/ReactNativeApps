// navigation.ts
import type { NavigationProp } from '@react-navigation/native';

export type RootDrawerParamList = {
  Home: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Orders: undefined;
};

export type RootNavigationProp = NavigationProp<RootDrawerParamList>;