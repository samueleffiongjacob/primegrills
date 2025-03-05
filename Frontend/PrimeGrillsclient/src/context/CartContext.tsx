import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
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
  const { isAuthenticated, user } = useAuth();

  // Load cart from local storage on mount
  useEffect(() => {
    const loadCart = () => {
      // Key for storing cart based on authentication state
      const storageKey = isAuthenticated && user ? `cart_${user.id}` : 'anonymous_cart';
      console.log('ssoae',storageKey)
      console.log('loadin ca...')
      
      try {
        const savedCart = localStorage.getItem(storageKey);
        if (savedCart) {
          dispatch({ type: 'SET_CART_ITEMS', payload: JSON.parse(savedCart) });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };
    
    loadCart();
    }, [isAuthenticated, user]);

  // Save cart to local storage when it changes or user auth state changes
  useEffect(() => {
    const saveCart = () => {
      // Key for storing cart based on authentication state
      const storageKey = isAuthenticated && user ? `cart_${user.id}` : 'anonymous_cart';
      console.log("Saving cart to:", storageKey, state.cartItems); // Debugging log
      try {
        localStorage.setItem(storageKey, JSON.stringify(state.cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };
    
    saveCart();
  }, [state.cartItems, isAuthenticated, user]);
  
  // Handle cart transfer on login
  useEffect(() => {
    if (isAuthenticated && user) {
      // Try to get the anonymous cart
      const anonymousCart = localStorage.getItem('anonymous_cart');
      
      if (anonymousCart) {
        // Get user's existing cart
        const userCartKey = `cart_${user.id}`;
        const userCart = localStorage.getItem(userCartKey);
        
        // If user has no existing cart or empty cart, use anonymous cart
        if (!userCart || JSON.parse(userCart).length === 0) {
          dispatch({ type: 'SET_CART_ITEMS', payload: JSON.parse(anonymousCart) });
        } else {
          // Merge carts 
          const mergedCart = [
            ...JSON.parse(userCart),
            ...JSON.parse(anonymousCart).filter(
              (anonItem: CartItem) => !JSON.parse(userCart).some(
                (userItem: CartItem) => userItem.id === anonItem.id
              )
            )
          ];
          dispatch({ type: 'SET_CART_ITEMS', payload: mergedCart });
        }
        
        // Clear anonymous cart
        localStorage.removeItem('anonymous_cart');
      }
    }
  }, [isAuthenticated, user]);

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return <CartContext.Provider value={{ cartItems: state.cartItems, dispatch, clearCart }}>{children}</CartContext.Provider>;
};

// Hook to use cart context
export const useCart = () => useContext(CartContext);
