import { useState } from "react";
import { FaHeart } from "react-icons/fa";

interface PopularProps {
  img: string;
  title: string;
  value: string;
}

const Popular: React.FC<PopularProps> = ({ img, title, value }) => {
  const [quantity, setQuantity] = useState(0);

  return (
    <div
      className="bg-gray-300 hover:bg-[#EE7F61] p-2 rounded-2xl shadow-lg 
                 transition-all duration-300 w-full max-w-[200px] mx-auto relative overflow-y-auto"
    >
        {/* Love Icon */}
      <div className="absolute top-0 right-0">
        <FaHeart className="text-red-500 w-6 h-6" />
      </div>
      {/* Image */}
      <div className="h-[70px] w-[100px] rounded-lg mb-1 mx-auto">
        <img
          src={img}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Title */}
      <h3 className="font-bold text-md text-center mb-1">{title}</h3>
      <p className="font-bold text-md text-center mb-1 text-amber-400"> {value} </p>

      {/* Quantity Controls */}
      <div className=" flex items-center justify-between bg-white rounded-xl">
        <button
          onClick={() => setQuantity((prev) => Math.max(prev - 1, 0))}
          className="text-lg font-bold  text-[#884938] px-2 py-1 rounded-lg hover:bg-[#662e26]"
        >
          -
        </button>
        <button className="text-lg font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded-lg shadow-md my-2">{quantity}</button>
        <button
          onClick={() => setQuantity((prev) => prev + 1)}
          className="text-lg font-bold  text-[#EE7F61] px-2 py-1 rounded-lg hover:bg-[#d96e54]"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Popular;
