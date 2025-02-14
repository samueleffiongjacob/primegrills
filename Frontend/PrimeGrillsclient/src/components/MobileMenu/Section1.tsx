import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
 // export default mobileMenuDetails;
 import menuimg1 from "../../assets/images/menuimg1.png";
 import menuimg2 from "../../assets/images/menuimg2.png";
 import menuimg3 from "../../assets/images/menuimg3.png";
 
 import product4 from "../../assets/images/product4.png";
 import pizza from "../../assets/images/pizza.png";
 import desert from "../../assets/images/desert.png";

// INTERNAL IMPORTS
// import { MENU_ITEMS } from "./mobileMenuDetails";
import { slideVariants } from "../../utils/utils";
import MenuItem from "./menuDetail";


const MenuSection = () => {
   

interface MenuProps {
    id: number;
    img: string;
    title: string;
    
}


const MENU_ITEMS: MenuProps[] = [
    {
        id: 1,
        img: product4,
        title: 'All'
    },
    {
        id: 2,
        img: pizza,
        title: 'Pizza'
    },
    {
        id: 3,
        img: desert,
        title: 'Desert'
    },
    {
        id: 4,
        img: menuimg2,
        title: 'Pastries'
    },
    {
        id: 5,
        img: menuimg3,
        title: 'Barbecue'
    },
    {
        id: 6,
        img: menuimg1,
        title: 'Grilled Fish'
    },
    {
        id: 7,
        img: desert,
        title: 'Desert'
    },
    {
        id: 8,
        img: menuimg1,
        title: 'Grilled Fish'
    },
    {
        id: 3,
        img: desert,
        title: 'Desert'
    },
    {
        id: 9,
        img: menuimg1,
        title: 'Grilled Fish'
    },
    {
        id: 10,
        img: desert,
        title: 'Desert'
    },
    // Add more menu items as needed
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
        <div id="menumobile" className=" justify-center flex flex-col px-5">

            {/* Navigation Buttons */}
             <motion.div 
                className="p-4 flex ms-auto"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <button 
                    onClick={() => swiperRef.current?.slidePrev()}
                    disabled={isBeginning}
                    className={`rounded-full w-10 h-10 me-4 flex items-center justify-center shadow-md transition-all duration-300 ${
                        isBeginning 
                        ? 'bg-gray-200 cursor-not-allowed opacity-50' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                >
                    <FaChevronLeft size={20} className="text-black" />
                </button>
                <button 
                    onClick={() => swiperRef.current?.slideNext()}
                    disabled={isEnd}
                    className={`rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 ${
                        isEnd 
                        ? 'bg-[#ffaa91] cursor-not-allowed opacity-50' 
                        : 'bg-[#EE7F61] hover:bg-[#ff8f71]'
                    }`}
                >
                    <FaChevronRight size={20} className="text-white" />
                </button>
            </motion.div>

            {/* Swiper Component */}
            <motion.div 
                className="w-full  px-6  py-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={slideVariants}
            >
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onSlideChange={handleSlideChange}
                    modules={[Navigation, Pagination, ]}
                    spaceBetween={10}
                    // autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    slidesPerView={1}
                    breakpoints={{
                        640: {slidesPerView: 2, spaceBetween: 20},
                        1024: { slidesPerView: 5, spaceBetween: 15},
                    }}
                    className=" h-[200px]  "
                >
                    {MENU_ITEMS.map((item, index) => (
                        <SwiperSlide key={item.id} className="p-2">
                            <motion.div 
                                className="w-full max-w-sm mx-auto"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ 
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                            >
                                <MenuItem img={item.img} title={item.title}  />
                                
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
        
    );
};

export default MenuSection;