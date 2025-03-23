import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { 
  FaFacebook, 
  FaApple, FaUser, 
  FaUserCircle, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaCheckCircle, FaEye, 
  FaEyeSlash
} from 'react-icons/fa';

// INTERNAL IMPORTS
import { signUpUser } from '../../api/auth';
import { resendVerificationEmail } from '../../api/email';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (email: string, password: string) => void;
  onToggleLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  // onSignUp,
  onToggleLogin,
}) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Add states for email resend functionality
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  // Error State
  const [errors, setErrors] = useState<{
    username?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Countdown timer for resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    } else if (resendMessage) {
      // Clear the resend message after cooldown ends
      setTimeout(() => {
        setResendMessage('');
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown, resendMessage]);

  const validateForm = () => {
    const newErrors: {
      username?: string;
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username) newErrors.username = "Username is required";
    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (phoneNumber.length !== 11) newErrors.phoneNumber = "Phone number must be 11 digits";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const response = await signUpUser({
      username,
      fullName,
      email,
      phoneNumber,
      password,
    });
    
    if (!response.success) {
      if (response.message.includes("Username already exists")) {
        setErrors((prevErrors) => ({ ...prevErrors, username: response.message }));
      } else if (response.message.includes("Email already exists")) {
        setErrors((prevErrors) => ({ ...prevErrors, email: response.message }));
      }
      setIsLoading(false);
      return; // Stop further execution
    }
  
    setSignupSuccess(true);
    setIsLoading(false);
  };

  // Handle resend verification email
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    
    setResendLoading(true);
    
    try {
      const response = await resendVerificationEmail(email);
      
      if (response.success) {
        setResendMessage('Verification email sent successfully!');
        // Set cooldown timer (60 seconds)
        setResendCooldown(60);
      } else {
        setResendMessage(response.message || 'Failed to resend verification email.');
        // Set a shorter cooldown for errors
        setResendCooldown(10);
      }
    } catch (error) {
      setResendMessage('An error occurred. Please try again later.');
      setResendCooldown(10);
    } finally {
      setResendLoading(false);
    }
  };

  if (!isOpen) return null;

  // Render success state
  if (signupSuccess) {
    return (
      <div className="fixed inset-0 bg-opacity-100 bg-[#F4F1F1] flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-6 shadow-xl">
          <FaCheckCircle className="mx-auto text-green-500 w-20 h-20" />
          <h2 className="text-2xl font-bold text-gray-800">Almost There!</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-lg">
              We've sent a verification email to <span className="font-semibold text-[#EE7F61]">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Please check your inbox and click the verification link to activate your account.
            </p>
            <div className="text-sm text-gray-400">
              Don't see the email? Check your spam folder or 
              <button 
                onClick={handleResendEmail}
                disabled={resendLoading || resendCooldown > 0}
                className={`ml-1 ${
                  resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#EE7F61] hover:underline'
                }`}
              >
                {resendLoading 
                  ? "sending..." 
                  : resendCooldown > 0 
                    ? `resend in ${resendCooldown}s` 
                    : "resend verification email"}
              </button>
            </div>
            {resendMessage && (
              <p className={`text-sm ${resendMessage.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                {resendMessage}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              onClose();
              setSignupSuccess(false);
            }}
            className="w-full py-3 bg-[#EE7F61] text-white rounded-xl hover:bg-orange-500 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-opacity-100 bg-[#F4F1F1]  py-8 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl my-5 p-6 w-full max-w-md max-h-screen overflow-y-auto scrollbar-hide relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-[#EE7F61]"
        >
          ✕
        </button>

        <div className="space-y-6 p-4">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Create Your Account</h1>

          <form className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <FaUserCircle className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className={`w-full pl-10 pr-4 py-1.5 rounded-xl border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            {/* Username */}
            <div className="relative">
              <FaUser className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={`w-full pl-10 pr-4 py-1.5 rounded-xl border ${
                  errors.username ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full pl-10 pr-4 py-1.5 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="relative">
              <FaPhone className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                className={`w-full pl-10 pr-4 py-1.5 rounded-xl border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full pl-10 pr-4 py-1.5 rounded-xl border ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
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
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
 
            {/* Confirm Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-4 py-1.5 rounded-xl border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-orange-400`}
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
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-full py-3 bg-[#EE7F61] text-white rounded-xl hover:bg-orange-500 transition-colors disabled:bg-gray-300"
            >
              {isLoading ? "Signing Up..." : "Create Account"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 -mt-2">Or Continue with</div>

          <div className="flex justify-center -mt-3 space-x-4">
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <FcGoogle className="w-6 h-6" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <FaFacebook className="w-6 h-6 text-blue-600" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <FaApple className="w-6 h-6" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" width="24px" />
            </button>
          </div>

          <div className="text-center text-sm -mt-3">
            <span className="text-gray-500">Already have an Account? </span>
            <button
              onClick={onToggleLogin}
              className="text-[#EE7F61] hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;