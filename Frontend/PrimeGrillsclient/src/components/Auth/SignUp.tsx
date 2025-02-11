import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (emailOrPhone: string, password: string) => void;
  onToggleLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
  onToggleLogin,
}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [useEmail, setUseEmail] = useState(true);
  const [countryCode, setCountryCode] = useState('+234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailOrPhone = useEmail ? email : `${countryCode}${phoneNumber}`;
    onSignUp(emailOrPhone, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-[#EE7F61]"
        >
          ✕
        </button>

        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-center">Sign Up</h1>

          {/* Professional Toggle */}
          <div className="flex items-center p-1 bg-gray-200 rounded-lg">
            <button
              onClick={() => setUseEmail(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${
                useEmail 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MdEmail className={useEmail ? 'text-orange-400' : 'text-gray-500'} />
              <span>Email</span>
            </button>
            <button
              onClick={() => setUseEmail(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${
                !useEmail 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MdPhone className={!useEmail ? 'text-orange-400' : 'text-gray-500'} />
              <span>Phone</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {useEmail ? (
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative min-w-[120px]">
                  <p
                    className="w-full appearance-none pl-8 pr-8 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                  +234
                  </p>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}

            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-400 text-white rounded-xl hover:bg-orange-500 transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">Or Continue with</div>

          <div className="flex justify-center space-x-4">
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <FcGoogle className="w-6 h-6" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <FaFacebook className="w-6 h-6 text-blue-600" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <FaApple className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an Account? </span>
            <button
              onClick={onToggleLogin}
              className="text-orange-400 hover:text-orange-500"
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