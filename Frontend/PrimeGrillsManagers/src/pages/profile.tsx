import { useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { Camera } from "lucide-react";
import profile from '../assets/images/ladyimage.jpg';

const Profile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    address: user?.address || "",
    phoneNumber: user?.phone || "",
    image: user?.profileImage || profile
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState({...formData});
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{success: boolean, message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const uploadProfileImage = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/update_image/`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUpdateStatus({ success: true, message: "Profile image updated successfully" });
        setUser(data.user)
      } else {
        setUpdateStatus({ success: false, message: data.message || "Failed to update profile image" });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUpdateStatus({ success: false, message: "An error occurred while uploading image" });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = async (fieldName: string, value: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/staffs/profile/update/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [fieldName]: value })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUpdateStatus({ success: true, message: `${fieldName} updated successfully` });
        setUser(data.user)
      } else {
        setUpdateStatus({ success: false, message: data.message || `Failed to update ${fieldName}` });
      }
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      setUpdateStatus({ success: false, message: `An error occurred while updating ${fieldName}` });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    setOriginalData({...formData});
    setUpdateStatus(null);
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    if (editingField === "image") {
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        await uploadProfileImage(fileInput.files[0]);
      }
      setImagePreview(null);
    } else {
      // For other fields (username, address, phoneNumber)
      const fieldValue = formData[editingField as keyof typeof formData];
      if (typeof fieldValue === 'string') {
        await updateProfileData(editingField, fieldValue);
      }
    }
    
    setEditingField(null);
    setOriginalData({...formData});
  };

  const handleCancelEdit = () => {
    setFormData(prev => ({ 
      ...prev, 
      [editingField as keyof typeof formData]: originalData[editingField as keyof typeof originalData] 
    }));
    
    if (editingField === "image") {
      setImagePreview(null);
    }
    
    setEditingField(null);
    setUpdateStatus(null);
  };

  const isFieldModified = (field: string) => {
    return editingField === field && formData[field as keyof typeof formData] !== originalData[field as keyof typeof originalData];
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      
      {updateStatus && (
        <div className={`p-3 mb-4 rounded ${updateStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {updateStatus.message}
        </div>
      )}
      
      <div className="flex flex-col items-center relative">
        <div className="w-24 h-24 rounded-full border mb-3 overflow-hidden group relative">
          <img
            src={imagePreview || formData.image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          {editingField !== "image" && (
            <div 
              className="absolute inset-0 hover:text-white opacity-0 hover:opacity-100 hover:backdrop-blur-xs bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 cursor-pointer"
              onClick={() => handleEdit("image")}
            >
              <Camera className=""/>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {editingField === "image" && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={triggerFileInput}
              className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Choose File
            </button>
            <button
              onClick={handleSave}
              className={`px-3 py-1 rounded text-white bg-blue-500 text-sm font-medium transition-all duration-300 ${
                isFieldModified("image") ? "opacity-100" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isFieldModified("image") || isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      
      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center border p-3 rounded-lg">
          <div className="flex flex-col flex-grow">
            <span className="text-sm text-gray-500">Username</span>
            {editingField === "username" ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                autoFocus
                disabled={isLoading}
              />
            ) : (
              <span className="text-lg">{formData.username}</span>
            )}
          </div>
          <div className="flex items-center">
            {editingField === "username" && (
              <>
                <button
                  className={`mr-2 px-3 py-1 rounded text-white bg-blue-500 text-sm font-medium transition-opacity duration-300 ${
                    isFieldModified("username") ? "opacity-100" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleSave}
                  disabled={!isFieldModified("username") || isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="mr-2 px-3 py-1 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            )}
            {editingField !== "username" && (
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
                onClick={() => handleEdit("username")}
                disabled={isLoading || editingField !== null}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center border p-3 rounded-lg">
          <div className="flex flex-col flex-grow">
            <span className="text-sm text-gray-500">Address</span>
            {editingField === "address" ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                autoFocus
                disabled={isLoading}
              />
            ) : (
              <span className="text-lg">{formData.address}</span>
            )}
          </div>
          <div className="flex items-center">
            {editingField === "address" && (
              <>
                <button
                  className={`mr-2 px-3 py-1 rounded text-white bg-blue-500 text-sm font-medium transition-opacity duration-300 ${
                    isFieldModified("address") ? "opacity-100" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleSave}
                  disabled={!isFieldModified("address") || isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="mr-2 px-3 py-1 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            )}
            {editingField !== "address" && (
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
                onClick={() => handleEdit("address")}
                disabled={isLoading || editingField !== null}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center border p-3 rounded-lg">
          <div className="flex flex-col flex-grow">
            <span className="text-sm text-gray-500">Phone Number</span>
            {editingField === "phoneNumber" ? (
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                autoFocus
                disabled={isLoading}
              />
            ) : (
              <span className="text-lg">{formData.phoneNumber}</span>
            )}
          </div>
          <div className="flex items-center">
            {editingField === "phoneNumber" && (
              <>
                <button
                  className={`mr-2 px-3 py-1 rounded text-white bg-blue-500 text-sm font-medium transition-opacity duration-300 ${
                    isFieldModified("phoneNumber") ? "opacity-100" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleSave}
                  disabled={!isFieldModified("phoneNumber") || isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="mr-2 px-3 py-1 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </>
            )}
            {editingField !== "phoneNumber" && (
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
                onClick={() => handleEdit("phoneNumber")}
                disabled={isLoading || editingField !== null}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;