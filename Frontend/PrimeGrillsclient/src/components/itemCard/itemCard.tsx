
import { FaStar } from "react-icons/fa";
import heroimg1 from "../../assets/images/heroimg1.png";
import heroimg2 from "../../assets/images/heroimg2.png";

const ItemCard = () => {
  return (
  
    <div className=" flex w-full flex-row gap-4 p-4 ">
      {/* First Item */}
      <div className="flex flex-row p-4 shadow-[#EE7F61] shadow-2xl items-center md:pr-15 bg-white rounded-2xl w-fit h-16">
        <img src={heroimg1} alt="Grilled Turkey" className="h-10 w-10 rounded-full" />
        <div className="ml-1 flex-1">
          <h2 className="md:text-sm text-xs font-semibold whitespace-nowrap overflow-hidden w-24">Grilled Turkey</h2>
          <div className="flex items-center ">
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61]" />
          </div>
          <p className="md:text-sm text-xs font-medium text-gray-700 ">#3,400.00</p>
        </div>
      </div>

      {/* Second Item */}
      <div className="flex p-2 flex-row shadow-[#EE7F61] shadow-2xl items-center bg-white rounded-2xl h-16  md:pr-15 w-48">
        <img src={heroimg2} alt="Despicable Amala" className="h-10 w-10 rounded-full" />
        <div className="ml-1 flex-1">
          <h2 className="md:text-sm text-xs font-semibold whitespace-nowrap">Despicable Amala</h2>
          <div className="flex items-center ">
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61] me-1" />
            <FaStar className="text-[#EE7F61]" />
          </div>
          <p className="md:text-sm text-xs font-medium text-gray-700">#2,500.00</p>
        </div>
      </div>
    </div>

  );
};

export default ItemCard;
