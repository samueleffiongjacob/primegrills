import React, { useState, useCallback, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaBarcode, FaUtensils, FaTimes, FaAngleRight } from "react-icons/fa";
import ProfileSidePanel from "./User/ProfileSidePanel";

interface SubLink {
  path: string;
  label: string;
}

interface BottomNavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  sublinks?: SubLink[];
}

interface ProfileData {
  username: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}

interface ProfileSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onLogout: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const bottomNav: BottomNavItem[] = useMemo(() => [
    { 
      path: "/", 
      label: "Home", 
      icon: <FaHome className="text-xl" /> 
    },
    { 
      path: "/menu", 
      label: "Menu", 
      icon: <FaUtensils className="text-xl" />,
      sublinks: [
        { path: "/menu-category", label: "Menu" },
        { path: "/menu/all", label: "All Meals" },
        { path: "/menu/drinks", label: "Drinks" },
        { path: "/menu/food", label: "Food" },
        { path: "/menu/special", label: "Specials" },
        { path: "/menu/grills", label: "Grills" },
        { path: "/menu/popular", label: "Popular" },
        { path: "/menu/pastries", label: "Pastries" },
      ]
    },
    { 
      path: "/feedback", 
      label: "Feedback", 
      icon: <FaBarcode className="text-xl" /> 
    },
    { 
      path: "#", 
      label: "Profile", 
      icon: <FaUser className="text-xl" /> 
    }
  ], []);

  const handleNavItemClick = useCallback((item: BottomNavItem) => {
    if (item.path === "#") {
      setIsSidePanelOpen(true);
      setActiveSubmenu(null);
    } else if (item.sublinks) {
      setActiveSubmenu(activeSubmenu === item.path ? null : item.path);
    } else {
      navigate(item.path); 
      setActiveSubmenu(null);
    }
  }, [activeSubmenu, navigate]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setIsSidePanelOpen(false);
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setIsSidePanelOpen(false);
  }, []);

  const profileData: ProfileData = useMemo(() => ({
    username: isLoggedIn ? "john_doe" : "",
    name: isLoggedIn ? "John Doe" : "",
    email: isLoggedIn ? "john.doe@example.com" : "",
    phone: isLoggedIn ? "+1234567890" : "",
    memberSince: isLoggedIn ? "2023-01-01" : "",
  }), [isLoggedIn]);

  return (
    <>
      {/* Submenu Panel */}
      {activeSubmenu && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40" 
          onClick={() => setActiveSubmenu(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Submenu"
        >
          <div 
            className="fixed bottom-10 overflow-y-auto max-h-[70%] left-0 right-0 bg-white rounded-t-2xl p-4 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {bottomNav.find(item => item.path === activeSubmenu)?.label}
              </h3>
              <button 
                onClick={() => setActiveSubmenu(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close submenu"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-2" role="menu">
              {bottomNav
                .find(item => item.path === activeSubmenu)
                ?.sublinks?.map(sublink => (
                  <NavLink
                    key={sublink.path}
                    to={sublink.path}
                    className={({ isActive }) => `
                      flex items-center justify-between p-3 rounded-lg
                      ${isActive ? 'bg-[#EE7F61] text-white' : 'hover:bg-gray-100'}
                    `}
                    onClick={() => setActiveSubmenu(null)}
                    role="menuitem"
                  >
                    <span>{sublink.label}</span>
                    <FaAngleRight className={location.pathname === sublink.path ? 'text-white' : 'text-gray-400'} />
                  </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav 
        className="md:hidden fixed z-50 bottom-0 w-full bg-white shadow-lg border-t border-gray-200"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-around items-center py-2">
          {bottomNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavItemClick(item)}
                className={`flex flex-col items-center text-sm font-medium transition-colors ${
                  isActive || activeSubmenu === item.path
                    ? "text-[#EE7F61] font-semibold" 
                    : "text-gray-500"
                } hover:text-[#EE7F61]`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                role="tab"
                aria-selected={isActive}
              >
                <span className="flex flex-col items-center">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile Side Panel */}
      <ProfileSidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        profile={profileData}
        onLogout={handleLogout}
        onLogin={handleLogin}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
};

export default BottomNavigation;