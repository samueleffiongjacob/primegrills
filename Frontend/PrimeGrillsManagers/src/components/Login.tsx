import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/authContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unauthorizedModal, setUnauthorizedModal] = useState(false);
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await login(email, password);
      toast.success('Login Success');
      onClose();
    } catch (error: any) {
      console.error("Login failed:", error);
      
      if (error.message === "Invalid email") {
        setUnauthorizedModal(true);
      } else if (error.message === "Incorrect password") {
        toast.error("Incorrect password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-opacity-100 backdrop-blur-xs flex items-center justify-center z-50">
        <div className="bg-[#171943] rounded-2xl p-6 w-full max-w-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer text-gray-100 hover:text-[#EE7F61]"
          >
            ✕
          </button>

          <div className="space-y-6">
            <h1 className="text-2xl text-[#EE7F61] font-semibold text-center">Log In</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username"
                  className="w-full pl-12 text-white pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3 text-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#EE7F61] text-white rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {unauthorizedModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl text-center shadow-2xl transform transition-all">
            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-red-100 rounded-full mb-6">
              <span className="text-red-500 text-6xl font-bold">×</span>
            </div>
            
            <h2 className="text-2xl text-red-600 font-bold mb-4">Access Denied</h2>
            
            <p className="text-gray-700 text-lg mb-3">
              Sorry, but this email does not belong to a manager at PRIME GRILLS.
            </p>
            
            <p className="text-gray-600 mb-8">
              Please visit the consultant's office for further assistance with manager details and instructions.
            </p>
            
            <button
              onClick={() => setUnauthorizedModal(false)}
              className="w-full max-w-xs py-3 bg-[#EE7F61] text-white text-lg font-medium rounded-xl hover:bg-orange-500 transition-colors duration-300 shadow-md"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
