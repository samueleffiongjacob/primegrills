import { FaStar } from 'react-icons/fa';
import test1 from '../../assets/images/test1.jpeg';
import test2 from '../../assets/images/test2.jpeg';
import test3 from '../../assets/images/test3.jpeg';
import test4 from '../../assets/images/test4.jpeg';

interface TestimonialCardProps {
    customerImage: string;
    testimonialText: string;
    customerName: string;
    rating: number;
    reviewCount: number;
}

const TestimonialCard = ({
    customerImage,
    testimonialText,
    customerName,
    rating,
    reviewCount,
}: TestimonialCardProps) => {
    return (
        <div className="container mx-auto mt-8 mb-12 px-4 lg:px-24">
            {/* Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:items-end">
                {/* Left Column: Customer Image */}
                <div className="relative flex justify-center lg:justify-start">
                    <span className="bg-[#EE7F61] absolute bottom-0 left-1/2 lg:left-2 transform -translate-x-1/2 lg:translate-x-0 w-[260px] md:w-[320px] h-[220px] md:h-[240px] rounded-t-[140px]" />
                    <img src={customerImage} alt="Customer" className="relative rounded-lg mr-2 w-72 md:w-80 h-auto" />
                    
                    {/* Badge */}
                    <div className="absolute -bottom-3 left-[60%] md:left-[50%] lg:left-[32%] transform -translate-x-1/2 md:translate-x-0
                     bg-white flex items-center px-2 md:px-4 py-2 rounded-lg shadow-md">
                        <h2 className="text-black text-xs md:text-lg font-bold mr-2">Our best chef</h2>
                        <span className="text-xs md:text-xl">😍</span>
                    </div>
                </div>

                {/* Right Column: Testimonials */}
                <div className="space-y-6 text-center lg:flex lg:flex-col lg:text-left lg:justify-end">
                    <h1 className="text-sm font-bold tracking-wide text-[#EE7F61]">TESTIMONIALS</h1>
                    <p className="text-2xl md:text-4xl font-bold leading-tight">
                        What our Customers <br className="hidden md:block" /> say about us
                    </p>
                    <p className="text-md md:text-lg leading-relaxed">{testimonialText}</p>

                    {/* Feedback Section */}
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        {/* Customer Avatars */}
                        <div className="flex space-x-2">
                            <img src={test1} alt="" className="w-10 h-10 object-cover rounded-full shadow-md" />
                            <img src={test2} alt="" className="w-10 h-10 object-cover rounded-full shadow-md" />
                            <img src={test3} alt="" className="w-10 h-10 object-cover rounded-full shadow-md" />
                            <img src={test4} alt="" className="w-10 h-10 object-cover rounded-full shadow-md" />
                        </div>

                        {/* Feedback Text */}
                        <div className="text-center lg:pl-12 lg:text-left w-full">
                            <h2 className="text-lg md:text-xl font-bold">{customerName || "Customer's Feedback"}</h2>
                            <p className="flex items-center justify-center lg:justify-start gap-2 text-lg">
                                <FaStar className="text-[#EE7F61]" />
                                <span className="font-bold">{rating}</span> ({reviewCount} Reviews)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
