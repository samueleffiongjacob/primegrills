import React, { JSX, useState } from "react";
import { useAuth } from "../context/authContext";
import LoginModal from "./Login";
// import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user: currentUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (!isAuthenticated && currentUser?.staff_profile.status !== "Active") {
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
        />
      </div>
    );
  }

  return children;
};
