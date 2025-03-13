import React, { useState, useEffect } from 'react';
import { UserCircleIcon, BellIcon, ShieldCheckIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/authContext';
import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast for notifications

const Settings: React.FC = () => {
  const { user, setUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    phoneNumber: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: user?.profileImage || '',
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState({
    email: false,
    push: false
  })  // to use the below later
 /*  const [notifications, setNotifications] = useState({
    email: user?.notifications?.email || false,
    push: user?.notifications?.push || false,
  });
 */
  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        phoneNumber: user.phone || '',
        address: user.address || '',
        profileImage: user.profileImage || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Show preview immediately for better UX
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    const formData = new FormData();
    formData.append('profileImage', file);

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/upload-image/`, {
        method: 'POST',
        body: formData,
        credentials: "include", 
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, profileImage: data.imageUrl }));
        //setUser({ ...user, profileImage: data.imageUrl });
        toast.success('Profile image updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to upload image');
        // Revert preview on error
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('An error occurred while uploading image');
      setImagePreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Phone validation
    if (formData.phoneNumber && !/^\+?[0-9\s\-()]{8,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async () => {
    if (!validateForm()) return;
    
    const profileData = {
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/staffs/profile/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ ...user, ...data.user });
        toast.success('Profile updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!validateForm()) return;
    
    if (!formData.newPassword) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/staffs/profile/update-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password updated successfully');
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!validateForm()) return;
    
    // Save profile info
    await handleProfileUpdate();
    
    // Save password if provided
    if (formData.newPassword) {
      await handlePasswordChange();
    }
    
    // Save notifications settings
    // Implement notifications update API call here if needed
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] w-full mr-4 overflow-hidden">
      <div className="h-full p-4 lg:p-6 bg-gray-50">
        {/* Settings Container */}
        <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden">
          {/* Settings Header - Sticky */}
          <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Settings Content - Scrollable */}
          <div className="overflow-y-auto h-[calc(100%-80px)] px-4 lg:px-6">
            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
              {/* Profile Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <UserCircleIcon className="h-8 w-8 text-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={imagePreview || formData.profileImage || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <div className="flex flex-col">
                        <input
                          type="file"
                          id="photo-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="photo-upload"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer text-center"
                        >
                          {isLoading ? 'Uploading...' : 'Change Photo'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 200x200px</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          name="username"
                          className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                          value={formData.username}
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : ''}`}
                            placeholder="+2123-4567"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="address"
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="123 Main St, City, Country"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.currentPassword ? 'border-red-500' : ''}`}
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                      {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.newPassword ? 'border-red-500' : ''}`}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                      />
                      {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                      <p className="text-xs text-gray-500 mt-1">Leave blank if you don't want to change password</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <BellIcon className="h-8 w-8 text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        name="email"
                        className="form-checkbox h-5 w-5 text-blue-500" 
                        checked={notifications.email}
                        onChange={handleCheckboxChange}
                      />
                      <span className="text-gray-700">Email Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        name="push"
                        className="form-checkbox h-5 w-5 text-blue-500" 
                        checked={notifications.push}
                        onChange={handleCheckboxChange}
                      />
                      <span className="text-gray-700">Push Notifications</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-4">
                      Control how you receive notifications from the system.
                    </p>
                  </div>
                </div>
                
                {/* Session Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-4">Account Info</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Last login:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Account type:</span>
                      <span className="font-medium">{user?.staff_profile.role || 'Staff'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Save Button - Sticky at bottom */}
            <div className="sticky bottom-0 bg-white py-4 mt-8 border-t border-gray-200">
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;