import { useNavigate } from "react-router-dom"; 
import { useCart } from "../context/CartContext"; // cart context for state management
import bin from '../assets/images/bin.png'

export const CartIcon = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Fetch cart items from context

  // Calculate total quantity in the cart
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative cursor-pointer group" onClick={() => navigate("/cart")}>
      <img src={bin} alt="Shopping Cart" className="w-10 h-10" />
      
      {/* Cart Badge (Shows if items exist) */}
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#EE7F61] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalQuantity}
        </span>
      )}

      {/* Dropdown on hover */}
      <div className="hidden group-hover:block absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
        {totalQuantity > 0 ? (
          <p className="text-sm text-gray-600">You have {totalQuantity} item(s) in your cart</p>
        ) : (
          <p className="text-sm text-gray-600">Your cart is empty</p>
        )}
      </div>
    </div>
  );
};
