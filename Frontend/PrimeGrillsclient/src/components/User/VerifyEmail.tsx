import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoginModal from "./Login";
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Use auth context
  
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
          setShowLoginModal(true); // Open login modal on success
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg">
        {status === "loading" && <p className="text-gray-700">Verifying your email...</p>}
        {status === "success" && (
          <p className="text-green-600">Email verified successfully! You can now log in.</p>
        )}
        {status === "error" && (
          <p className="text-red-600">Invalid or expired verification link.</p>
        )}
      </div>

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