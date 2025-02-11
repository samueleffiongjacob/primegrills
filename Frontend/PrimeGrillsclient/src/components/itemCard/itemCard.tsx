
import { FaStar } from "react-icons/fa";
import heroimg1 from "../../assets/images/heroimg1.png";
import heroimg2 from "../../assets/images/heroimg2.png";

const ItemCard = () => {
  return (
  
    <div className=" flex flex-col lg:flex-row gap-4 p-4 ">
      {/* First Item */}
      <div className="flex flex-row items-center bg-white rounded-2xl shadow-md pr-15  w-full lg:w-1/2">
        <img src={heroimg1} alt="Grilled Turkey" className="h-10 w-10 rounded-full" />
        <div className="ml-1 flex-1">
          <h2 className="text-md font-semibold whitespace-nowrap overflow-hidden">Grilled Turkey</h2>
          <div className="flex items-center mt-1">
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61]" />
          </div>
          <p className="text-sm font-medium text-gray-700 mt-1">#3,400.00</p>
        </div>
      </div>

      {/* Second Item */}
      <div className="flex flex-row items-center bg-white rounded-2xl shadow-md pr-15  w-full lg:w-1/2">
        <img src={heroimg2} alt="Despicable Amala" className="h-10 w-10 rounded-full" />
        <div className="ml-1 flex-1">
          <h2 className="text-md font-semibold whitespace-nowrap">Despicable Amala</h2>
          <div className="flex items-center mt-1">
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61]" />
          </div>
          <p className="text-sm font-medium text-gray-700 mt-2">#2,500.00</p>
        </div>
      </div>
    </div>

  );
};

export default ItemCard;
