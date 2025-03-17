import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

interface NotPopularProps {
  id: number;
  img: string;
  title: string;
  price: number;
}

const NotPopularMenu: React.FC<NotPopularProps> = ({ id, img, title, price }) => {
  const { cartItems, dispatch } = useCart();

  // Find the quantity of the specific item
  const item = cartItems.find((item) => item.id === id);
  const quantity = item ? item.quantity : 0;

  // Handle the plus button click
  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    if (!item) {
      // If the item is not in the cart, add it first
      dispatch({
        type: "ADD_ITEM",
        payload: { id, name: title, price, rating: 0, quantity: 1, image: img },
      });
    } else {
      // If the item is already in the cart, increase its quantity
      dispatch({ type: "INCREASE_QUANTITY", payload: id });
    }
  };

  // Handle the minus button click
  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  };

  return (
    <motion.div
      className="bg-white p-4 rounded-2xl shadow-lg transition-all duration-300 w-full max-w-[220px] mx-auto relative overflow-hidden border border-gray-200 hover:shadow-xl"
      whileHover={{ scale: 1.05 }}
    >

      {/* Image */}
      <div className="h-[100px] w-[120px] mx-auto mb-1 flex justify-center items-center">
        <img src={img} alt={title} className="object-contain w-full h-full rounded-md" />
      </div>

      {/* Title & Price */}
      <h3 className="font-bold text-center text-gray-800 text-lg mb-1">{title}</h3>
      <p className="text-center text-orange-500 font-semibold text-md">₦{price.toLocaleString()}</p>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 mt-3">
        <button
          onClick={handleDecreaseQuantity} // Use the updated handler
          className="text-lg font-bold text-gray-700 px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
          disabled={quantity === 0}
        >
          -
        </button>
        <span className="text-lg font-semibold text-gray-700">{quantity}</span>
        <button
          onClick={handleIncreaseQuantity} // Use the updated handler
          className="text-lg font-bold text-white px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600"
        >
          +
        </button>
      </div>
    </motion.div>
  );
};

export default NotPopularMenu;