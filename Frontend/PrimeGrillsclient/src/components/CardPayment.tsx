import { useState } from 'react';
import { CreditCard, Calendar, Lock, Shield, CheckCircle2 } from 'lucide-react';

interface CardPaymentFormProps {
  onPaymentSuccess: () => void;
}

interface FormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

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
        [name]: undefined
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

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

  // Determine card type based on first few digits
  const getCardType = () => {
    const number = formData.cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'American Express';
    if (/^6(?:011|5)/.test(number)) return 'Discover';
    return null;
  };

  const cardType = getCardType();

  return (
    <div>
      <form onSubmit={handleConfirm} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
          <div className={`relative transition-all rounded-lg ${focusedField === 'cardholderName' ? 'ring-2 ring-amber-500 ring-opacity-50' : ''}`}>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleChange}
              onFocus={() => handleFocus('cardholderName')}
              onBlur={handleBlur}
              placeholder="Name on card"
              className={`w-full py-3 px-4 pr-10 border ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-all duration-200`}
            />
          </div>
          {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div className={`relative transition-all rounded-lg ${focusedField === 'cardNumber' ? 'ring-2 ring-amber-500 ring-opacity-50' : ''}`}>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              onFocus={() => handleFocus('cardNumber')}
              onBlur={handleBlur}
              placeholder="XXXX XXXX XXXX XXXX"
              className={`w-full pl-10 pr-16 py-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-all duration-200`}
            />
            {cardType && (
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-xs font-medium bg-gray-100 py-1 px-2 rounded text-gray-700">{cardType}</span>
              </div>
            )}
          </div>
          {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <div className={`relative transition-all rounded-lg ${focusedField === 'expiryDate' ? 'ring-2 ring-amber-500 ring-opacity-50' : ''}`}>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                onFocus={() => handleFocus('expiryDate')}
                onBlur={handleBlur}
                placeholder="MM/YY"
                className={`w-full pl-10 pr-3 py-3 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-all duration-200`}
              />
            </div>
            {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center">
                CVV <Lock className="h-3 w-3 ml-1 text-gray-400" />
              </span>
            </label>
            <div className={`relative transition-all rounded-lg ${focusedField === 'cvv' ? 'ring-2 ring-amber-500 ring-opacity-50' : ''}`}>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                onFocus={() => handleFocus('cvv')}
                onBlur={handleBlur}
                placeholder="XXX"
                className={`w-full px-4 py-3 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-all duration-200`}
              />
            </div>
            {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-amber-500 to-[#EE7F61] hover:from-amber-600 hover:to-[#e46a4a]'} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-sm`}
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
      
      <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500">
        <Shield className="h-4 w-4" />
        <p className="text-xs">Your payment information is secured with SSL encryption</p>
      </div>
      
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center space-x-1">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span className="text-xs text-gray-600">PCI DSS Compliant</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span className="text-xs text-gray-600">256-bit Encryption</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span className="text-xs text-gray-600">3D Secure</span>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;