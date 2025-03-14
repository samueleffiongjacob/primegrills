import React, { useState, useEffect } from 'react';
import LoginModal from '../components/User/Login'; // Adjust the import path as needed
import ReservationForm from '../components/ReservationForm'; // Adjust path as needed
import { useAuth } from '../context/AuthContext';

const ReservationPage: React.FC = () => {
  const [showPromptModal, setShowPromptModal] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in (you can replace this with your actual auth check)
  useEffect(() => {
    // Replace with your actual authentication check
    const checkAuthStatus = () => {
      const loggedIn = isAuthenticated;
      setIsLoggedIn(loggedIn);
      setShowPromptModal(!loggedIn); // Only show prompt if not logged in
    };
    
    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    // This function will be called after successful login
    setShowLoginModal(false);
    setIsLoggedIn(true);
    setShowPromptModal(false);
  };

  const handleToggleSignUp = () => {
    // Handle toggle to signup view
    // This would be implemented based on your auth flow
    setShowLoginModal(false);
    // Possibly show signup modal instead
  };

  return (
    <div className="relative">
      {/* Login Required Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-[#EE7F61] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m4-4h-.01M5 10H3m18 0h-2M7 6l-2-2m12 0l2-2M7 18l-2 2m12 0l2-2" />
              </svg>
              <h2 className="text-2xl font-bold mt-2 text-gray-800">Login Required</h2>
            </div>
            <p className="text-gray-600 mb-6">
              You need to be logged in to make a reservation. Please login to continue.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowPromptModal(false);
                  setShowLoginModal(true);
                }}
                className="px-4 py-2 bg-[#EE7F61] text-white rounded-md hover:bg-[#e06d50] transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onToggleSignUp={handleToggleSignUp}
      />
      
      {/* Reservation Form - Only show if logged in */}
      {isLoggedIn ? (
        <ReservationForm />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-xl w-full mx-auto mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Make a Reservation</h2>
          <p className="text-gray-600 mb-6">
            Please log in to make a reservation at our restaurant.
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-3 bg-[#EE7F61] text-white font-medium rounded-md hover:bg-[#e06d50] transition-colors"
          >
            Login to Reserve
          </button>
        </div>
      )}
    </div>
  );
};



export default ReservationPage;