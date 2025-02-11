import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// INTERNAL IMPORTS
import TestimonialCard from './TestimonialCard';
import { testimonials } from './testimonialsDetails';
import '../../assets/styles/index.css'
import { slideVariants } from '../../utils/utils';

const Testimonials = () => {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className="lg:mb-32  flex flex-col pt-4 relative px-5">
            {/* Swiper Component */}
            <motion.div className="relative pb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={slideVariants}
            >
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    modules={[Navigation, Pagination, Autoplay]}
                    autoplay={{delay: 3000, disableOnInteraction: false}}
                    spaceBetween={32}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        1024: { slidesPerView: 1, spaceBetween: 30 },
                    }}
                    loop={true}
                    pagination={{
                        clickable: true,
                        bulletActiveClass: 'swiper-pagination-bullet-active',
                        bulletClass: 'swiper-pagination-bullet',
                    }}
                    className="w-full pb-16"
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <TestimonialCard {...testimonial} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
    );
};

export default Testimonials;