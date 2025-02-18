import React, { useState } from 'react';
import { useCart } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';
import CardPaymentForm from '../../components/CardPayment';
import BankTransferPayment from '../../components/BankTransfer';
import ConfirmationModal from '../../components/ConfirmationModal';
import ThankYouPage from '../../components/ThankYouPage';

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  phoneNumber: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [discountCode, setDiscountCode] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const [savedAddress, setSavedAddress] = useState<DeliveryAddress>({
    street: '123 Sample Street',
    city: 'Lagos',
    state: 'Lagos State',
    phoneNumber: '08012345678'
  });

  const [newAddress, setNewAddress] = useState<DeliveryAddress>({
    street: '',
    city: '',
    state: '',
    phoneNumber: ''
  });

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 1000 : 0;
  const finalAmount = totalAmount + deliveryFee;

  const orderDetails = {
    trackingId: `TRK${Math.floor(Math.random() * 100000)}`,
    amount: finalAmount,
    deliveryMethod,
    address: deliveryMethod === 'delivery' ? savedAddress : null,
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveNewAddress = () => {
    setSavedAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({
      street: '',
      city: '',
      state: '',
      phoneNumber: ''
    });
  };

  const handlePayment = () => {
    console.log('Processing payment with:', {
      amount: finalAmount,
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? savedAddress : null,
      paymentMethod,
      discountCode
    });
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setShowThankYou(true);
  };
  
  const handleReturnHome = () => {
    setShowThankYou(false);
    navigate('/'); // Or wherever your home page is
  };

    // Check if we should show the thank you page
    if (showThankYou) {
      return (
        <ThankYouPage
          customerName={orderDetails?.customerName || 'Dear Customer'}
          onGoHome={handleReturnHome}
        />
      );
    }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {/* Cart Preview */}
      <div className="mb-6 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">Cart Summary</h2>
        {cartItems.length > 0 ? (
          <ul className="space-y-2">
            {cartItems.slice(0, 3).map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
            {cartItems.length > 3 && <p className="text-sm text-gray-600">+ {cartItems.length - 3} more items</p>}
          </ul>
        ) : (
          <p className="text-gray-600">Your cart is empty.</p>
        )}
        <button
          onClick={() => navigate('/cart')}
          className="mt-3 text-[#EE7F61] text-sm font-medium hover:underline"
        >
          Modify Cart
        </button>
      </div>

      {/* Delivery Method */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Delivery Method</h2>
        <div className="flex gap-4">
          <button 
            className={`px-4 py-2 rounded-md ${deliveryMethod === 'pickup' ? 'focus:ring-0 bg-[#EE7F61] text-white' : 'bg-gray-200'}`} 
            onClick={() => setDeliveryMethod('pickup')}
          >
            Pickup
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${deliveryMethod === 'delivery' ? 'bg-[#EE7F61] text-white' : 'bg-gray-200'}`} 
            onClick={() => setDeliveryMethod('delivery')}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Delivery Address Section */}
      {deliveryMethod === 'delivery' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            <button 
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-[#EE7F61] text-sm hover:underline"
            >
              {showAddressForm ? 'Cancel' : 'Change Address'}
            </button>
          </div>

          {!showAddressForm ? (
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="font-medium">{savedAddress.street}</p>
              <p>{savedAddress.city}, {savedAddress.state}</p>
              <p className="text-gray-600">Phone: {savedAddress.phoneNumber}</p>
            </div>
          ) : (
            <div className="space-y-4 p-4 border rounded-md">
              <div>
                <label className="block text-sm mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={newAddress.phoneNumber}
                  onChange={handleAddressChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleSaveNewAddress}
                className="w-full bg-[#EE7F61] text-white py-2 rounded-md font-semibold hover:opacity-90"
              >
                Save New Address
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
        <select 
          className="w-full p-2 border rounded-md" 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="card">Pay with Card</option>
          <option value="transfer">Pay with Bank Transfer</option>
        </select>
      </div>

      {/* Discount Code */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Enter Discount Code</h2>
        <input 
          type="text" 
          className="w-full p-2 border rounded-md" 
          placeholder="Enter code" 
          value={discountCode} 
          onChange={(e) => setDiscountCode(e.target.value)} 
        />
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
          {deliveryMethod === 'delivery' && (
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₦{finalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Confirm Order Button */}
      {/* <button 
        onClick={handlePayment} 
        className="w-full bg-[#EE7F61] text-white py-3 rounded-md font-semibold hover:opacity-90"
      >
        Confirm Order
      </button> */}
      {paymentMethod === 'card' ? <CardPaymentForm onPaymentSuccess={() => setShowConfirmation(true)} /> : <BankTransferPayment onPaymentSuccess={() => setShowConfirmation(true)} />}
      <ConfirmationModal isOpen={showConfirmation} orderDetails={orderDetails} onClose={handleCloseConfirmation} />
    </div>
  );
};

export default CheckoutPage;