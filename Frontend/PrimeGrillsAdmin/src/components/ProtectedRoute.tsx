// ProtectedRoute.tsx
import { JSX, useState } from "react";
import { useAuth } from "../context/authContext";
import LoginModal from "./Login";

// Define possible user roles for better type checking
export type UserRole = "admin" | "accountant" | "waiter" | "kitchen" | "cleaner";

// Define the user interface
interface User {
  id?: number;
  name?: string;
  email?: string;
  role: UserRole;
  status?: string;
}

// Define auth context interface to match useAuth hook
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  isAdmin?: boolean;
  isAuthorized?: (requiredRole?: string) => boolean;
  loading?: boolean;
}

interface ProtectedRouteProps {
  children: JSX.Element;
  roles: UserRole[]; 
}


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated} = useAuth() as AuthContextType;
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

  // Check if user role is allowed (with proper null checking)
  if (!user || !roles.includes(user.role as UserRole)) {
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