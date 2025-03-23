import { useState, useEffect } from "react";
import { Link, useLocation, To } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
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

interface NavLinkProps {
  to: To; // Route path
  children: React.ReactNode; // Children can be any React node
  onClick?: () => void; // Optional click handler
  isParentActive?: boolean; // Optional boolean to indicate active parent
  className?: string; // Optional additional className
  hasSubItems?: boolean; // Indicates if the link has sub-items
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  onClick,
  isParentActive,
  className = "",
  hasSubItems = false,
}) => {
  const location = useLocation(); // Get current URL
  const isActive = location.pathname === to || isParentActive; // Check if link is active or parent is active

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault(); // Prevent navigation if the item has sub-items
    }
    onClick?.(); // Call the provided onClick handler
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`group flex items-center gap-1 transition-colors duration-300 relative 
        ${isActive ? "text-[#EE7F61]" : "hover:text-[#EE7F61]"} ${className}`}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation(); // Get current URL
  const { user, isAuthenticated } = useAuth();

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginFromPanel = () => {
    setActiveModal("login"); // Open the login modal
    setIsProfileOpen(false); // Close the profile panel
  };

  const groupedMenuItems = groupByCategory(menuItems);

  // Define which items should be in mobile toggle
  const mobileToggleItems = [
    { title: "Services", path: "/services" },
    { title: "Reservation", path: "/reservation" },
    { title: "Offers", path: "/offers" },
    { title: "Feedback", path: "/feedback" },
    { title: "Faqs", path: "/faqs" },
  ];

  // Define which items should be visible outside toggle for tablets
  const tabletVisibleItems = [
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
  ];

  // Full navigation items for desktop
  const navItems = [...tabletVisibleItems, ...mobileToggleItems];

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Function to handle hover state
  const handleNavItemHover = (itemTitle: string | null) => {
    setHoveredItem(itemTitle);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Prime and Grills" className="h-14 w-14" />
          </Link>

          {/* Desktop Navigation (lg screens and up) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              // Check if any of the subItems are active
              const isParentActive = item.subItems?.some(
                (subItem) => location.pathname === subItem.path
              );

              return (
                <div
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() => handleNavItemHover(item.title)}
                  onMouseLeave={() => handleNavItemHover(null)}
                >
                  <NavLink
                    to={item.path || ""}
                    onClick={() => {
                      if (item.title.toLowerCase() === "offers") {
                        document
                          .getElementById("offers")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    isParentActive={isParentActive} // Pass whether any subItem is active
                    hasSubItems={!!item.subItems} // Indicate if the item has sub-items
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
                      visible transition-opacity duration-300"
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

          {/* Tablet Navigation (outside toggle) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-4">
            {tabletVisibleItems.map((item) => {
              const isParentActive = item.subItems?.some(
                (subItem) => location.pathname === subItem.path
              );

              return (
                <div
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() => handleNavItemHover(item.title)}
                  onMouseLeave={() => handleNavItemHover(null)}
                >
                  <NavLink
                    to={item.path || "/menu-category"}
                    isParentActive={isParentActive}
                    hasSubItems={!!item.subItems} // Indicate if the item has sub-items
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
                      visible transition-opacity duration-300"
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

          {/* Right Section (changes based on screen size) */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search - visible on all screen sizes */}
            <SearchBar className={`${isMobile ? "w-24" : "w-32 md:w-48"}`} />

            {/* Cart Icon - visible on all screen sizes */}
            <CartIcon />

            {/* Desktop & Tablet Login/Profile */}
            <div className="hidden md:block">
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

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:block lg:hidden p-2 text-gray-600 hover:text-[#EE7F61]"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {/* For mobile, show toggle items only */}
              {/* For tablet, show only the toggleable items */}
              {mobileToggleItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className="py-2"
                  onClick={() => {
                    if (item.title.toLowerCase() === "offers") {
                      document
                        .getElementById("offers")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Profile Side Panel */}
      <ProfileSidePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogin={handleLoginFromPanel}
      />

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