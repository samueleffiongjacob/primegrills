import { Link } from "react-router-dom";
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
                        <Link to="menu" className="cursor-pointer">
                        <select>
                            <option>MenuCategory</option>
                        </select>
                        </Link>
                        <Link to="services" className="cursor-pointer">
                        <select>
                            <option>Services</option>
                        </select>
                        </Link>
                        <Link to="offer" className="cursor-pointer"> Offers </Link>
                        

                        {/* {["MenuCategory", "Services"].map(
                                    (item) => (
                                    <Link  to="menu" key={item}>
                                        <select className="">
                                        <option value={item}>{item}</option>
                                        </select>
                                    </Link>
                                    )
                                )} */}
                    </nav>
                    

                </div>
            </div>
        </div>
    );
}
 
export default navbar;