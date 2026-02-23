// ShopContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../items'; // Assuming Product interface is in items.ts

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: number;
  name: string;
  email: string;
  address: string;
  items: CartItem[];
  total: number;
  date: string;
}

interface ShopState {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
}

interface ShopContextProps {
  state: ShopState;
  dispatch: React.Dispatch<any>; // Consider defining a more specific action type
}

const initialState: ShopState = {
  cart: [],
  wishlist: [],
  orders: [],
};

const shopReducer = (state: ShopState, action: any): ShopState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex >= 0) {
        const updatedCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) } // Allow adding specific quantity
            : item
        );
        return { ...state, cart: updatedCart };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }

    case 'MOVE_TO_CART': {
      const itemToMove = action.payload as Product;
      const existingCartItemIndex = state.cart.findIndex(
        (item) => item.id === itemToMove.id
      );
      let updatedCart;
      if (existingCartItemIndex >= 0) {
        updatedCart = state.cart.map((item, index) =>
          index === existingCartItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...itemToMove, quantity: 1 }];
      }
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== itemToMove.id),
        cart: updatedCart,
      };
    }

    case 'ADD_TO_WISHLIST': {
      const itemToAdd = action.payload as Product;
      const existsInWishlist = state.wishlist.some(
        (item) => item.id === itemToAdd.id
      );
      return {
        ...state,
        wishlist: existsInWishlist ? state.wishlist : [...state.wishlist, itemToAdd],
      };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) };

    case 'UPDATE_CART_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity < 1) { // Ensure quantity doesn't go below 1
        return { ...state, cart: state.cart.filter((item) => item.id !== id) }; // Remove if quantity is less than 1
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity: quantity } : item
        ),
      };
    }
      
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      };

    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload as Order] };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'REMOVE_ORDER':
      return { ...state, orders: state.orders.filter((order) => order.id !== action.payload) };

    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const ShopContext = createContext<ShopContextProps | null>(null);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        const storedWishlist = await AsyncStorage.getItem('wishlist');
        const storedOrders = await AsyncStorage.getItem('orders');
        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: {
            cart: storedCart ? JSON.parse(storedCart) : [],
            wishlist: storedWishlist ? JSON.parse(storedWishlist) : [],
            orders: storedOrders ? JSON.parse(storedOrders) : [],
          },
        });
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        // Only save if state is not the initial empty state (to avoid overwriting on first load if nothing was stored)
        if (state.cart.length > 0 || await AsyncStorage.getItem('cart')) {
             await AsyncStorage.setItem('cart', JSON.stringify(state.cart));
        }
        if (state.wishlist.length > 0 || await AsyncStorage.getItem('wishlist')) {
            await AsyncStorage.setItem('wishlist', JSON.stringify(state.wishlist));
        }
        if (state.orders.length > 0 || await AsyncStorage.getItem('orders')) {
            await AsyncStorage.setItem('orders', JSON.stringify(state.orders));
        }
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };
    // Avoid saving initial empty state immediately after loading
    if (state !== initialState) {
        saveData();
    }
  }, [state.cart, state.wishlist, state.orders, state]); // Added state to dependencies

  return (
    <ShopContext.Provider value={{ state, dispatch }}>{children}</ShopContext.Provider>
  );
};

export const useShop = (): ShopContextProps => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};