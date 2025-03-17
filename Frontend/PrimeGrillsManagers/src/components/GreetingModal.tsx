import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface GreetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const GreetingModal: React.FC<GreetingModalProps> = ({ isOpen, onClose, userName }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-[#171943] to-[#13132f] rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-[#EE7F61] bg-opacity-20 rounded-full">
            <span className="text-[#EE7F61] text-3xl">✓</span>
          </div>
          
          <h2 className="text-2xl text-white font-bold">Welcome back!</h2>
          
          <p className="text-gray-300 text-lg">
            Hello, <span className="text-[#EE7F61] font-medium">{userName}</span>
          </p>
          
          <p className="text-gray-400 text-sm">
            You've successfully logged into PRIME GRILLS management portal
          </p>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#EE7F61] text-white rounded-xl hover:bg-orange-500 transition-colors shadow-md"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GreetingModal;