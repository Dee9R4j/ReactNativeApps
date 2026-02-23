// ShopContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  cart: [],
  wishlist: [],

  orders: [],
};

const shopReducer = (state: any, action: any) => {
  // Same logic as in the web app's ShopContext.jsx
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        (item: any) => item.id === action.payload.id
      );
      if (existingItemIndex >= 0) {
        const updatedCart = state.cart.map((item: any, index: number) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, cart: updatedCart };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };

    case 'MOVE_TO_CART':
      const existingCartItemIndex = state.cart.findIndex(
        (item: any) => item.id === action.payload.id
      );
      let updatedCart;
      if (existingCartItemIndex >= 0) {
        updatedCart = state.cart.map((item: any, index: number) =>
          index === existingCartItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      return {
        ...state,
        wishlist: state.wishlist.filter((item: any) => item.id !== action.payload.id),
        cart: updatedCart,
      };

    case 'ADD_TO_WISHLIST':
      const existsInWishlist = state.wishlist.some(
        (item: any) => item.id === action.payload.id
      );
      return {
        ...state,
        wishlist: existsInWishlist ? state.wishlist : [...state.wishlist, action.payload],
      };

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((item: any) => item.id !== action.payload) };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((item: any) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter((item: any) => item.id !== action.payload),
      };

    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'REMOVE_ORDER':
      return { ...state, orders: state.orders.filter((order: any) => order.id !== action.payload) };

    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const ShopContext = createContext<any>(null);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cart = await AsyncStorage.getItem('cart');
        const wishlist = await AsyncStorage.getItem('wishlist');
        const orders = await AsyncStorage.getItem('orders');
        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: {
            cart: cart ? JSON.parse(cart) : [],
            wishlist: wishlist ? JSON.parse(wishlist) : [],
            orders: orders ? JSON.parse(orders) : [],
          },
        });
      } catch (error) {
        console.error('Error loading from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(state.cart));
        await AsyncStorage.setItem('wishlist', JSON.stringify(state.wishlist));
        await AsyncStorage.setItem('orders', JSON.stringify(state.orders));
      } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
      }
    };
    saveData();
  }, [state.cart, state.wishlist, state.orders]);

  return (
    <ShopContext.Provider value={{ state, dispatch }}>{children}</ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);