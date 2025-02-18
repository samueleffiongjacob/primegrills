import React, { useState, useEffect } from 'react';

const BankTransferPayment = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(26 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePaymentDetection = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">Transfer to Bank</h2>
      <p className="mb-2">Account Number: <strong>1234567890</strong></p>
      <p className="mb-2">Bank: <strong>Sample Bank</strong></p>
      <p className="mb-4">Time Left: <strong>{formatTime(timer)}</strong></p>
      <button onClick={handlePaymentDetection} className="w-full bg-[#EE7F61] text-white py-2 rounded-md font-semibold">
        {loading ? "Verifying..." : "I have made the transfer"}
      </button>
    </div>
  );
};

export default BankTransferPayment;