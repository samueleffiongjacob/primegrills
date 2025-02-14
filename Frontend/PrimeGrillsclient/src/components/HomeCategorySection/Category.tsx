import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// INTERNAL IMPORTS
import MenuCard from "./MenuCard";
import { MENU_CARD_ITEMS } from "./menuItemDetails";
import { headerVariants, slideVariants } from "../../utils/utils";


const Menu = () => {
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
        <div id="menuCategory" className="my-32 justify-center flex flex-col lg:px-32 px-12">
            {/* Header and title */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
            >
                <h1 className="bg-clip-text text-center text-transparent font-semibold text-sm px-2"
                    style={{
                        backgroundColor: "#EE7F61",
                        letterSpacing: "0.4em",
                    }}
                >
                    CUSTOMER FAVORITE
                </h1>
                <p className="md:text-4xl text-2xl font-bold text-center">Popular Categories</p>
            </motion.div>

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
                className="w-full  px-6 py-1"
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
                    modules={[Navigation, Pagination]}
                    spaceBetween={32}
                    breakpoints={{
                        640: {slidesPerView: 2, spaceBetween: 20},
                        1024: { slidesPerView: 4, spaceBetween: 30},
                    }}
                    className=" h-[220px] "
                >
                    {MENU_CARD_ITEMS.map((item, index) => (
                        <SwiperSlide key={item.id} className="p-2">
                            <div className="w-full max-w-sm mx-auto" >
                                <Link to={item.path}>
                                    <MenuCard
                                        img={item.img}
                                        title={item.title}
                                        value={item.value}
                                    />
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
        
    );
};

export default Menu;