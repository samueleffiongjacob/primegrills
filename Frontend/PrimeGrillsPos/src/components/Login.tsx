import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { showToast } from '@utils/toast';

// INTERNAL IMPORTS
// import { loginStaff } from '../api/auth';
// import { useAuth } from '../context/authContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { redirectPath, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast.error("All fields are required");
      return;
    }
    
    if (password.length < 6) {
      showToast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      const { from } = location.state as { from: { pathname: string } } || { from: { pathname: redirectPath } };
      navigate(from.pathname, { replace: true });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any | unknown) {
      console.error("Login failed:", error);
      showToast.error(error?.message || "Login failed. Please try again."  );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-[#171943] rounded-2xl p-6 w-full max-w-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-100 hover:text-[#EE7F61]"
        >
          ✕
        </button>

        {/* Login Form */}
        <div className="space-y-6">
          <h1 className="text-2xl text-[#EE7F61] font-semibold text-center">Log In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Username Input */}
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or Username"
                className="w-full pl-12 text-white pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Password Input */}
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

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#EE7F61] text-white rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginModal;