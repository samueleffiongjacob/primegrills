import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import logo from "../../assets/images/primeLogo.png"

const navbar = () => {
    return (
        <div>
            <div>
                <div className="flex flex-row justify-between p-5">
                        <img
                            src={logo} 
                            alt="Logo"
                            className="h-10 w-10 mr-2"
                        />
                    <nav className="">
                        <Link to="home" className="cursor-pointer"> Home </Link>
                        <Link to="menu" className="cursor-pointer">MenuCategory<span><FaAngleDown  className=""/> </span></Link>
                        <Link to="services" className="cursor-pointer"> Services </Link>
                        <Link to="offer" className="cursor-pointer"> Offers </Link>
                        
                    </nav>
                    

                </div>
            </div>
        </div>
    );
}
 
export default navbar;