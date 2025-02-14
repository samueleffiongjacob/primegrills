
import MobileMenu from "../components/MobileMenu/mobileMenu";
import { BiBarChart, BiBattery, BiFilterAlt } from "react-icons/bi";
const MenuPage = () => {
    return(
        <div className=" flex justify-center item-center ">
            <div className="bg-white flex flex-col w-full  rounded-2xl overflow-hidden shadow-lg">
                {/* Gray section */}
                <div className="bg-gray-500 w-full h-[77px] flex items-center px-6">
                    <p className="text-white font-bold text-lg">10:27</p>
                    <div className="flex space-x-1 ms-auto">
                        <BiBarChart className=" text-white rounded- p-1 text-2xl"/>
                        <BiFilterAlt className=" text-white rounded- p-1 text-2xl"/>
                        <BiBattery className=" text-white rounded- p-1 text-2xl"/>
                    </div>
                </div>
                
                <MobileMenu/>
                
            </div>
            
        </div>
    )
}

export default MenuPage;