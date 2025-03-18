import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/email/verify/${uid}/${token}/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, token }),
          }
        );

        if (response.ok) {
          setStatus("success");
          setShowToast(true); // Show toast notification

          // Delay the login modal for 3 seconds
          setTimeout(() => {
            setShowLoginModal(true); // Open login modal after delay
          }, 3000);

          // Auto-hide toast after 5 seconds
          setTimeout(() => {
            setShowToast(false);
          }, 5000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
        console.log(error);
      }
    };

    verifyEmail();
  }, [uid, token]);

  // Redirect to home page when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to home page
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div 
          className="fixed top-4 right-0 bg-blue-800 text-white font-bold px-6 py-3 rounded-l-md shadow-md flex items-center z-50 animate-slide-in-out"
          style={{
            animation: 'slideInOut 5s forwards',
          }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span >Email verified successfully! You can now log in.</span>
        </div>
      )}

      {/* Hidden container that only shows during loading or error */}
      {status !== "success" && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          {status === "loading" && <p className="text-gray-700">Verifying your email...</p>}
          {status === "error" && (
            <p className="text-red-600">Invalid or expired verification link.</p>
          )}
        </div>
      )}

        {status === "success" && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          {status === "success" && <p className="text-green-700">Email verified!</p>}

        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          // No need to manually close the modal or do anything here
          // The authentication status change will trigger the redirect
        }}
        onToggleSignUp={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default VerifyEmail;