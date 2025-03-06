import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  rating: number;
  quantity: number;
  image: string;
}

type CartAction =
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "INCREASE_QUANTITY"; payload: number }
  | { type: "DECREASE_QUANTITY"; payload: number }
  | { type: "CLEAR_CART" };

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return { ...state, cartItems: action.payload };
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
          .filter((item) => item.quantity > 0),
      };
    case "CLEAR_CART":
      return { cartItems: [] };
    default:
      return state;
  }
};

const CartContext = createContext<{
  cartItems: CartItem[];
  dispatch: React.Dispatch<CartAction>;
  clearCart: () => void;
}>({
  cartItems: [],
  dispatch: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };
  
  // Sync cart with backend
  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (isAuthenticated && user) {
        try {
          const csrfToken = getCookie("csrftoken");
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/cart/`, {
            method: "GET",
            credentials: "include",
            headers: {
              "X-CSRFToken": csrfToken || "",
            },
          });

          if (response.ok) {
            const cartItems = await response.json();
            dispatch({ type: 'SET_CART_ITEMS', payload: cartItems });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      }
    };

    syncCartWithBackend();
  }, [isAuthenticated, user]);

  // Update backend on cart changes
  useEffect(() => {
    const updateBackendCart = async () => {
      if (isAuthenticated && user) {
        try {
          const csrfToken = getCookie("csrftoken");
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/cart/`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken || "",
            },
            body: JSON.stringify({ cartItems: state.cartItems }),
          });
        } catch (error) {
          console.error("Failed to update cart:", error);
        }
      }
    };

    updateBackendCart();
  }, [state.cartItems, isAuthenticated, user]);

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider value={{ cartItems: state.cartItems, dispatch, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);