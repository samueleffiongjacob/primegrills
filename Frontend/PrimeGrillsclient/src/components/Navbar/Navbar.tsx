import { useState } from "react";
import { Link, useLocation, To } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { User } from "lucide-react";

// INTERNAL IMPORTS
import { CartIcon } from "../CartIcon";
import logo from "../../assets/images/primeLogo.png";
import Button from "./button";
import LoginModal from "../User/Login";
import SignUpModal from "../User/SignUp";
import ProfileSidePanel from "../User/ProfileSidePanel";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../../context/AuthContext";
import { groupByCategory } from "../../utils/groupMenuCategory";
import { menuItems } from "../sample";

// interface UserProfile {
//   username: string;
//   name: string;
//   email: string;
//   phone: string;
//   memberSince: string;
//   profileImage: string | null; // Add profileImage to the UserProfile interface
// }

interface NavLinkProps {
  to: To; // Route path
  children: React.ReactNode; // Children can be any React node
  onClick?: () => void; // Optional click handler
  isParentActive?: boolean; // Optional boolean to indicate active parent
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClick, isParentActive }) => {
  const location = useLocation(); // Get current URL
  const isActive = location.pathname === to || isParentActive; // Check if link is active or parent is active
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center gap-1 transition-colors duration-300 relative 
        ${isActive ? "text-[#EE7F61]" : "hover:text-[#EE7F61]"}`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-[#EE7F61] transition-all duration-300 
          ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      />
    </Link>
  );
};

const Navbar = () => {
  const [activeModal, setActiveModal] = useState<"login" | "signup" | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation(); // Get current URL
  const { user, isAuthenticated } = useAuth();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };


  const handleLoginFromPanel = () => {
    setActiveModal("login"); // Open the login modal
    setIsProfileOpen(false); // Close the profile panel
  };
  const groupedMenuItems = groupByCategory(menuItems)

  const navItems = [
    { title: "Home", path: "/" },
    {
      title: "Menu",
      subItems: [
        { title: "Menu-Category", path: "/menu-category" },
        { title: "All Menu", path: "/menu/all" },
        { title: "Special Dishes", path: "/menu/special" },
        { title: "Popular Dishes", path: "/menu/popular" },
        ...Object.keys(groupedMenuItems).map((category) => ({
          title: category,
          path: `/menu/${category.toLowerCase().replace(/\s+/g, "-")}`,
        })),
      ],
    },
    { title: "Services", path: "/services" },
    { title: "Reservation", path: "/reservation" },
    { title: "Offers", path: "/offers" },
    { title: "Feedback", path: "/feedback" },
    { title: "Faqs", path: "/faqs" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Prime and Grills" className="h-14 w-14" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // Check if any of the subItems are active
              const isParentActive = item.subItems?.some(
                (subItem) => location.pathname === subItem.path
              );

              return (
                <div
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(item.title)}
                >
                  <NavLink
                    to={item.path || '/menu-category'}
                    onClick={() => {
                      if (item.title.toLowerCase() === "offers") {
                        document
                          .getElementById("offers")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    isParentActive={isParentActive} // Pass whether any subItem is active
                  >
                    {item.title}
                    {item.subItems && (
                      <FiChevronDown className="w-4 text-[#EE7F61] h-4 ml-1" />
                    )}
                  </NavLink>

                  {/* Dropdown for Menu */}
                  {item.subItems && hoveredItem === item.title && (
                    <div
                      className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md opacity-100 
                      isible transition-opacity duration-300"
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item.subItems.map((subItem) => {
                        const isSubItemActive =
                          location.pathname === subItem.path;

                        return (
                          <Link
                            key={subItem.title}
                            to={subItem.path}
                            className={`block px-4 py-2 transition-colors 
                              ${
                                isSubItemActive
                                  ? "text-[#EE7F61]"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                          >
                            {subItem.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <SearchBar className="w-48" />
            <CartIcon />

            {/* Conditionally render Login Button or Profile Icon */}
            {!isAuthenticated ? (
              <Button title="Login" onClick={() => setActiveModal("login")} />
            ) : (
              <button
                onClick={toggleProfile}
                className="p-2 hover:bg-gray-300 bg-gray-200 rounded-full"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-700" />
                )}
              </button>
            )}
          </div>

          {/* Profile Side Panel */}
          <ProfileSidePanel
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onLogin={handleLoginFromPanel} // Pass login handler
          />

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center space-x-4">
            <SearchBar className="w-48" />
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={activeModal === "login"}
        onClose={() => setActiveModal(null)}
        onLogin={() => setActiveModal(null)}
        onToggleSignUp={() => setActiveModal("signup")}
      />
      <SignUpModal
        isOpen={activeModal === "signup"}
        onClose={() => setActiveModal(null)}
        onSignUp={() => setActiveModal(null)}
        onToggleLogin={() => setActiveModal("login")}
      />
    </header>
  );
};

export default Navbar;