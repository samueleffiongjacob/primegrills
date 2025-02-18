import { motion } from 'framer-motion';

// INTERNAL IMPORTS
import Button from "../Navbar/button";
import Card from "./Card";
import { headerVariants, slideVariants } from "../../utils/utils";
import { Link } from 'react-router-dom';

const Story =() => {
    return (
        <div>
            <div id="services" className=" p-2 justify-self-center container  grid grid-cols-1 md:grid-cols-2 lg:px-32 px-12 gap-8 ">

                {/* Left column */}
                <motion.div className="text-center md:text-left flex flex-col p-2 mr-5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={headerVariants}
                >
                    <h1
                        className="bg-clip-text text-transparent uppercase mb-4 font-bold text-sm tracking-wide px-2 bg-[#EE7F61]"
                    >
                        Our story and services
                    </h1>
                    <p className="text-4xl font-bold px-2 leading-tight">
                        Our Culinary journey<br/> and services
                    </p>
                    <p
                        className=" py-2 leading-relaxed px-2"
                        style={{
                            lineHeight: '35px',
                        }}
                        >
                    Rooted in passion, we curate unforgettable dining
                    experiences and offer exceptional services,
                    blending culinary artisanry with warm hospitality.
                    </p>
                    <Link to={'/menu-category'}>
                        <Button title="Explore" />
                    </Link>
                    
                </motion.div>
                
                {/* Right column */}
                <div className="">
                    <Card />
                </div>

            </div>

        </div>
    )      
}
export default Story;