import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onToggleSignUp: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onToggleSignUp }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {  
      const success = await login(email, password);
      if (success) {
        onLogin(email, password); // This will close the modal
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#F4F1F1] bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-[#EE7F61]"
        >
          ✕
        </button>

        {/* Login Form */}
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-center">Sign In</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email or Username Input */}
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or Username"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={isLoading}
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
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  className="rounded text-orange-400 focus:ring-orange-400"
                  disabled={isLoading}
                />
                <span className="text-gray-600">Stay signed in</span>
              </label>
              <a href="#" className="text-orange-400 hover:text-orange-500">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#EE7F61] text-white rounded-xl hover:bg-orange-500 transition-colors disabled:bg-gray-300"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Or Continue with */}
          <div className="text-center text-sm text-gray-500">Or Continue with</div>

          {/* Social Login Options */}
          <div className="flex justify-center space-x-4">
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50" disabled={isLoading}>
              <FcGoogle className="w-6 h-6" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50" disabled={isLoading}>
              <FaFacebook className="w-6 h-6 text-blue-600" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50" disabled={isLoading}>
              <FaApple className="w-6 h-6" />
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an Account? </span>
            <button
              onClick={onToggleSignUp}
              className="text-orange-400 hover:text-orange-500"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;