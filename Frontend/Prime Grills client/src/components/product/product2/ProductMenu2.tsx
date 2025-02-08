import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Menu2 from "../product2/product2";
import pastry1 from "../../assets/images/pastry1.png";
import pastry2 from "../../assets/images/pastry2.png";
import pastry3 from "../../assets/images/pastry3.png";


const ProductMenu = () => {
    return(
        <div className="min-h-screen flex flex-col lg:px-32 px-5 ">
            <h1 className=" bg-clip-text text-transparent font-semibold text-sm px-2 text-left "
                        style={{
                            backgroundColor: '#EE7F61',
                            letterSpacing: '0.4em',
                          }}>SPECIAL DISHES</h1>
            <p className="text-4xl font-bold text-left px-2 ">Standout Dishes <br/> From Our Menu</p>
            <div className=" p-4  flex ms-auto">
                <div className="bg-gray-300 rounded-full w-10 h-10 me-4 flex items-center justify-center shadow-md">
                    <FaChevronLeft size={20} className="text-black" />
                </div>
                <div className="bg-[#EE7F61] rounded-full w-10 h-10 flex items-center justify-center shadow-md">
 
                    <FaChevronRight size={20} className="text-white" />
                </div>
            </div>
            <div className="flex flex-wrap pb-8 gap-8 ">
                <Menu2 img={pastry1} title="Yummy Pepperoni Pizza" value="#7500.00" />
                <Menu2 img={pastry2} title="Fattuos Salad" value="#5000.00" />
                <Menu2 img={pastry3} title="Despicable Pastries" value="#3500.00"/>
                
                
            </div>
        </div>
    )
}
export default ProductMenu;