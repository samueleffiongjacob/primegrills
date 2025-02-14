import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaBarcode, FaUtensils } from "react-icons/fa";
import ProfileSidePanel from "./User/ProfileSidePanel";

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); // State for side panel visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status

  interface BottomNavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
  }

  const bottomNav: BottomNavItem[] = [
    { path: "/", label: "Home", icon: <FaHome className="text-xl" /> },
    { path: "/menu", label: "Menu", icon: <FaUtensils className="text-xl" /> },
    { path: "/feedback", label: "Feedback", icon: <FaBarcode className="text-xl" /> },
    { path: "#", label: "Profile", icon: <FaUser className="text-xl" /> }, // Use "#" for profile path
  ];

  // Handle profile icon click
  const handleProfileClick = () => {
    setIsSidePanelOpen(true); // Open the side panel
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false
    setIsSidePanelOpen(false); // Close the side panel
  };

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true); // Set login state to true
    setIsSidePanelOpen(false); // Close the side panel (optional)
  };

  return (
    <>
      <nav className="md:hidden fixed z-50 bottom-0 w-full bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          {bottomNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center text-sm font-medium transition-colors ${
                  isActive ? "text-[#EE7F61] font-semibold" : "text-gray-500"
                } hover:text-[#EE7F61]`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                onClick={item.path === "#" ? handleProfileClick : undefined} // Handle profile click
              >
                <span className="flex flex-col items-center">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Profile Side Panel */}
      <ProfileSidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        profile={{
          username: isLoggedIn ? "john_doe" : "", // Example username
          name: isLoggedIn ? "John Doe" : "", // Example name
          email: isLoggedIn ? "john.doe@example.com" : "", // Example email
          phone: isLoggedIn ? "+1234567890" : "", // Example phone
          memberSince: isLoggedIn ? "2023-01-01" : "", // Example member since
        }}
        onLogout={handleLogout}
        onLogin={handleLogin} // Pass login handler
        isLoggedIn={isLoggedIn} // Pass login state
      />
    </>
  );
};

export default BottomNavigation;