import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import pizza from "../../assets/images/pizza.png";
import desert from "../../assets/images/desert.png";
import product4 from "../../assets/images/product4.png";
import menuimg3 from "../../assets/images/menuimg3.png";
import menuimg1 from "../../assets/images/menuimg1.png";

import Popular from "./Popular";

const PopularGrid = () => {
  interface PopularProps {
    id: number;
    img: string;
    title: string;
    value: string;
  }

  const Popular_ITEMS: PopularProps[] = [
    { id: 1, img: pizza, title: "Pizza", value: "#10000" },
    { id: 2, img: desert, title: "Desert", value: "#10000" },
    { id: 3, img: product4, title: "Chicken", value: "#10000" },
    { id: 4, img: menuimg3, title: "Barbecue", value: "#10000" },
    { id: 5, img: menuimg1, title: "Grilled Fish", value: "#10000" },
    { id: 6, img: product4, title: "Chicken", value: "#10000" },
    { id: 7, img: menuimg3, title: "Barbecue", value: "#10000" },
    { id: 8, img: menuimg1, title: "Grilled Fish", value: "#10000" },
    { id: 9, img: menuimg1, title: "Grilled Fish", value: "#10000" },

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

  return (
    <div id="menumobile" className="flex flex-col items-center px-5 -mt-50px">
      {/* Navigation Buttons */}
      <motion.div
        className="p-4 flex justify-end w-full"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={isBeginning}
          className={`rounded-full w-10 h-10 me-4 flex items-center justify-center shadow-md transition-all duration-300 ${
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
      </motion.div>

      {/* Swiper Component */}
      <motion.div
        className="w-full px-6 py-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="h-[240px]"
        >
          {Popular_ITEMS.map((item, index) => (
            <SwiperSlide key={item.id} className="p-2">
              <motion.div
                className="w-full max-w-sm mx-auto "
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <Popular img={item.img} title={item.title} value={item.value} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

export default PopularGrid;
