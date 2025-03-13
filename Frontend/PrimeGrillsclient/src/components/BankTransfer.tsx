import { useState, useEffect } from 'react';
import { ClipboardCopy, AlertCircle, Building2, Timer, ArrowRightCircle } from 'lucide-react';

interface BankTransferPaymentProps {
  onPaymentSuccess: () => void;
}

const BankTransferPayment: React.FC<BankTransferPaymentProps> = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(26 * 60);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(field);
        setTimeout(() => setCopySuccess(null), 2000);
      },
      () => {
        setCopySuccess('Error copying');
      }
    );
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Timer banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 px-4 py-3 flex items-center mb-6">
        <Timer className="w-5 h-5 text-amber-500 mr-2" />
        <div>
          <p className="text-sm text-amber-700">Please complete your transfer within</p>
          <p className="font-bold text-amber-900">{formatTime(timer)}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-500 font-medium">Bank Name</p>
            <div className="flex items-center">
              <Building2 className="w-4 h-4 text-gray-400 mr-1" />
              <p className="text-gray-700 font-medium">First Bank</p>
            </div>
          </div>
        </div>
        
        {/* Account info */}
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <div className="flex">
              <input 
                type="text" 
                readOnly 
                value="1234567890"
                className="bg-gray-50 rounded-lg border border-gray-300 py-2 px-3 text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-amber-500" 
              />
              <button 
                onClick={() => copyToClipboard('1234567890', 'account')}
                className="absolute right-2 top-8 text-gray-500 hover:text-amber-600"
              >
                <ClipboardCopy className="w-5 h-5" />
              </button>
            </div>
            {copySuccess === 'account' && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
            <div className="flex">
              <input 
                type="text" 
                readOnly 
                value="Company Name Ltd."
                className="bg-gray-50 rounded-lg border border-gray-300 py-2 px-3 text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-amber-500" 
              />
              <button 
                onClick={() => copyToClipboard('Company Name Ltd.', 'holder')}
                className="absolute right-2 top-8 text-gray-500 hover:text-amber-600"
              >
                <ClipboardCopy className="w-5 h-5" />
              </button>
            </div>
            {copySuccess === 'holder' && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <div className="flex">
              <input 
                type="text" 
                readOnly 
                value="PAY-123456"
                className="bg-gray-50 rounded-lg border border-gray-300 py-2 px-3 text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-amber-500" 
              />
              <button 
                onClick={() => copyToClipboard('PAY-123456', 'reference')}
                className="absolute right-2 top-8 text-gray-500 hover:text-amber-600"
              >
                <ClipboardCopy className="w-5 h-5" />
              </button>
            </div>
            {copySuccess === 'reference' && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
          </div>
        </div>
        
        {/* Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 flex items-start rounded-r-sm">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">Please include the reference number in your bank transfer to ensure your payment is processed correctly.</p>
        </div>
        
        <button 
          onClick={handlePaymentDetection} 
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-amber-500 to-[#EE7F61] hover:from-amber-600 hover:to-[#e46a4a]'} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-sm`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying Payment...
            </>
          ) : (
            <>
              I've Completed the Transfer
              <ArrowRightCircle className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BankTransferPayment;