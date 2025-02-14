import React from "react";
import { User, Bell, Clock, Heart, CreditCard, MapPin, LogOut, X, LogIn } from "lucide-react";

interface UserProfile {
  username: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}

interface ProfileSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onLogout: () => void; // onLogout prop
  onLogin: () => void; // onLogin prop
  isLoggedIn: boolean; // isLoggedIn prop
}

const ProfileSidePanel: React.FC<ProfileSidePanelProps> = ({
  isOpen,
  onClose,
  profile,
  onLogout,
  onLogin,
  isLoggedIn,
}) => {
  const menuItems = [
    { icon: Bell, label: "Notifications", badge: 3 },
    { icon: Clock, label: "Order History" },
    { icon: Heart, label: "Favorites" },
    { icon: CreditCard, label: "Payment Methods" },
    { icon: MapPin, label: "Addresses" },
  ];

  return (
    <div
      className={`fixed top-0 right-0 w-80 z-50 h-full bg-white shadow-xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-semibold">My Profile</h1>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {/* Profile Details */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{profile.name || "Guest"}</h2>
            <p className="text-sm text-gray-500">
              {profile.username ? `@${profile.username}` : "Not logged in"}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button key={index} className="w-full flex text-left p-3 hover:bg-gray-100 rounded-lg">
              <item.icon className="w-5 h-5 mt-1 text-gray-500 mr-3" />
              <span className="flex-grow text-gray-700">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Logout/Login Button */}
        <div className="mt-6 border-t pt-4">
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center p-3 text-green-600 hover:bg-green-50 rounded-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidePanel;