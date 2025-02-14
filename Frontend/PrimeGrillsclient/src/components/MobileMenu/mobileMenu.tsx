import { FiSearch } from "react-icons/fi";
import bin from "../../assets/images/bin.png";
import MenuSection from "./Section1";
import PopularGrid from "./PopularGrid";
import Promotion from "../Promotion";




const MobileMenu = () => {
    const SearchBar = ({ className = "" }) => (
      <div className={`relative ${className}`}>
        <input
          type="search"
          placeholder="Search for foods,snacks,drinks etc"
          className="w-[400px] max-w-xl lg:w-[800px] lg:max-w-2xl py-4 px-8 justify-self-center items-center  text-gray-700 bg-gray-300 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-[#EE7F61] focus:ring-opacity-50
                    placeholder:text-gray-500 text-sm"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>
    );
    const CartIcon = () => (
        <div className="relative cursor-pointer group">
          <img src={bin} alt="Shopping Cart" className="w-20 h-20 text-[#EE7F61] absolute lg:top-2 right-0"
          style={{
            filter: "invert(72%) sepia(47%) saturate(370%) hue-rotate(351deg) brightness(95%) contrast(94%)",
          }}
           />
          
          <div className="hidden group-hover:block absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
            <p className="text-sm text-gray-600">Your cart items will appear here</p>
          </div>
        </div>
      );
      


          
        

    return(
        <div className="container">
            <div className="">
                <div className="py-8 px-8">
                    <CartIcon />
                    <h1 className="font-bold text-lg py-4 px-2.5">Menu</h1>
                    <div className="flex justify-center w-full">
                        <SearchBar />
                    </div>
                </div>
                <div>
                    <MenuSection />
                </div>
                {/* Promotion */}
                <Promotion />
                {/* Popular */}
                <div className="">
                    <PopularGrid/>
                </div>
            </div>
        </div>
    )
}

export default MobileMenu;