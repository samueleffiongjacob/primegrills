import { useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { Camera, X, Check, Eye, EyeOff } from "lucide-react";
import profile from '../assets/images/ladyimage.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from "../context/authContext";

const Profile = () => {
  const { user, setUser  } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    address: user?.address || "",
    phoneNumber: user?.phone || "",
    image: user?.profileImage || profile,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState({...formData});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSaveImage = async () => {
    const fileInput = fileInputRef.current;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      await uploadProfileImage(fileInput.files[0]);
      setImagePreview(null); // Clear the preview after upload
    }
  };

  const uploadProfileImage = async (file: File) => {
    const toastId = toast.loading("Updating profile image");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/upload-image/`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (response.ok) {
        toast.update(toastId, { 
          render: "Profile image updated successfully", 
          type: "success", 
          isLoading: false,
          autoClose: 3000
        });
        const data = await response.json();
        console.log(data)
        // Update the user context with the new profile image URL
        if (user) {
          setUser({
            ...user,
            profileImage: data.imageUrl,
          });
        }
      } else {
        toast.update(toastId, { 
          render: "Failed to update profile image", 
          type: "error", 
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.update(toastId, { 
        render: "An error occurred while uploading image", 
        type: "error", 
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = async (fieldName: string, value: string) => {
    const toastId = toast.loading(`Updating ${fieldName}`);
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
        toast.update(toastId, { 
          render: `${fieldName} updated successfully`, 
          type: "success", 
          isLoading: false,
          autoClose: 3000
        });
        setUser(data);
      } else {
        toast.update(toastId, { 
          render: data.error || `Failed to update ${fieldName}`, 
          type: "error", 
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast.update(toastId, { 
        render: `An error occurred while updating ${fieldName}`, 
        type: "error", 
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    const toastId = toast.loading("Updating password");
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/staffs/profile/update-password/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.update(toastId, { 
          render: "Password updated successfully", 
          type: "success", 
          isLoading: false,
          autoClose: 3000
        });
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        toast.update(toastId, { 
          render: data.error || "Failed to update password", 
          type: "error", 
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.update(toastId, { 
        render: "An error occurred while updating password", 
        type: "error", 
        isLoading: false,
        autoClose: 3000
      });
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
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    if (editingField === "image") {
      await handleSaveImage();
    } else if (editingField === "password") {
      await updatePassword();
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
    } else if (editingField === "password") {
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
    
    setEditingField(null);
  };

  const isFieldModified = (field: string) => {
    if (field === "password") {
      return formData.currentPassword && formData.newPassword && formData.confirmPassword;
    }
    return editingField === field && formData[field as keyof typeof formData] !== originalData[field as keyof typeof originalData];
  };

  const renderField = (label: string, fieldName: string, value: string) => (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-sm">
      <div className="flex flex-col flex-grow">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        {editingField === fieldName ? (
          <input
            type="text"
            name={fieldName}
            value={value}
            onChange={handleChange}
            className={`w-full bg-white border-b border-gray-300 focus:outline-none focus:border-blue-500 py-2 px-1 mt-1 rounded ${
              fieldName === "name" ? "cursor-not-allowed" : ""
            }`}
            autoFocus
            disabled={isLoading || fieldName === "name"} // Disable input for the "name" field
            readOnly={fieldName === "name"} // Make the "name" field read-only
          />
        ) : (
          <span
            className={`text-gray-800 font-medium py-2 ${
              fieldName === "name" ? "cursor-not-allowed" : ""
            }`}
          >
            {value || "Not provided"}
          </span>
        )}
      </div>
      <div className="flex items-center">
        {editingField === fieldName ? (
          fieldName !== "name" && ( // Hide edit buttons for the "name" field
            <div className="flex gap-2">
              <button
                className={`p-2 rounded-full ${
                  isFieldModified(fieldName) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
                onClick={handleSave}
                disabled={!isFieldModified(fieldName) || isLoading}
              >
                <Check size={16} />
              </button>
              <button
                className="p-2 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                <X size={16} />
              </button>
            </div>
          )
        ) : (
          fieldName !== "name" && ( // Hide edit button for the "name" field
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => handleEdit(fieldName)}
              disabled={isLoading || editingField !== null}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>
            </button>
          )
        )}
      </div>
    </div>
  );
  
  const renderPasswordField = () => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Password</span>
        <div className="flex items-center">
          {editingField === "password" ? (
            <div className="flex gap-2">
              <button
                className={`p-2 rounded-full ${isFieldModified("password") ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"}`}
                onClick={handleSave}
                disabled={!isFieldModified("password") || isLoading || formData.newPassword !== formData.confirmPassword}
              >
                <Check size={16} />
              </button>
              <button
                className="p-2 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => handleEdit("password")}
              disabled={isLoading || editingField !== null}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {editingField === "password" ? (
        <div className="mt-3 space-y-3">
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button 
              type="button"
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setPasswordVisible(!passwordVisible)}
              >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button 
              type="button"
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button 
              type="button"
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      ) : (
        <span className="text-gray-800 font-medium py-2">********</span>
      )}
    </div>
    );

    return (
    <div className="max-w-4xl mx-auto max-h-[86vh] overflow-y-auto scrollbar-hide p-6">
      <ToastContainer />
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg">
          <img
            src={imagePreview || user?.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <button
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={triggerFileInput}
            disabled={isLoading || editingField !== null}
          >
            <Camera size={18} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
          {imagePreview && (
            <button
              className="absolute bottom-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              onClick={handleSaveImage}
              disabled={isLoading}
            >
              <Check size={18} />
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold mt-4">{formData.name}</h1>
        <p className="text-gray-500">{formData.username}</p>
      </div>
      <div className="space-y-6 max-h-[90vh]">
        {renderField("Name", "name", formData.name)}
        {renderField("Username", "username", formData.username)}
        {renderField("Address", "address", formData.address)}
        {renderField("Phone Number", "phoneNumber", formData.phoneNumber)}
        {renderPasswordField()}
    </div>
</div>
);
};

export default Profile;