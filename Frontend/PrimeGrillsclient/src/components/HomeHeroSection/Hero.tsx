
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// INTERNAL IMPORTS
import Button from "../Navbar/button.tsx";
import hero from "../../assets/images/heroimage.png";
import ItemCard from "../itemCard/itemCard.tsx";
import { headerVariants, slideVariants } from "../../utils/utils.ts";

const Hero = () => {
  return (
    <div className="container mx-auto -mt-8 p-4">
      <div className="min-h-screen flex flex-col justify-center lg:flex-row lg:justify-center items-center px-5 lg:px-12 gap-10">
        {/* Left Section */}
        <div className="w-full lg:w-2/4 space-y-4 mt-10 lg:mt-0 text-center lg:text-left">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={headerVariants}
          >
            <h1 className="font-semibold text-4xl md:text-5xl leading-tight">
              Dive Into Delights
              <br />
              of Delectable{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundColor: "#EE7F61" }}>
                Food
              </span>
            </h1>
          </motion.div>

          <motion.div
            className="my-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-md relative top-6 md:top-8 mb-5 leading-tight">
              Where Each Bite Weaves a Story of Culinary
              <br className="hidden md:block" /> Mastery and Passionate Craftsmanship
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center lg:justify-start items-center md:items-start
             gap-6 md:gap-16 relative top-8 md:top-12 mx-auto">
              <Link to={'/menu-category'}>
              <Button title="Order Now" />
              </Link>
              <h4 className="flex items-center gap-4 text-lg font-medium text-gray-800">
                Watch Video
                <span
                  className="flex items-center justify-center w-10 h-10 bg-white text-orange-500 rounded-full shadow-lg"
                  aria-label="Play"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M5.25 4.5v15l13.5-7.5-13.5-7.5z" />
                  </svg>
                </span>
              </h4>
            </div>
          </motion.div>
        </div>

         {/* Right Section */}
         <motion.div className="relative flex justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={slideVariants}
            >
                <div className="relative h-[400px] w-[400px]">
                    {/* Red Circle */}          
                    <span className="bg-[#EE7F61] absolute inset-0 m-auto top-35  rounded-full h-[340px] w-[340px] z-[-1]"></span>
                    {/* Hero Image */}
                    <img src={hero} alt="heroimg"
                        className="object-cover absolute inset-0 m-auto w-[350px] h-[350px]"
                      
                    />
                </div>

                {/* Hot Spicy Meal Label */}
                <div className=" hidden md:block absolute md:left-[-100px] px-2  py-2  transform -translate-y-1/2 bg-white md:px-8 md:py-4
                    rounded-lg shadow-[#EE7F61] shadow-2xl left-[-70px] top-30">
                    <h2 className="text-[#EE7F61] font-semibold">Hot Spicy Meal ?</h2>
                    <div className='bg-white absolute right-0 shadow-xl h-5 md:h-7 w-3 rounded-bl-3xl rounded-xl'/>
                </div>

                {/* Item Card */}
                <div className="absolute bottom-[-60px] lg:right-15">
                    <ItemCard />
                </div>
            </motion.div>      
        </div>
    </div>
  );
};

export default Hero;
