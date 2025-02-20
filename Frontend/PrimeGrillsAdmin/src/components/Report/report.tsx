import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const ReportIssue: React.FC = () => {
  const [formData, setFormData] = useState({
    transaction: "",
    reason: "",
    description: "",
    termsAccepted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("Please accept the terms before submitting.");
      return;
    }
    console.log("Form submitted:", formData);
    setFormData({
      transaction: "",
      reason: "",
      description: "",
      termsAccepted: false,
    });
  };

  const isFormValid = formData.transaction && formData.reason && formData.termsAccepted;


  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-[#EE7F61] mb-6">Report an Issue</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {/* Transaction Selection */}
          <div className="mb-4">
            <label htmlFor="transaction" className="block text-gray-700 font-medium mb-2">
              Please select the transaction
            </label>
            <select
              id="transaction"
              name="transaction"
              value={formData.transaction}
              onChange={handleInputChange}
              className="w-full border border-[#EE7F61] rounded-lg p-2"
              required
            >
              <option value="" disabled>
                -- Select Transaction --
              </option>
              <option value="Order #12345">Order #12345</option>
              <option value="Order #12346">Order #12346</option>
              <option value="Order #12347">Order #12347</option>
            </select>
          </div>

          {/* Reason Selection */}
          <div className="mb-4">
            <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
              Please select the reason for the complaint
            </label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full border border-[#EE7F61] rounded-lg p-2"
              required
            >
              <option value="" disabled>
                -- Please Choose --
              </option>
              <option value="Wrong item delivered">Wrong item delivered</option>
              <option value="Delay in delivery">Delay in delivery</option>
              <option value="Poor packaging">Poor packaging</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-[#EE7F61] rounded-lg p-2"
              placeholder="Explain ..."
              rows={4}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#EE7F61] border-[#ee7f61] rounded"
            />
            <label htmlFor="termsAccepted" className="ml-2 text-gray-700">
              I have read and agree to the{" "}
              <Link to="/complaintpolicy" className="text-[#EE7F61] underline hover:text-[#ee7a7a]">
                complaint policy
              </Link>
              .
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <Button title="Submit" disabled={!isFormValid} />
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
