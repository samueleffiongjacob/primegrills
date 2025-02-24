import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuth } from "../../context/authContext";
import LoginModal from "../Login";
import log from "../../assets/images/ladyimage.jpg";

const Header = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogin = (email: string, password: string) => {
    //  API call to verify credentials will be here 

    // For example purpose, simulating what the a
    const userData = {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      address: "123 Main St",
      phoneNumber: "123-456-7890",
      status: "Active",
      role: "admin"
    };
  
    
    // This comes from AuthContext
    login(email, password, userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Get the user role to display
  const userRole = user?.role || "";
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  return (
    <header className="flex justify-between items-center max-w-full px-6 py-3 bg-[#171943] text-white">
      {/* Logo or brand could go here */}
      <div className="flex-1">
        {/* Placeholder for any left-side content */}
      </div>
      
      {/* User info and actions container */}
      <div className="flex items-center gap-4">
        <Link to={'/message'}>
          <Bell className="text-white" />
        </Link>
        
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <div className="text-right text-sm">
              {/* <p className="text-gray-300">{user?.email || "user@example.com"}</p> */}
              <div className="flex items-center gap-2">
                <p className="font-medium">{user?.name || "Rudu"}</p>
                <span className="px-2 py-0.5 bg-blue-900 rounded-full text-xs">
                  {displayRole}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative">
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
            <Avatar>
              <AvatarImage
                src={log}
                alt="Admin"
                className="h-8 w-8 rounded-2xl"
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <ChevronDown className="text-white" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div onMouseLeave={toggleDropdown} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-700 z-50">
              <ul className="py-2">
                {isAuthenticated ? (
                  <>
                  <Link to={'/profile'}>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                  </Link>
                  <Link to={'/settings'} onClick={toggleDropdown}>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                  </Link>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                    Logout
                  </li>
                  <li className="px-4 py-2 bg-green-100 text-green-800">
                    Status: {user?.status}
                  </li>
                  </>
                ) : (
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleOpenLoginModal}>
                    Login
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLogin={handleLogin}
      />
    </header>
  );
};

export default Header;