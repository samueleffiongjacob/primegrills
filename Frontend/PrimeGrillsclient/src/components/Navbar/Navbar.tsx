import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineClose, AiOutlineMenuUnfold } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/images/primeLogo.png";
import bin from "../../assets/images/bin.png";
import Button from "./button";
import LoginModal from "../Auth/Login";
import SignUpModal from "../Auth/SignUp";

const NavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="group flex items-center gap-1 hover:text-[#EE7F61] transition-colors duration-300 relative"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#EE7F61] transition-all duration-300 group-hover:w-full" />
  </Link>
);

const SearchBar = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <input
      type="search"
      placeholder="Search menu items..."
      className="w-full py-2 px-4 pr-10 text-gray-700 bg-white border border-[#EE7F61] rounded-full 
                focus:outline-none focus:ring-2 focus:ring-[#EE7F61] focus:ring-opacity-50
                placeholder:text-gray-400 text-sm"
    />
    <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EE7F61] w-5 h-5" />
  </div>
);

const CartIcon = () => (
  <div className="relative cursor-pointer group">
    <img src={bin} alt="Shopping Cart" className="w-10 h-10" />
    <span className="absolute -top-1 -right-1 bg-[#EE7F61] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      8
    </span>
    <div className="hidden group-hover:block absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
      <p className="text-sm text-gray-600">Your cart items will appear here</p>
    </div>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null);

  // handle login
  const handleLogin = (email: string, password: string) => {
    console.log('Logging in with:', email, password);
    setActiveModal(null); // Close the modal after login
  };

  // handle sign up
  const handleSignUp = (email: string, password: string) => {
    console.log('Signing up with:', email, password);
    setActiveModal(null); // Close the modal after signup
  };


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { title: "Home", path: "/home" },
    {
      title: "Menu Category",
      path: "/menu",
      hasDropdown: true,
      dropdownItems: ["Breakfast", "Lunch", "Dinner", "Specials"]
    },
    {
      title: "Services",
      path: "/services",
      hasDropdown: true,
      dropdownItems: ["Catering", "Private Events", "Delivery"]
    },
    { title: "Offers", path: "/offers" }
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
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                <NavLink to={item.path}>
                  <span>{item.title}</span>
                  {item.hasDropdown && (
                    <IoIosArrowDown className="text-[#EE7F61] ml-1" />
                  )}
                </NavLink>
                {item.hasDropdown && activeDropdown === item.title && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                    {item.dropdownItems.map((dropItem) => (
                      <Link
                        key={dropItem}
                        to="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {dropItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <SearchBar className="w-48" />
            <CartIcon />
            <Button title="Login" onClick={() => setActiveModal('login')} />
          </div>
      
        {/* LoginModal */}
        <LoginModal
          isOpen={activeModal === 'login'}
          onClose={() => setActiveModal(null)}
          onLogin={handleLogin}
          onToggleSignUp={() => setActiveModal('signup')} // Toggle to SignUpModal
        />

        {/* SignUpModal */}
        <SignUpModal
          isOpen={activeModal === 'signup'}
          onClose={() => setActiveModal(null)}
          onSignUp={handleSignUp}
          onToggleLogin={() => setActiveModal('login')} // Toggle to LoginModal
        />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <AiOutlineClose className="w-6 h-6" />
            ) : (
              <AiOutlineMenuUnfold className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-4 pb-6 space-y-6">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={closeMenu}>
              {item.title}
            </NavLink>
          ))}
          <SearchBar />
          <CartIcon />
          <div className="mt-auto">
            <Button title="Login" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;