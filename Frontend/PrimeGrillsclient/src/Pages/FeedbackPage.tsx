// import React, { useState } from "react";
// import { FaStar } from "react-icons/fa";
// import Button from "../components/Navbar/button";

// const FeedBackPage = () => {
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     feedback: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert(`Feedback Submitted!\nName: ${formData.name}\nEmail: ${formData.email}\nRating: ${rating}\nFeedback: ${formData.feedback}`);
//     setFormData({ name: "", email: "", feedback: "" });
//     setRating(0);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
//         <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Feedback Form</h1>
//         <p className="text-center text-gray-600 mb-6">
//           We appreciate your feedback! Please fill out the form below.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Enter your name"
//               required
//               className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Email Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Enter your email"
//               required
//               className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Rating */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Rate Us</label>
//             <div className="flex items-center">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <FaStar
//                   key={star}
//                   size={30}
//                   onClick={() => setRating(star)}
//                   onMouseEnter={() => setHoverRating(star)}
//                   onMouseLeave={() => setHoverRating(0)}
//                   className={`cursor-pointer transition-colors ${
//                     (hoverRating || rating) >= star ? "text-[#EE7F61]" : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Feedback Textarea */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
//             <textarea
//               name="feedback"
//               value={formData.feedback}
//               onChange={handleInputChange}
//               placeholder="Write your feedback here..."
//               rows={5}
//               required
//               className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//             ></textarea>
//           </div>

          
//           </form>
//       </div>
//     </div>
//   );
// };

// export default FeedBackPage;

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Feedback Form</h1>
        <p className="text-center text-gray-600 mb-6">We value your input! Please take a moment to share your experience.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                            <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            required
                            className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        {/* Last Name */}
                        <div>
                            <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            required
                            className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Date of Visit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What day did you eat?</label>
                    <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Dine-in or Take-out */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Was it dine-in or take-out?</label>
                    <select
                    name="visitType"
                    value={formData.visitType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                    <option value="Dine-in">Dine-in</option>
                    <option value="Take-out">Take-out</option>
                    </select>
                </div>

                {/* Rating Fields */}
                {["foodQuality", "services", "cleanliness", "value"].map((category) => (
                    <div key={category}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingChange(category, value)}
                            className={`w-8 h-8 rounded-full ${ratings[category as keyof typeof ratings] >= value ? "bg-[#EE7F61]" : "bg-gray-300"}`}
                        >
                            {value}
                        </button>
                        ))}
                    </div>
                </div>
                ))}

                {/* Feedback Textarea */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
                    <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    placeholder="Write your feedback here..."
                    rows={5}
                    required
                    className="w-full p-3 border border-[#EE7F61] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="justify-self-center">
                    <Button title="Submit FeedBack"  />
                </div>
            </form>
      </div>
    </div>
  );
};

export default FeedBackPage;

