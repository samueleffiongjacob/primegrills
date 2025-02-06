import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MenuCard from "./MenuCard";
import menuimg1 from "../../assets/images/menuimg1.png";


const Menu =() => {
    return (
        <div className="min-h-screen flex flex-col lg:px-32 px-5 ">
            <h1 className=" bg-clip-text text-transparent font-semibold text-sm px-2 "
                        style={{
                            backgroundColor: '#EE7F61',
                            letterSpacing: '0.4em',
                          }}>CUSTOMER FAVORITE</h1>
            <p className="text-4xl font-bold">Popular Categories</p>
            <span>
                <FaChevronLeft size={20}/>
                <FaChevronRight size={20}/>
            </span>
            <div className="flex flex-wrap pb-8 gap-8 justify-center">
                <MenuCard img={menuimg1} title="Food" />
                <MenuCard img={menuimg1} title="Food" />
            </div>
        </div>
    )
}
export default Menu;