import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Popular from "../../../components/Popular";

import pizza from "../../../assets/images/pizza.png";
import desert from "../../../assets/images/desert.png";
import product4 from "../../../assets/images/product4.png";
import menuimage3 from "../../../assets/images/menuimg3.png";
import menuimage1 from "../../../assets/images/menuimg1.png";
import MealDetailsModal from "../../../components/MealDetailsModal";

const MenuDrinksSection = () => {
  // Sample data
  const Drink_ITEMS = [
    { id: 1, image: menuimage3, name: "Smoothie", price: 10000,
    description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
    },
    { id: 2, image: menuimage3, name: "Wine", price: 10000 ,
        description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
    },
    { id: 3, image: menuimage3, name: "Coffee", price: 10000 ,
        description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
    },
    { id: 4, image: menuimage3, name: "Tea", price: 10000,
        description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
     },
    { id: 5, image: menuimage1, name: "Grilled Fish", price: 10000 ,
        description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
    },
    { id: 6, image: menuimage1, name: "Grilled Fish", price: 10000,
        description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
     },
    { id: 7, image: menuimage1, name: "Grilled Fish", price: 10000,
        description: "A delicious and spicy Shawarma wrap.",
    items: ["Chicken slices", "Pita bread", "Garlic sauce"]
     },
  ];

  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  };

const [selectedMeal, setSelectedMeal] =  useState<{
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    items: string[];
} | null>(null);

  return (
    <div className="flex flex-col justify-self-center px-4 mx-auto mt-12 md:mt-24 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ml-4 text-black">Bars/Drinks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            className={`rounded-full me-4 w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 ${
              isBeginning
                ? "bg-gray-200 opacity-50 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            <FaChevronLeft size={20} className="text-black" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            className={`rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 ${
              isEnd
                ? "bg-[#ffaa91] opacity-50 cursor-not-allowed"
                : "bg-[#EE7F61] hover:bg-[#ff8f71]"
            }`}
          >
            <FaChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Swiper Slider */}
      <motion.div className="w-full py-1">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          modules={[Navigation, Pagination]}
          spaceBetween={16} // Space between slides
          slidesPerView={2} // Default to 2 slides per view
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 }, // 2 slides on small screens
            768: { slidesPerView: 3, spaceBetween: 20 }, // 3 slides on medium screens
            1024: { slidesPerView: 5, spaceBetween: 30 }, // 5 slides on large screens
          }}
        >
          {Drink_ITEMS.map((item) => (
            <SwiperSlide key={item.id} onClick={() => setSelectedMeal(item)}>
              <Popular id={item.id} img={item.image} title={item.name} price={item.price} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
       {/* Meal Details Modal */}
       <MealDetailsModal 
        isOpen={!!selectedMeal} 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />
    </div>
  );
};

export default MenuDrinksSection;