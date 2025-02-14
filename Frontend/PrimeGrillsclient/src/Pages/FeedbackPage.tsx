import React, { useState } from "react";
import Button from "../components/Navbar/button";

const FeedBackPage = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Feedback Submitted!\n${JSON.stringify({ ...formData, ratings }, null, 2)}`);
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
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-8">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-5 text-gray-800">Feedback Form</h1>
        <p className="text-center text-gray-600 mb-6">We value your input! Please take a moment to share your experience.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            />
          </div>

          {/* Date of Visit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Visit</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            />
          </div>

          {/* Dine-in or Take-out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Was it dine-in or take-out?</label>
            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            >
              <option value="Dine-in">Dine-in</option>
              <option value="Take-out">Take-out</option>
            </select>
          </div>

          {/* Rating Fields */}
          {["foodQuality", "services", "cleanliness", "value"].map((category) => (
            <div key={category}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingChange(category, value)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                      ratings[category as keyof typeof ratings] >= value
                        ? "bg-[#EE7F61] text-white shadow-md"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Feedback Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Write your feedback here..."
              rows={5}
              required
              className="w-full p-3 border border-[#EE7F61] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE7F61]"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button title="Submit Feedback" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedBackPage;
