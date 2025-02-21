import { useState } from "react";
import { useAuth } from "../context/authContext";
import LoginModal from "./Login";

export const ProtectedRoute = ({ children }) => {
  const { isAuthorized } = useAuth();
  const { user, isAuthenticated, login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogin = (email: string, password: string) => {
    //  API call to verify credentials will be here 

    // For example purpose ,simulating what the a
    const userData = {
      status: "Active" as const,
      roles: ["user"]
    };
    
    // This comes from AuthContext
    login(email, userData);
    setIsLoginModalOpen(false);
  };

  
  // Check if user has permission
  if (!isAuthorized()) {
    return (
      <div className="flex flex-col items-center mt-[25vh] justify-center h-full">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
          <p className="mb-4">Please 
            <span onClick={handleOpenLoginModal} className="mx-1 cursor-pointer text-orange-600 hover:text-orange-800 underline">login</span> 
            to access data.</p>
        </div>
        {/* Login Modal */}
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={handleCloseLoginModal}
            onLogin={handleLogin}
        />
      </div>
      
    );
  }
  
  return children;
};
