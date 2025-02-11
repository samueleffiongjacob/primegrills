import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome,  FaUser, FaBarcode, FaUtensils } from "react-icons/fa";

const BottomNavigation = () => {
    interface bottomNav {
        path: string;
        label: string;
        icon: React.ReactNode;
      }
      const bottomNav = [
        { path: "/home", label: "Home", icon: <FaHome className="text-xl" /> },
        { path: "/menu", label: "Menu", icon: <FaUtensils className="text-xl" /> },
        { path: "/feedback", label: "FeedBack", icon: <FaBarcode className="text-xl" /> },
        { path: "/profile", label: "Profile", icon: <FaUser className="text-xl" /> },
      ];


    return(
        <div>
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
                <div className="flex justify-around items-center py-2">
                    {bottomNav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                        `flex flex-col items-center text-sm font-medium ${
                            isActive ? "text-[#EE7F61]" : "text-gray-500"
                        } hover:text-[#EE7F61]`
                        }
                    >
                        <button className="flex flex-col items-center">
                        {item.icon}
                        <span>{item.label}</span>
                        </button>
                    </NavLink>
                ))}
                </div>
            </nav>
        </div>
    )
}

export default BottomNavigation;