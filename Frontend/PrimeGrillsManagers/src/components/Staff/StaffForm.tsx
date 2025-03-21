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
  email?: string;
  username?: string;
  password?: string;
  phone: string;
  address: string;
  staff_profile: {
    role: string;
    status?: string;
    shift: string;
    shiftHours: string;
    gender: string;
    age: string;
  };
}

// Form field configuration for easy maintenance and validation
const FORM_CONFIG = {
  shifts: [
    { value: 'Morning', hours: '8 AM - 4 PM' },
    { value: 'Afternoon', hours: '12 PM - 8 PM' },
    { value: 'Evening', hours: '4 PM - 12 AM' },
    { value: 'Night', hours: '12 AM - 8 AM' }
  ],
  roles: ['Waiter', 'Chef', 'Manager', 'Admin', 'Pos', 'kitchen', 'Accountant'],
  genders: ['Male', 'Female', 'Other'],
  // statuses: ['Active', 'Inactive'] as const
};

const StaffForm: React.FC<StaffFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  mode
}) => {
  const initialFormState: StaffFormData = {
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    address: '',
    staff_profile: {
      role: '',
      status: 'Inactive',
      shift: 'Morning',
      shiftHours: '8 AM - 4 PM',
      gender: '',
      age: '',
    },
  };

  const [formData, setFormData] = useState<StaffFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      // If initialData has a phone number, ensure it's processed correctly
      const processedData = { ...initialData };
      if (processedData.phone && !processedData.phone.startsWith('234')) {
        // Strip any existing prefix if present and add 234
        const cleanPhone = processedData.phone.replace(/^\+?[0-9]+/, '');
        processedData.phone = cleanPhone.length > 0 ? cleanPhone : processedData.phone;
      }
      setFormData(processedData);
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
    setSubmitError(null);
    setFormSubmitted(false);
  }, [initialData, isOpen]);

  // Auto-update shiftHours when shift changes
  useEffect(() => {
    const selectedShift = FORM_CONFIG.shifts.find(s => s.value === formData.staff_profile.shift);
    if (selectedShift && formData.staff_profile.shiftHours !== selectedShift.hours) {
      setFormData(prev => ({
        ...prev,
        staff_profile: {
          ...prev.staff_profile,
          shiftHours: selectedShift.hours
        }
      }));
    }
  }, [formData.staff_profile.shift]);

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;

    if (name === 'phone') {
      // Validate only the 10 digits (without the 234 prefix)
      const phoneDigits = value.replace(/^234/, '');
      if (!/^\d{10}$/.test(phoneDigits)) {
        return 'Please enter a valid 10-digit phone number';
      }
    }

    if (name === 'age') {
      const age = parseInt(value);
      if (isNaN(age)) return 'Age must be a number';
      if (age < 18 || age > 80) return 'Age must be between 18 and 80';
    }

    if (name === 'email' && value.trim() !== '') {
      // Only validate email if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone field
    if (name === 'phone') {
      let processedValue = value;
      
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // If the user is typing a new number, ensure it starts with 234
      if (!digitsOnly.startsWith('234')) {
        // User is typing just the 10 digits, so we add the prefix
        processedValue = '234' + digitsOnly.slice(0, 10);
      } else {
        // User entered something that already has 234, keep it as is but limit length
        processedValue = digitsOnly.slice(0, 13); // 234 + 10 digits
      }
      
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    } 
    // Handle other fields normally
    else if (name.startsWith('staff_profile.')) {
      const field = name.split('.')[1]; // Extract the nested field name
      setFormData(prev => ({
        ...prev,
        staff_profile: {
          ...prev.staff_profile,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Only show errors after form has been submitted once
    if (formSubmitted) {
      // Validate and update the specific field error
      const fieldName = name.includes('.') ? name.split('.')[1] : name;
      const errorMessage = validateField(fieldName, value);
      
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate top-level fields
    ['name', 'phone', 'address'].forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) newErrors[field] = error;
    });

    // Validate email, username, password only in add mode
    if (mode === 'add') {
      ['email', 'username', 'password'].forEach(field => {
        const value = formData[field as keyof typeof formData] as string;
        if (field === 'email' && value) {
          const error = validateField(field, value);
          if (error) newErrors[field] = error;
        }
        if (['username', 'password'].includes(field)) {
          const error = validateField(field, value);
          if (error) newErrors[field] = error;
        }
      });
    }

    // Validate staff_profile fields
    ['role', 'gender', 'age'].forEach(field => {
      const error = validateField(field, formData.staff_profile[field as keyof typeof formData.staff_profile] as string);
      if (error) newErrors[`staff_profile.${field}`] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      // Structure the data to match the backend's expectations
      const structuredData = {
        ...formData,
        is_staff: true, // Ensure this is set for staff users
      };

      // Remove username, password, and email in edit mode
      if (mode === 'edit') {
        delete structuredData.username;
        delete structuredData.password;
        delete structuredData.email;
      }

      await onSubmit(structuredData);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    };
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
        setSubmitError(err instanceof Error ? err.message : 'An error occurred during deletion');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return '';
    
    // Format as 234-XXXXXXXXXX
    if (phone.startsWith('234') && phone.length >= 13) {
      return `234-${phone.slice(3)}`;
    }
    return phone;
  };

  const FormField = ({ 
    label, 
    name, 
    type = 'text', 
    options = [], 
    required = true 
  }: { 
    label: string; 
    name: string; 
    type?: string; 
    options?: string[]; 
    required?: boolean;
  }) => {
    const fieldName = name as keyof typeof formData | `staff_profile.${keyof typeof formData.staff_profile}`;
    let value = name.startsWith('staff_profile.') 
      ? formData.staff_profile[name.split('.')[1] as keyof typeof formData.staff_profile]
      : formData[name as keyof typeof formData];
    
    // Format phone display
    if (name === 'phone') {
      value = formatPhoneDisplay(value as string);
    }

    const error = errors[fieldName];

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {type === 'select' ? (
          <select
            name={fieldName}
            value={value as string}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-[#EE7F61] focus:border-[#EE7F61]`}
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={fieldName}
            value={value as string}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-[#EE7F61] focus:border-[#EE7F61]`}
            required={required}
            placeholder={name === 'phone' ? 'Enter 10 digits' : ''}
          />
        )}

        {name === 'phone' && (
          <p className="text-xs text-gray-500 mt-1">Enter 10 digits (234 prefix will be added automatically)</p>
        )}

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };

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
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" name="name" />
            {mode === 'add' && <FormField label="Email" name="email" type="email" />}
            {mode === 'add' && <FormField label="Username" name="username" />}
            {mode === 'add' && <FormField label="Password" name="password" type="password" />}
            <FormField label="Gender" name="staff_profile.gender" type="select" options={FORM_CONFIG.genders} />
            <FormField label="Role" name="staff_profile.role" type="select" options={FORM_CONFIG.roles} />
            <FormField label="Phone" name="phone" type="tel" />
            <FormField label="Age" name="staff_profile.age" type="number" />
            <FormField label="Address" name="address" />
            <FormField 
              label="Shift" 
              name="staff_profile.shift" 
              type="select" 
              options={FORM_CONFIG.shifts.map(s => s.value)} 
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Shift Hours</label>
              <input
                type="text"
                name="staff_profile.shiftHours"
                value={formData.staff_profile.shiftHours}
                readOnly
                className="w-full p-2 border rounded border-gray-300 bg-gray-100"
              />
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