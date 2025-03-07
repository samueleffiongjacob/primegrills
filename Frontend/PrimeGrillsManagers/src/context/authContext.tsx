import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the user type
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  profileImage?: string;
  status: string;
  role?: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isAuthorized: (requiredRole?: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isAuthorized: () => false,
  login: async () => {},
  logout: async () => {},
  loading: true
});

interface AuthResponse {
  message: string;
  error?: string;
  user?: User;
}

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 hours for auto-logout

  // Fetch user data on mount (uses cookies automatically)
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for including cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === "admin");
      } else {
        // If unauthorized or any other error, clear the state
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Check if user is authorized based on role
  const isAuthorized = (requiredRole?: string): boolean => {
    if (!user) return false; // Not authenticated
    if (user.status !== "Active" && !isAdmin) return false; // Inactive users have no access

    // If no role is required, just check authentication & status
    if (!requiredRole) return true;

    // Check if the user's role matches the required role
    return user.role === requiredRole || isAdmin;
  };

  // Login function - sends credentials and sets cookies on the server
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(), // Get CSRF token from cookies
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for including cookies
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Fetch user data after successful login
      await fetchUserData();

      // Auto-logout after 6 hours
      setTimeout(() => {
        logout();
      }, SIX_HOURS);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function - clears cookies on the server
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(), // Get CSRF token from cookies
        },
        credentials: "include", // Important for including cookies
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }

      // Clear state regardless of server response
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear the client state even if the server request fails
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get CSRF token from cookies
  const getCsrfToken = (): string => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1] || "";
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isAuthenticated, 
      isAuthorized, 
      login, 
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);