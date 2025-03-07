import { useState } from "react";
import { useAuth } from "../context/authContext";

const Profile = () => {
  const { user } = useAuth();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user?.name || "Rkay",
    address: user?.address || "11 Obashoba, Lagos, Nigeria",
    phoneNumber: user?.phoneNumber || "09022773594",
  });
  
  // Track original data to detect changes
  const [originalData, setOriginalData] = useState({...formData});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (field:string) => {
    setEditingField(field);
    // Store original data when starting to edit
    setOriginalData({...formData});
  };

  const handleSave = () => {
    // Here you can implement the update logic
    setEditingField(null);
    // Update original data to match the new values
    setOriginalData({...formData});
  };

  // Check if the current field has been modified
  const isFieldModified = (field: string) => {
    return editingField === field && formData[field as keyof typeof formData] !== originalData[field as keyof typeof originalData];
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full border mb-3 overflow-hidden hover:scale-105 transition-transform duration-300"
        >
          <img
            src={user?.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
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
              />
            ) : (
              <span className="text-lg">{formData.username}</span>
            )}
          </div>
          <div className="flex items-center">
            {editingField === "username" && (
              <button
                className={`mr-2 px-3 py-1 rounded text-white bg-blue-500 text-sm font-medium transition-opacity duration-300 ${isFieldModified("username") ? "opacity-100" : "opacity-0"}`}
                onClick={handleSave}
              >
                Save
              </button>
            )}
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={() => (editingField === "username" ? handleSave() : handleEdit("username"))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
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
              />
            ) : (
              <span className="text-lg">{formData.address}</span>
            )}
          </div>
          <div className="flex items-center">
            {editingField === "address" && (
              <button
                className={`mr-2 px-3 py-1 rounded text-white bg-blue-500 text-sm font-medium transition-opacity duration-300 ${isFieldModified("address") ? "opacity-100" : "opacity-0"}`}
                onClick={handleSave}
              >
                Save
              </button>
            )}
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={() => (editingField === "address" ? handleSave() : handleEdit("address"))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
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
              />
            ) : (
              <span className="text-lg">{formData.phoneNumber}</span>
            )}
          </div>
          <div className="flex items-center">
            {editingField === "phoneNumber" && (
              <button
                className={`mr-2 px-3 py-1 rounded text-white bg-blue-500 text-sm font-medium transition-opacity duration-300 ${isFieldModified("phoneNumber") ? "opacity-100" : "opacity-0"}`}
                onClick={handleSave}
              >
                Save
              </button>
            )}
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={() => (editingField === "phoneNumber" ? handleSave() : handleEdit("phoneNumber"))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;