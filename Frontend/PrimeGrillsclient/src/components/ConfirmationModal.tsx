import React from 'react';

interface AddressDetails {
  street: string;
  city: string;
  phoneNumber: string;
}

interface OrderDetails {
  trackingId: string;
  amount: number;
  deliveryMethod: 'delivery' | 'pickup';
  address?: AddressDetails; // Optional for 'pickup'
}

interface ConfirmationModalProps {
  isOpen: boolean;
  orderDetails: OrderDetails;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, orderDetails, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-gray-200 p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-3">Order Confirmed</h2>
        <p><strong>Order ID:</strong> {orderDetails.trackingId}</p>
        <p><strong>Total:</strong> ₦{orderDetails.amount.toLocaleString()}</p>
        {orderDetails.deliveryMethod === 'delivery' && orderDetails.address ? (
          <>
            <p><strong>Delivery Address:</strong> {orderDetails.address.street}, {orderDetails.address.city}</p>
            <p><strong>Contact:</strong> {orderDetails.address.phoneNumber}</p>
          </>
        ) : (
          <>
            <p><strong>Pickup Location:</strong> Sample Pickup Center</p>
            <p><strong>Contact:</strong> 08098765432</p>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-[#EE7F61] text-white py-2 rounded-md font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
