import React from "react";
import { FaTimes } from "react-icons/fa";
import Button from "./Navbar/button";
import { useCart } from "../context/CartContext";

// Define cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  rating: number;
  quantity: number;
  image: string;
}

interface MealDetailsModalProps {
  isOpen: boolean;
  meal: {
    id: number; // Add an ID field for the meal
    name: string;
    price: number; // Change price to number for calculations
    image: string;
    description: string;
    items: string[];
  } | null;
  onClose: () => void;
}

const MealDetailsModal: React.FC<MealDetailsModalProps> = ({ isOpen, meal, onClose }) => {
  const { dispatch } = useCart(); // Get the dispatch function from the cart context

  if (!isOpen || !meal) return null;

  // Function to handle adding the meal to the cart
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: meal.id, // Ensure the meal has a unique ID
      name: meal.name,
      price: meal.price,
      rating: 4.5, // Add a default rating or fetch it from the meal data
      quantity: 1, // Default quantity is 1
      image: meal.image,
    };

    // Dispatch the ADD_ITEM action
    dispatch({ type: "ADD_ITEM", payload: cartItem });
    onClose(); // Close the modal after adding to cart
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <button onClick={onClose} className="float-right mb-2 text-[#EE7F61] hover:text-black">
          <FaTimes size={20} />
        </button>

        <img src={meal.image} alt={meal.name} className="w-full h-40 object-cover rounded-lg mb-4" />
        
        <h2 className="text-xl font-semibold text-orange-600">{meal.name}</h2>
        <p className="text-gray-700">{meal.description}</p>

        <h3 className="text-lg font-bold mt-3">Included:</h3>
        <ul className="list-disc ml-5 text-gray-600">
          {meal.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <p className="text-orange-600 font-bold text-lg my-3">₦{meal.price.toLocaleString()}</p>
        <div className="flex justify-self-center">
          <Button title="Add to Cart" onClick={handleAddToCart} />
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;