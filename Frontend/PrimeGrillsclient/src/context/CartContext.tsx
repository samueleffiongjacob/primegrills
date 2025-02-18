import { createContext, useContext, useReducer, ReactNode } from "react";

// Define cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  rating: number;
  quantity: number;
  image: string;
}

// Define actions
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "INCREASE_QUANTITY"; payload: number }
  | { type: "DECREASE_QUANTITY"; payload: number }
  | { type: "CLEAR_CART" };

interface CartState {
  cartItems: CartItem[];
}

// Initial cart state
const initialState: CartState = {
  cartItems: [],
};


// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }] };
    }

    case "REMOVE_ITEM":
      return { cartItems: state.cartItems.filter((item) => item.id !== action.payload) };

    case "INCREASE_QUANTITY":
      return {
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        cartItems: state.cartItems
          .map((item) =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0), // Remove item if quantity reaches 0
      };

    case "CLEAR_CART":
      return { cartItems: [] };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext<{
  cartItems: CartItem[];
  dispatch: React.Dispatch<CartAction>;
  clearCart: () => void;  
}>({ 
  cartItems: [],
  dispatch: () => {},
  clearCart: () => {}
});

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return <CartContext.Provider value={{ cartItems: state.cartItems, dispatch, clearCart }}>{children}</CartContext.Provider>;
};

// Hook to use cart context
export const useCart = () => useContext(CartContext);
