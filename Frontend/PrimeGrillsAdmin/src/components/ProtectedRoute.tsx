import { useState } from "react";
import { useAuth } from "../context/authContext";
import LoginModal from "./Login";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center mt-[25vh] justify-center h-full">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
          <p className="mb-4">
            Please
            <span
              onClick={() => setIsLoginModalOpen(true)}
              className="mx-1 cursor-pointer text-orange-600 hover:text-orange-800 underline"
            >
              login
            </span>
            to access this page.
          </p>
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={login}
        />
      </div>
    );
  }

 // ✅ Check if user role is allowed
if (!roles.includes(user?.role || "")) {
  return (
    <div className="flex flex-col items-center mt-[25vh] justify-center h-full">
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
    </div>
  </div>
  );
}


  return children;
};
