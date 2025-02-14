import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import RemoveFromCartModal from "../../components/RemoveFromCartModal";

interface CartItemProps {
  id: number;
  image: string;
  name: string;
  rating: number;
  price: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItemCard: React.FC<CartItemProps> = ({
  id,
  image,
  name,
  rating,
  price,
  quantity,
  onIncrease,
  onDecrease,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle decrease logic
  const handleDecrease = () => {
    if (quantity === 1) {
      setIsModalOpen(true); // Open modal instead of decreasing
    } else {
      onDecrease(); // Decrease normally
    }
  };

  return (
    <div className="flex items-center md:px-8 p-4 py-8 bg-white rounded-lg shadow-md">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 md:mr-2 shadow-[#EE7F61] shadow-lg rounded-lg object-cover"
      />
      <div className="ml-4 flex-1">
        <h3 className="md:text-lg font-semibold mb-2">{name}</h3>
        <div className="flex items-center mb-2 text-black font-bold">
          ⭐ <span className="ml-1 ">{rating}</span>
        </div>
        <p className="text-[#AFB518] font-bold">₦{price.toLocaleString()}</p>
      </div>

      <div className="flex items-center rounded-lg md:px-2 bg-[#D9D9D9]">
        {/* Handle Decrease */}
        <button onClick={handleDecrease} className="p-2 text-[#EE7F61] rounded-md hover:text-[#965c4c]">
          <FaMinus size={16} />
        </button>

        <span className="md:mx-1 mx-[2px] text-sm w-6 h-5 text-center rounded-md bg-white shadow-gray-500 shadow-md">
          {quantity}
        </span>

        <button onClick={onIncrease} className="p-2 hover:text-[#965c4c] text-[#EE7F61] rounded-md">
          <FaPlus size={16} />
        </button>

         {/* Trash Button to Open Modal */}
       <div
          className="text-[#EE7F61] hover:text-[#b57766] flex justify-between absolute -mb-26 ml-2 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <FaTrash className="mt-1 mr-1" />
          <p>Remove</p>
        </div>
      </div>

      {isModalOpen && (
        <RemoveFromCartModal
          id={id}
          onConfirm={() => {
            onDecrease(); // Now actually remove the item
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CartItemCard;
