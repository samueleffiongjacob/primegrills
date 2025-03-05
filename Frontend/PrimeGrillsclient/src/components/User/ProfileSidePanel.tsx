import React from "react";
import { User, Bell, Clock, Heart, CreditCard, MapPin, LogOut, X, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface ProfileSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void; // Optional callback for login UI
}

const ProfileSidePanel: React.FC<ProfileSidePanelProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  // Use the auth context
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    { icon: Bell, label: "Notifications", badge: 3 },
    { icon: Clock, label: "Order History" },
    { icon: Heart, label: "Favorites" },
    { icon: CreditCard, label: "Payment Methods" },
    { icon: MapPin, label: "Addresses" },
  ];

  // Default profile data when not authenticated
  const defaultProfile = {
    name: "Guest",
    username: "",
    email: "",
    phone: "",
    memberSince: ""
  };
  //console.log('profile ',user)
  // Use actual user data or default
  const profile = user || defaultProfile;

  const handleLogin = () => {
    // If onLogin prop is provided, use it to navigate to login page
    if (onLogin) {
      onLogin();
    }
  };

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
            <h2 className="text-lg font-semibold">{profile.name}</h2>
            {isAuthenticated && profile.username && (
              <p className="text-sm text-gray-500">@{profile.username}</p>
            )}
            {isAuthenticated && profile.email && (
              <p className="text-sm text-gray-500">{profile.email}</p>
            )}
            {!isAuthenticated && (
              <p className="text-sm text-gray-500">Not logged in</p>
            )}
          </div>
        </div>

        {/* Menu Items - Only show if authenticated */}
        {isAuthenticated && (
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
        )}

        {/* Membership info - Only show if authenticated */}
        {isAuthenticated && profile.memberSince && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Member since</p>
            <p className="font-medium">{profile.memberSince}</p>
          </div>
        )}

        {/* Logout/Login Button */}
        <div className="mt-6 border-t pt-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </button>
          ) : (
            <button
              onClick={handleLogin}
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