import { useState } from 'react';
import { CreditCard, Calendar, Lock } from 'lucide-react';

interface BankTransferPaymentProps {
  onPaymentSuccess: () => void; // Define the type for the onPaymentSuccess prop
}
// interface formData {
//   cardNumber: string;
//   expiryDate: string;
//   cvv: string;
// }

interface FormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}


const CardPaymentForm: React.FC<BankTransferPaymentProps> = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Apply specific formatting based on field type
    let formattedValue = value;
    if (name === 'cardNumber') {
      // Remove non-digits and format with spaces every 4 digits
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    } else if (name === 'expiryDate') {
      // Format as MM/YY
      formattedValue = value.replace(/\D/g, '')
        .replace(/(\d{2})(?=\d)/, '$1/')
        .slice(0, 5);
    } else if (name === 'cvv') {
      // Only allow digits and max 4 characters
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.cardNumber.replace(/\s/g, '').trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Enter a valid card number';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!formData.expiryDate.includes('/') || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Enter a valid expiry date (MM/YY)';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'Enter a valid CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onPaymentSuccess();
      }, 2000);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Information</h2>
      <form onSubmit={handleConfirm}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX XXXX"
              className={`w-full pl-10 pr-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
            />
          </div>
          {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className={`w-full pl-10 pr-3 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
              />
            </div>
            {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="XXX"
                className={`w-full pl-10 pr-3 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition`}
              />
            </div>
            {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-amber-400' : 'bg-[#EE7F61] hover:bg-[#e46a4a]'} text-white py-3 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            'Complete Payment'
          )}
        </button>
      </form>
      
      <div className="mt-4 flex items-center justify-center">
        <p className="text-xs text-gray-500">Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default CardPaymentForm;