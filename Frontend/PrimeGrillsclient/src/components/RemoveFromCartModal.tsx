import { useCart } from "../context/CartContext";
import Button from "./Navbar/button";

interface RemoveFromCartModalProps {
    id: number;
    onConfirm: () => void;
    onClose: () => void;
  }

const RemoveFromCartModal: React.FC<RemoveFromCartModalProps> = ({ id, onConfirm, onClose }) => {
  const { dispatch } = useCart();

   onConfirm = () => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    onClose(); // Close modal after removing item
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold mb-4">Remove item from cart?</p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className="bg-[#EE7F61] hover:bg-[#ff8f71] text-white px-4 py-2 rounded-md">
            Remove
          </button>
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveFromCartModal;
