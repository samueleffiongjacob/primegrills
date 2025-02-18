import {motion} from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { FaArrowDown, FaCaretDown } from 'react-icons/fa';

// INTERNAL IMPORTS
import Button from "../Navbar/button";
import hero from "../../assets/images/heroimage.png";
import ItemCard from "../itemCard/itemCard.tsx";
import { headerVariants, slideVariants } from '../../utils/utils.ts';

const Hero =() => {
    return (
        <div className="container -mt-8 justify-self-center">
            <div className="min-h-screen flex flex-col justify-center lg:flex-row lg:justify-center items-center lg:px-12 px-5 gap-10 ">
                <div className="w-full lg:w-2/4 space-y-4 mt-14 lg:mt-0">
                 <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={headerVariants}
                	>
                        <h1 className="font-semibold text-5xl text-center lg:text-start leading-tight">Dive Into Delights 
                            <br/> of Delectable <span className=" bg-clip-text text-transparent "
                            style={{
                                backgroundColor: '#EE7F61',
                            }}
                            > Food </span>  
                        </h1>
                    </motion.div>
                    <motion.div 
                        className="my-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <p className="text-md text-center relative top-8 mb-5 lg:text-start leading-tight">Where Each Bite Weaves a Story of Culinary <br/> Mastery and Passionate Craftmanship</p>
                        <div className="flex flex-row relative top-12 mt-5 gap-16">
                                <Button  title="Order Now" onClick={() => navigate("/menu")} />
                            <h4 className="flex  items-center gap-4 text-lg font-medium text-gray-800">
                                Watch Video
                                <span
                                    className="flex items-center justify-center w-10 h-10 bg-white text-orange-500 rounded-full shadow-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all mr-2"
                                    aria-label="Play"
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-8 h-8"
                                    >
                                    <path d="M5.25 4.5v15l13.5-7.5-13.5-7.5z" />
                                    </svg>
                                </span>
                                
                            </h4>               
                        </div>
                    </motion.div>
                </div>
            
                <motion.div className="relative flex justify-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={slideVariants}
                >
                    <div className="relative h-[400px] w-[300px]">
                        {/* Red Circle */}          
                        <span className="bg-[#EE7F61] absolute inset-0 m-auto top-20  rounded-full h-[300px] w-[300px] z-[-1]"></span>
                        {/* Hero Image */}
                        <img
                        src={hero}
                        alt="heroimg"
                        className="object-cover absolute top-0 left-0 w-[300px] h-[400px] rounded-full overflow-hidden"
                        />
                    </div>

                    {/* Hot Spicy Meal Label */}
                    <div className="absolute left-[-120px] top-26 transform -translate-y-1/2 bg-white px-8 py-4
                     rounded-lg shadow-[#EE7F61] shadow-2xl">
                        <h2 className="text-[#EE7F61] font-semibold">Hot Spicy Meal ?</h2>
                        <div className='bg-white absolute right-0 shadow-xl h-7 w-3 rounded-bl-3xl rounded-xl'/>
                    </div>

                    {/* Item Card */}
                    <div className="absolute bottom-[-60px] right-2  ">
                        <ItemCard />
                    </div>
                </motion.div>      
            </div>
            
        </div>
    )
}
export default Hero;