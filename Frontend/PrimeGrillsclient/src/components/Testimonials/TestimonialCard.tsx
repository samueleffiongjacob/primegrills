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
    customerName, // to replace the text 'Customer's Feedback' if necessary in future
    rating,
    reviewCount,
}: TestimonialCardProps) => {
    return (
        <div className="container h-[400px] mt-8 mb-12 justify-self-center grid grid-cols-1 md:grid-cols-2 lg:px-24 px-5 gap-8">
            {/* Left Column: Image and Chef Info */}
            <div className="relative flex flex-col">
                <span className='bg-[#EE7F61] h-[240px] left-1.5 w-[320px] absolute bottom-0 rounded-t-[140px] text-white'>
                    placeholder
                </span>
                <img src={customerImage} alt="Customer" className="absolute bottom-0 rounded-lg w-80 h-auto" />
                <div className="absolute -bottom-2 right-20 bg-white flex items-center px-4 py-2 rounded-lg shadow-gray-400 shadow-md">
                    <h2 className="text-black font-bold mr-2">Our best chef</h2>
                    <span className="text-xl">😍</span>
                </div>
            </div>

            {/* Right Column: Testimonials */}
            <div className="space-y-6 h-[400px] flex flex-col justify-end">
                <h1
                    className="bg-clip-text text-transparent font-bold text-sm tracking-wide px-2"
                    style={{
                        backgroundColor: '#EE7F61',
                        letterSpacing: '0.2em',
                    }}
                >
                    TESTIMONIALS
                </h1>
                <p className="text-4xl font-bold px-2 leading-tight">
                    What our Customers <br /> say about us
                </p>
                <p className="text-left py-2 leading-relaxed px-2" style={{ lineHeight: '35px' }}>
                    {testimonialText}
                </p>

                {/* Feedback Section */}
                <div className="flex flex-col lg:flex-row items-center gap-6">
                     <div className="flex  ">
                        <img src={test1} alt="" className="w-10 h-10 object-cover rounded-full" />
                        <img src={test2} alt="" className="w-10 h-10 object-cover rounded-full" />
                        <img src={test3} alt="" className="w-10 h-10 object-cover rounded-full" />
                        <img src={test4} alt="" className="w-10 h-10 object-cover rounded-full" />
                    </div>
                    {/* Feedback Text */}
                    <div className="text-center lg:text-left pl-12 w-full">
                        <h2 className="text-xl font-bold">Customer's Feedback</h2>
                        <p className="flex items-center justify-center lg:justify-start gap-2 text-xl">
                            <FaStar className="text-[#EE7F61]" />
                            <span className="font-bold">{rating}</span> ({reviewCount} Reviews)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;