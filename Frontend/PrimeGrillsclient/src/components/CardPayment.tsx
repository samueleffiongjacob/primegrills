import React, { useState } from 'react';

const CardPaymentForm = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">Enter Card Details</h2>
      <input type="text" placeholder="Card Number" className="w-full p-2 border rounded-md mb-2" />
      <input type="text" placeholder="Expiry Date" className="w-full p-2 border rounded-md mb-2" />
      <input type="text" placeholder="CVV" className="w-full p-2 border rounded-md mb-2" />
      <button onClick={handleConfirm} className="w-full bg-[#EE7F61] text-white py-2 rounded-md font-semibold">
        {loading ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  );
};

export default CardPaymentForm;