import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom Button Component
const CustomButton = ({ 
  title, 
  onClick, 
  type = "button", 
  isLoading = false, 
  disabled = false 
}: { 
  title: string; 
  onClick?: () => void; 
  type?: "button" | "submit" | "reset"; 
  isLoading?: boolean; 
  disabled?: boolean;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`px-6 py-3 bg-[#EE7F61] text-white rounded-xl font-medium text-center
        transition-all duration-200 hover:bg-[#e06a4a] focus:outline-none focus:ring-2 focus:ring-[#EE7F61] focus:ring-offset-2
        ${(isLoading || disabled) ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Submitting...</span>
        </div>
      ) : (
        title
      )}
    </button>
  );
};

const FeedBackPage = () => {
  const {user} = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    visitType: "Dine-in",
    feedback: "",
  });
  const [ratings, setRatings] = useState({
    foodQuality: 0,
    services: 0,
    cleanliness: 0,
    value: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const validateForm = () => {
    // Check if all required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.date || !formData.feedback) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    // Check if all ratings are provided
    const hasAllRatings = Object.values(ratings).every(rating => rating > 0);
    if (!hasAllRatings) {
      toast.error("Please provide ratings for all categories");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
  
    try {
      // Send the data to the backend
      const response = await fetch(`${import.meta.env.VITE_MESSAGE_BACKEND_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: JSON.stringify({
            ...formData,
            ratings,
          }),
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }
  
      const result = await response.json();
      toast.success("Thank you! Your feedback has been submitted successfully.");
      console.log(result);
  
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        date: "",
        visitType: "Dine-in",
        feedback: "",
      });
      setRatings({
        foodQuality: 0,
        services: 0,
        cleanliness: 0,
        value: 0,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rating descriptions for each level
  const ratingDescriptions = {
    1: "Very Poor",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent"
  };

  // Categories with human-readable display names
  const ratingCategories = {
    foodQuality: "Food Quality",
    services: "Service",
    cleanliness: "Cleanliness",
    value: "Value for Money"
  };

  // Get today's date in YYYY-MM-DD format for the date input max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-8">
       <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> 
      
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-5 text-gray-800">Restaurant Feedback</h1>
        <p className="text-center text-gray-600 mb-6">We value your input! Please take a moment to share your dining experience.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
                className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
                className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            />
          </div>

          {/* Date of Visit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date of Visit</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={today}
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            />
          </div>

          {/* Dine-in or Take-out */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Visit Type</label>
            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            >
              <option value="Dine-in">Dine-in</option>
              <option value="Take-out">Take-out</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 pt-2">Rate Your Experience</h2>
          <p className="text-sm text-gray-600 -mt-4">1-Very Poor, 2-Poor, 3-Average, 4-Good, 5-Excellent</p>

          {/* Rating Fields */}
          {Object.entries(ratingCategories).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingChange(key, value)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
                      ratings[key as keyof typeof ratings] >= value
                        ? "bg-[#EE7F61] text-white shadow-md"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    aria-label={`${label}: ${ratingDescriptions[value as keyof typeof ratingDescriptions]}`}
                    title={ratingDescriptions[value as keyof typeof ratingDescriptions]}
                  >
                    {value}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {ratings[key as keyof typeof ratings] > 0 ? 
                    ratingDescriptions[ratings[key as keyof typeof ratings] as keyof typeof ratingDescriptions] : 
                    "Not rated"}
                </span>
              </div>
            </div>
          ))}

          {/* Feedback Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Please share more details about your experience..."
              rows={5}
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <CustomButton 
              title="Submit Feedback" 
              type="submit" 
              isLoading={isSubmitting} 
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedBackPage;