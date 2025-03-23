

import React, { useState } from "react";
import { User, Bell, Clock, Heart,  MapPin, LogOut, X, LogIn, MailQuestion } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface ProfileSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

const ProfileSidePanel: React.FC<ProfileSidePanelProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const { user, isAuthenticated, logout, fetchUserProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const menuItems = [
    //{ icon: Bell, label: "Notifications", badge: 3, path: "/notifications" },
    { icon: Clock, label: "Order History", path: "/order-history"  },
   // { icon: Heart, label: "Favorites", path: "/favorites"  },
    { icon: MailQuestion, label: "FAQ", path: "/faqs" },
    { icon: MapPin, label: "Addresses" },
  ];

  const defaultProfile = {
    name: "Guest",
    username: "",
    email: "",
    phone: "",
    memberSince: "",
    address: "",
    profileImage: null,
  };

  const profile = user || defaultProfile;

  const handleLogin = () => {
    if (onLogin) onLogin();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profileImage", file);

    setIsUploading(true);

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/upload-image/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken || "",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      // Refresh user profile to get the updated image URL
      await fetchUserProfile();
    } catch (error) {
      console.error("Image Upload Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  return (
    <div className={`fixed top-0 right-0 w-80 z-50 h-full bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-semibold">My Profile</h1>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {/* Profile Details */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-500" />
            )}
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

        {/* Image Upload */}
        {isAuthenticated && (
          <div className="mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          </div>
        )}

        {/* Menu Items - Only show if authenticated */}
        {isAuthenticated && (
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Link to={item.path || ''}>
              <button key={index} className="w-full flex text-left p-3 hover:bg-gray-100 rounded-lg"
              >
                <item.icon className="w-5 h-5 mt-1 text-gray-500 mr-3" />
                <span className="flex-grow text-gray-700">{item.label}</span>
                {/* {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )} */}
              </button>
              </Link> 
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