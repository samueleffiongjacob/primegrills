
import { FaStar } from "react-icons/fa";
import heroimg1 from "../../assets/images/heroimg1.png";
import heroimg2 from "../../assets/images/heroimg2.png";

const ItemCard = () => {
  return (
    // <div className=" bg-white px-4 py-3 bottom-5 left-5 rounded-lg shadow-lg">
      <div className="flex flex-row gap-4  ">
        {/* First Item */}
        <div className="flex items-center bg-white border border-white rounded-lg p-4">
          <img src={heroimg1} alt="Grilled Turkey" className="h-16 w-16 rounded-full" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Grilled Turkey</h2>
            <div className="flex items-center mt-1">
              <FaStar className="text-[#EE7F61] me-1 " />
              <FaStar className="text-[#EE7F61] me-1" />
              <FaStar className="text-[#EE7F61] me-1" />
              <FaStar className="text-[#EE7F61]" />
            </div>
            <p className="mr-10 font-medium">#3,400.00</p>
          </div>
        </div>

        {/* Second Item */}
        <div className="flex items-center border border-white rounded-lg bg-white p-4">
          <img src={heroimg2} alt="Grilled Turkey" className="h-16 w-16 rounded-full" />
          <div className="ml-4">
            <h2 className="text-md font-semibold">Despicable Amala</h2>
            <div className="flex items-center mt-1">
              <FaStar className="text-[#EE7F61] me-1 " />
              <FaStar className="text-[#EE7F61] me-1" />
              <FaStar className="text-[#EE7F61] me-1" />
              <FaStar className="text-[#EE7F61]" />
            </div>
            <p className="mr-13 font-medium">#2,500.00</p>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default ItemCard;
