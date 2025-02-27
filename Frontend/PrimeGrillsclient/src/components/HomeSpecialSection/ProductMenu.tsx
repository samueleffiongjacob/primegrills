import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Navigation, Pagination} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; 

// INTERNAL IMPORTS
import Product from "./product";
import { MENU_ITEMS } from './productDetails';
import { headerVariants, slideVariants } from '../../utils/utils';
import MealDetailsModal from '../MealDetailsModal';

const ProductMenu: React.FC = () => {
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
        id: number,
        image: string;
        name: string;
        description: string;
        price: number;
        rating: string; 
        items: string[];
      } | null>(null);

    return (
        <div id='offers' className="mx-auto mt-32 mb-18 flex flex-col lg:px-32 px-12">
            <motion.div
                className='mb-3'
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={headerVariants}
            >
                <h1 
                    className="bg-[#EE7F61] bg-clip-text text-transparent font-semibold text-sm px-2 lg:text-left
                    text-center"
                    style={{ letterSpacing: '0.4em' }}
                >
                    SPECIAL DISHES
                </h1>
                
                <p className="md:text-4xl text-2xl font-bold lg:text-left text-center px-2">
                    Standout Dishes <br/> From Our Menu
                </p>
            </motion.div>

            {/* Swiper Buttons */}
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

            {/* Swiper Container */}
            <motion.div 
                className="w-full"
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
                    slidesPerView={1}
                    breakpoints={{
                        640: {slidesPerView: 2, spaceBetween: 20},
                        1024: {slidesPerView: 3, spaceBetween: 30},
                    }}
                    className="w-full"
                >
                    {MENU_ITEMS.map((item) => (
                        <SwiperSlide key={item.id} className="flex items-center justify-center">
                            <div className="w-full max-w-sm mx-auto"
                            onClick={() => setSelectedMeal(item)}>
                                <Product
                                    img={item.image}
                                    title={item.name}
                                    description={item.description}
                                    price={item.price}
                                    rating={item.rating}
                                />
                            </div>
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

export default ProductMenu;