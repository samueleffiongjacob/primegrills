import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: StaffFormData) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  initialData?: StaffFormData;
  mode: 'add' | 'edit';
}

export interface StaffFormData {
  id?: number;
  name: string;
  email: string;
  username: string;
  roles: string;
  status: "Active" | "Inactive";
  image: string;
  shift: string;
  shiftHours: string;
  address: string;
  age: string;
  phone: string;
}

const StaffForm: React.FC<StaffFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<StaffFormData>({
    name: '',
    email: '',
    username: '',
    roles: '',
    status: 'Inactive',
    image: '',
    shift: 'Morning',
    shiftHours: '8 AM - 4 PM',
    address: '',
    age: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setLoading(true);
      try {
        if (onDelete) {
          await onDelete(formData.id);
          onClose();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during deletion');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#171943] bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{mode === 'add' ? 'Add New Staff' : 'Edit Staff'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              >
                <option value="">Select Role</option>
                <option value="Waiter">Waiter</option>
                <option value="Chef">Chef</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Shift</label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Shift Hours</label>
              <select
                name="shiftHours"
                value={formData.shiftHours}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:ring-[#EE7F61] focus:border-[#EE7F61]"
                required
              >
                <option value="8 AM - 4 PM">8 AM - 4 PM</option>
                <option value="4 PM - 12 AM">4 PM - 12 AM</option>
                <option value="12 PM - 8 PM">12 PM - 8 PM</option>
                <option value="12 AM - 8 AM">12 AM - 8 AM</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Delete'}
              </button>
            )}
            
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="bg-[#EE7F61] text-white py-2 px-4 rounded hover:bg-[#e06a4c] focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
                disabled={loading}
              >
                {loading ? 'Saving...' : mode === 'add' ? 'Add Staff' : 'Update Staff'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default StaffForm;