import { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
  cart: [],
  wishlist: [],
  orders: [],
};

const shopReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex >= 0) {

        const updatedCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          cart: updatedCart,
        };
      } else {

        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }



    case "MOVE_TO_CART":
      const existingCartItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      
      let updatedCart;
      if (existingCartItemIndex >= 0) {
        updatedCart = state.cart.map((item, index) => 
          index === existingCartItemIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload.id),
        cart: updatedCart
      };

    case "ADD_TO_WISHLIST":
      const existsInWishlist = state.wishlist.some(
        (item) => item.id === action.payload.id
      );
      return {
        ...state,
        wishlist: existsInWishlist
          ? state.wishlist
          : [...state.wishlist, action.payload],
      };


    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };


    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      };

    case "MOVE_TO_CART":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload.id),
        cart: state.cart.some((item) => item.id === action.payload.id)
          ? state.cart
          : [...state.cart, { ...action.payload, quantity: 1 }],
      };

    case "ADD_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    case "REMOVE_ORDER":
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };

    default:
      return state;
  }
};

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState, () => {
    const localCart = localStorage.getItem("cart");
    const localWishlist = localStorage.getItem("wishlist");
    const localOrders = localStorage.getItem("orders");
    return {
      cart: localCart ? JSON.parse(localCart) : [],
      wishlist: localWishlist ? JSON.parse(localWishlist) : [],
      orders: localOrders ? JSON.parse(localOrders) : [],
    };
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
    localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    localStorage.setItem("orders", JSON.stringify(state.orders));
  }, [state.cart, state.wishlist, state.orders]);

  return (
    <ShopContext.Provider value={{ state, dispatch }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
