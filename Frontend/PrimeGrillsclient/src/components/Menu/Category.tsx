import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MenuCard from "./MenuCard";
import menuimg1 from "../../assets/images/menuimg1.png";
import menuimg2 from "../../assets/images/menuimg2.png";
import menuimg3 from "../../assets/images/menuimg3.png";
import heroimg1 from "../../assets/images/heroimg1.png";



const Menu =() => {
    return (
        <div id="menuCategory" className=" flex flex-col lg:px-32 px-5 ">
            <h1 className=" bg-clip-text text-transparent font-semibold text-sm px-2 "
                        style={{
                            backgroundColor: '#EE7F61',
                            letterSpacing: '0.4em',
                          }}>CUSTOMER FAVORITE</h1>
            <p className="text-4xl font-bold">Popular Categories</p>
            <div className=" p-4  flex ms-auto">
                <div className="bg-gray-300 rounded-full w-10 h-10 me-4 flex items-center justify-center shadow-md">
                    <FaChevronLeft size={20} className="text-black" />
                </div>
                <div className="bg-[#EE7F61] rounded-full w-10 h-10 flex items-center justify-center shadow-md">
 
                    <FaChevronRight size={20} className="text-white" />
                </div>
            </div>
            <div className="flex flex-wrap pb-8 gap-8 justify-center">
                <MenuCard img={menuimg1} title="Food" value="(150 Dishes)" />
                <MenuCard img={menuimg2} title="Pastries" value="(150 Dishes)" />
                <MenuCard img={menuimg3} title="Bar/Drinks" value="(150 Dishes)"/>
                <MenuCard img={heroimg1} title="Barbeque" value="(150 Dishes)" />
            </div>
            
        </div>
    )
}
export default Menu;