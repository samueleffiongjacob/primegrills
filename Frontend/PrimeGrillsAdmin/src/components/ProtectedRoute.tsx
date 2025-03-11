// ProtectedRoute.tsx
import { JSX, useState } from "react";
import { useAuth } from "../context/authContext";
import LoginModal from "./Login";

// Define possible user roles for better type checking

interface ProtectedRouteProps {
  children: JSX.Element;
  roles: string[]
}


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated} = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

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
        />
      </div>
    );
  }

  console.log(user?.staff_profile?.role)
  console.log(roles)
  // Check if user role is allowed (with proper null checking)
  if (!user || !roles.includes((user?.staff_profile?.role).toLowerCase())) {
    return (
      <div className="flex flex-col items-center mt-[25vh] justify-center h-full">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;