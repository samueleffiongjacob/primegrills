import { Link } from "react-router-dom";
import logo from "../../assets/images/primeLogo.png"
import bin from "../../assets/images/bin.png"
// import { BiChevronDown } from "react-icons/bi";
 import { IoIosArrowDown } from "react-icons/io";
 import Button from "./button";
import { AiOutlineClose, AiOutlineMenuUnfold } from "react-icons/ai";
import { useState } from "react";

const navbar = () => {
    const [menu, setMenu] = useState(false);

    const handleChange = () => {
        setMenu(!menu);
    };
    const closeMenu =() => {
        setMenu(false);
    }
    return (
        <div>
            <div className="">
                <div className="flex flex-row justify-between p-5 md:px-32 px-5 ">
                        <img
                            src={logo} 
                            alt="Logo"
                            className="h-10 w-10 mr-2"
                        />
                    <nav className=" hidden md:flex flex-row items-center text-lg font-sm gap-8 ">
                        <Link to="home"   className="cursor-pointer hover:border-b-2 border-blue-300"> Home </Link>
                        <Link to="home" className="cursor-pointer flex hover:border-2 border-blue-300"> MenuCategory <IoIosArrowDown className=" p-1 text-orange-500 text-2xl" /> </Link>
                        <Link to="home" className="cursor-pointer flex hover:border-2 border-blue-300"> Services <IoIosArrowDown className=" p-1 text-orange-500 text-2xl" /> </Link>
                        {/* <div className="relative group">
                            <div className="flex item-center gap-1">
                                <Link to="menu" className="cursor-pointer hover:text-underline transiton-all"> MenuCategory  </Link>
                            <BiChevronDown className="cursor-pointer size={32} text-orange-500"/>
                            </div>
                            
                        </div>
                        
                        <Link to="services" className="cursor-pointer"> Services  </Link> */}
                        <Link to="offers" className="cursor-pointer hover:border-b-2 border-blue-300"> Offers </Link>
                        <div className="relative size-12">
                            <div className="absolute inset-x-0 top-1 text-orange-500 text-sm pl-2">8</div>
                            <img src={bin} alt="bin"/>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-orange-300 dark:text-gray-400 pr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-2 ps-2 text-sm text-gray-400 border border-orange-500 rounded-2xl bg-white focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 " placeholder="Search " required />
                        </div>
                        <div className="">
                            <Button title= "Login" />
                        </div>   
                    </nav>
                   
                    <div className="md:hidden flex items-center">
                        {menu ? (
                            <AiOutlineClose size={25} onClick={handleChange}/>
                        ):(
                            <AiOutlineMenuUnfold size={25} onClick={handleChange} />
                        )}
                    </div>
                    <div className={`${
                        menu ? "translate-x-0" : "translate-x-full"
                        } lg:hidden flex flex-col absolute bg-orange-300 left-0 top-30 font-semibold text-md pt-8 pb-4 gap-0 w-full h-fit transition-transform duration-300` } >
                        <Link 
                            to="home"   
                            className="cursor-pointer hover:underline decoration-solid decoration-blue-300"
                            onClick={closeMenu}
                            > 
                            Home 
                        </Link>
                        <Link 
                            to="home" 
                            className="   cursor-pointer hover:underline decoration-solid decoration-blue-300"
                            onClick={closeMenu}
                            > MenuCategory 
                            {/* <IoIosArrowDown className=" ml-2 text-blue-500 text-2xl" />  */}
                        </Link>
                        <Link 
                            to="home" 
                            className=" cursor-pointer hover:underline decoration-solid decoration-blue-300" 
                            onClick={closeMenu}
                            > Services 
                            {/* <IoIosArrowDown className="  text-blue-500 text-2xl" />  */}
                        </Link>
                        <Link 
                            to="offer" 
                            className="cursor-pointer hover:underline decoration-solid decoration-blue-300" 
                            onClick={closeMenu}> Offers 
                        </Link>
                        <div className="relative flex items-center w-10 h-10" onClick={closeMenu}>
                            <div className="absolute top-0 left-2 text-orange-500 text-sm">8</div>
                            <img src={bin} alt="bin"/>
                        </div>
                        <div className="relative w-3/4 mt-4 items-center" onClick={closeMenu}>
                            <input
                            type="search"
                            id="default-search"
                            className=" w-full p-2 text-sm text-gray-400 border border-orange-500 rounded-2xl bg-white focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Search"
                            required
                            />
                        </div>
                        <div className="mt-4" onClick={closeMenu}>
                            <Button title= "Login" />
                        </div>   
                    </div>   
                </div>
                
                
            </div>
        </div>
    );
}
 
export default navbar;