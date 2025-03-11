import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuth } from "../../context/authContext";
import LoginModal from "../Login";
import log from "../../assets/images/ladyimage.jpg"; // Default fallback image

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  console.log('user', user?.staff_profile.status)

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

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Get the user role to display
  const userRole = user?.staff_profile.role || "";
  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  // Get the user's profile image URL or use the default fallback image
  const profileImage = user?.profileImage || log;

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
              <div className="flex items-center gap-2">
                <p className="font-medium">{user?.username || "User"}</p>
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
              {/* Use the user's profile image if available, otherwise fallback to the default image */}
              <AvatarImage
                src={profileImage}
                alt={user?.name || "User"}
                className="h-8 w-8 rounded-2xl"
              />
              <AvatarFallback>
                {/* Fallback to the user's initials if no image is available */}
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                  : "PM"}
              </AvatarFallback>
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
                      Status: {user?.staff_profile.status}
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
      />
    </header>
  );
};

export default Header;