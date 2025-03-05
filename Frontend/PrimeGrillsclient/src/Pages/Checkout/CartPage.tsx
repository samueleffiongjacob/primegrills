import { useCart } from "../../context/CartContext";
import CartItemCard from "./CartItemCard";
import Button from "../../components/Navbar/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

// Add proper type for toggleLoginModal prop
interface CartPageProps {
  toggleLoginModal: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ toggleLoginModal }) => {
  const { cartItems, dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-32">
        <h2 className="text-2xl font-bold mb-8">Your cart is empty</h2>
        <Button title="Go to Menu" onClick={() => navigate("/menu-category")} />
      </div>
    );
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      // This should now work correctly
      toggleLoginModal();
    }
  };

  return (
    <div className="max-w-4xl justify-center mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        Cart <span className="text-gray-600 text-sm">{cartItems.length} Item(s)</span>
      </h2>
      <div className="mt-4 space-y-4">
        {cartItems.map((item) => (
          <CartItemCard 
            id={item.id}
            key={item.id}
            image={item.image}
            name={item.name}
            rating={item.rating}
            price={item.price}
            quantity={item.quantity}
            onIncrease={() => dispatch({ type: "INCREASE_QUANTITY", payload: item.id })}
            onDecrease={() => dispatch({ type: "DECREASE_QUANTITY", payload: item.id })}
          />
        ))}
      </div>
      <div className="my-10 text-xl px-6 md:px-24 font-bold flex justify-between">
        <span>Total</span>
        <span className="text-black">₦{totalAmount.toLocaleString()}</span>
      </div>
      <div className="flex justify-self-center">
        <Button title="Continue to Checkout" onClick={handleCheckout} />
      </div>
    </div>
  );
};

export default CartPage;