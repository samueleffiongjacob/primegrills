/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the user type
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  image?: string;
  status: string;
  role?: string; // Now a single role, not an array
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isAuthorized: (requiredRole?: string) => boolean;
  login: (email: string, password: string, userData: Omit<User, "email" | "password">) => void;
  logout: () => void;
  redirectPath: string;
  setRedirectPath: (path: string) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isAuthorized: () => false,
  login: () => {},
  logout: () => {},
  redirectPath: '/',
  setRedirectPath: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/');

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Check if user is an admin
        setIsAdmin(parsedUser.role === "admin");
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Simplified isAuthorized to always return true if authenticated
  const isAuthorized = (requiredRole?: string): boolean => {
    return !!user && user.status === "Active" || requiredRole === "admin";

  };

  // Modified login function to always set redirectPath to root
  const login = (email: string, password: string, userData: Omit<User, "email" | "password">) => {
    const newUser: User = { email, password, ...userData };
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAdmin(true);
    localStorage.setItem("user", JSON.stringify(newUser));
    setRedirectPath('/');  // Always redirect to root
  };

  // Logout function - clears user state and localStorage
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isAuthenticated, 
      isAuthorized, 
      login, 
      logout,
      redirectPath,
      setRedirectPath 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);
