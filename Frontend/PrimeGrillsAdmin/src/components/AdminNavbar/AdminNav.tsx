import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import log from "../../assets/images/ladyimage.jpg";
// import Avatar from "react-avatar";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex justify-end items-center max-w-full  px-6 py-3  bg-[#171943] text-white">
      <div className="flex items-center gap-4">
        <Bell className="text-white" />
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
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-700">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
