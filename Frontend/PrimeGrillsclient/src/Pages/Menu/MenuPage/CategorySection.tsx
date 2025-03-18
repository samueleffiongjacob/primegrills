import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Importing images
import menuimg1 from "../../../assets/images/menuimg1.png";
import menuimg2 from "../../../assets/images/menuimg2.png";
import menuimg3 from "../../../assets/images/menuimg3.png";
import product4 from "../../../assets/images/product4.png";
import pizza from "../../../assets/images/pizza.png";
import desert from "../../../assets/images/desert.png";

interface MenuProps {
  img: string;
  title: string;
  path: string; // Add path as a prop
}

const MenuItem: React.FC<MenuProps> = ({ img, title, path }) => {
  return (
    <Link to={path}>
      <motion.div
        className="flex flex-col items-center hover:text-white bg-gray-300 hover:bg-[#EE7F61] p-4 rounded-2xl shadow-md transition-all duration-300"
        whileHover={{ scale: 1.05 }}
      >
        <div className="h-[80px] w-[80px] rounded-lg overflow-hidden">
          <img src={img} alt={title} className="object-cover w-full h-full" />
        </div>
        <h3 className="mt-2 text-md font-bold text-center">{title}</h3>
      </motion.div>
    </Link>
  );
};

const CategorySection = () => {
  const MENU_ITEMS: MenuProps[] = [
    { img: product4, title: "All", path: "/menu/all" },
    { img: pizza, title: "Pizza", path: "/menu/pizza" },
    { img: desert, title: "Desert", path: "/menu/desert" },
    { img: menuimg2, title: "Pastries", path: "/menu/pastries" },
    { img: menuimg3, title: "Barbecue", path: "/menu/barbecue" },
    { img: menuimg1, title: "Grilled Fish", path: "/menu/grilled-fish" },
    { img: desert, title: "Desert", path: "/menu/desert" },
    { img: menuimg1, title: "Grilled Fish", path: "/menu/grilled-fish" },
  ];

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = React.useRef<any>(null);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  };

  return (
    <div className="flex flex-col my-10 md:mt-14 md:mb-24">
      {/* Title and Navigation Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Menu</h1>
        <div className="flex gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            className={`rounded-full w-10 me-4 h-10 flex items-center justify-center shadow-md transition-all duration-300 ${
              isBeginning
                ? "bg-gray-200 cursor-not-allowed opacity-50"
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
                ? "bg-[#ffaa91] cursor-not-allowed opacity-50"
                : "bg-[#EE7F61] hover:bg-[#ff8f71]"
            }`}
          >
            <FaChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Swiper Slider */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Swiper
          spaceBetween={16} // Space between slides
          slidesPerView={2} // Default to 2 slides per view
          breakpoints={{
            640: { slidesPerView: 3 }, // 3 slides on small screens
            768: { slidesPerView: 4 }, // 4 slides on medium screens
            1024: { slidesPerView: 5 }, // 5 slides on large screens
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
        >
          {MENU_ITEMS.map((item, index) => (
            <SwiperSlide key={index}>
              <MenuItem img={item.img} title={item.title} path={item.path} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

export default CategorySection;