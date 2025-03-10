/* eslint-disable react-refresh/only-export-components */
// import { getCookie } from "@utils/cookie.ts";
// import axios from "axios";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from '../services/authService';

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
  login: (email: string, password: string) => void;
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

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setIsAdmin(response.user.role === "posstaff");
        localStorage.setItem("user", JSON.stringify(response.user));
        setRedirectPath('/');
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem("user");
    }
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
