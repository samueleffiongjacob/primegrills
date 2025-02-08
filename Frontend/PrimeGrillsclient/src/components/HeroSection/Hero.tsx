import Button from "../Navbar/button";
import hero from "../../assets/images/heroimage.png";
import ItemCard from "../itemCard/itemCard.tsx";
// import heroimg1 from "../../assets/images/heroimg1.png"
// import { FaStar } from "react-icons/fa";

const Hero =() => {
    return (
        <div className="container">
            <div className="min-h-screen flex flex-col justify-center lg:flex-row lg:justify-center items-center lg:px-12 px-5 gap-10 ">
                <div className="w-full lg:w-2/4 space-y-4 mt-14 lg:mt-0">
                    <h1 className="font-semibold text-5xl text-center lg:text-start leading-tight">Dive Into Delights 
                        <br/> of Delectable <span className=" bg-clip-text text-transparent "
                        style={{
                            backgroundColor: '#EE7F61',
                          }}
                          > Food </span>  
                    </h1>
                    <p className="text-md text-center lg:text-start leading-tight">Where Each Bite Weaves a Story of Culinary <br/> Mastery and Passionate Craftmanship</p>
                    <div className="flex flex-row gap-16">
                        <Button className="" title="Order Now" />
                        <h4 className="flex items-center gap-4 text-lg font-medium text-gray-800">
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
                </div>
                
                <div className=" relative">
                    <img src={hero} alt="heroimg"
                        className="object-cover w-[400px] h-3/4  bg-[#EE7F61] item-center rounded-full overflow- "/>
                
                    <div className="absolute bg-white px-8 py-4 top-0  rounded-lg">
                        <h2 className="text-[#EE7F61]">Hot Spicy Meal</h2>
                    </div>
                    <div className="  bottom-0">
                        <ItemCard  />
                    </div>
                
                </div>
                
            </div>
            
        </div>
    )
}
export default Hero;