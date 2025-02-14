import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaBarcode, FaUtensils } from "react-icons/fa";

const BottomNavigation: React.FC = () => {
  interface BottomNavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
  }

  const bottomNav: BottomNavItem[] = [
    { path: "/home", label: "Home", icon: <FaHome className="text-xl" /> },
    { path: "/menu", label: "Menu", icon: <FaUtensils className="text-xl" /> },
    { path: "/feedback", label: "Feedback", icon: <FaBarcode className="text-xl" /> },
    { path: "/profile", label: "Profile", icon: <FaUser className="text-xl" /> },
  ];

  return (
    <nav className="md:hidden sticky w-full bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
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
            aria-label={item.label}
          >
            <button className="flex flex-col items-center">
              {item.icon}
              <span>{item.label}</span>
            </button>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
