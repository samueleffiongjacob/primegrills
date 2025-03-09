import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

// Define the user type
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  profileImage?: string;
  staff_profile: {
    role: string;
    shift: string;
    status: string;
    shiftHours: string;
    gender: string;
    age: string;
  };
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

// Access token configuration
const TOKEN_DURATION = 60 * 60 * 1000; // 1 hour (assuming this is your token validity)
const REFRESH_BEFORE = 15 * 60 * 1000; // 15 minutes before expiration
const SESSION_DURATION = 6 * 60 * 60 * 1000; // 6 hours for auto-logout

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Use refs for timers to persist across renders and allow cleanup
  const refreshTimerRef = useRef<number | null>(null);
  const sessionTimerRef = useRef<number | null>(null);
  
  // Helper function to get CSRF token from cookies
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Function to clear all timers
  const clearAllTimers = () => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    if (sessionTimerRef.current) {
      window.clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  // Fetch user data (uses cookies automatically)
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/staff/profile/`, {
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
        setIsAdmin(userData.staff_profile.role === "Manager");
        
        // Set up token refresh and session timers
        scheduleTokenRefresh();
        scheduleSessionTimeout();
      } else {
        // If unauthorized or any other error, clear the state
        handleAuthFailure();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      handleAuthFailure();
    } finally {
      setLoading(false);
    }
  };

  // Schedule token refresh 15 minutes before expiration
  const scheduleTokenRefresh = () => {
    // Clear any existing refresh timer
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current);
    }
    
    // Set new refresh timer to run 15 minutes before token expires
    const refreshTime = TOKEN_DURATION - REFRESH_BEFORE;
    refreshTimerRef.current = window.setTimeout(async () => {
      if (isAuthenticated) {
        const success = await refreshAccessToken();
        if (success) {
          // If refresh successful, schedule the next refresh
          scheduleTokenRefresh();
        } else {
          // If refresh fails, log the user out
          await logout();
        }
      }
    }, refreshTime);
  };

  // Schedule session timeout (auto-logout after 6 hours)
  const scheduleSessionTimeout = () => {
    // Clear any existing session timer
    if (sessionTimerRef.current) {
      window.clearTimeout(sessionTimerRef.current);
    }
    
    // Set new session timer
    sessionTimerRef.current = window.setTimeout(() => {
      logout();
    }, SESSION_DURATION);
  };

  // Initialize auth state on mount
  useEffect(() => {
    fetchUserData();
    
    // Clean up all timers on unmount
    return () => {
      clearAllTimers();
    };
  }, []);

  // Check if user is authorized based on role
  const isAuthorized = (requiredRole?: string): boolean => {
    if (!user) return false; // Not authenticated
    if (user.staff_profile.status !== "Active" && !isAdmin) return false; // Inactive users have no access

    // If no role is required, just check authentication & status
    if (!requiredRole) return true;

    // Check if the user's role matches the required role
    return user.staff_profile.role === requiredRole || isAdmin;
  };

  // Refresh the access token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const csrfToken = getCookie("csrftoken");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/token/refresh/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      // After successful refresh, extend the session timeout
      scheduleSessionTimeout();
      
      return true;
    } catch (error) {
      console.error("Refresh Token Error:", error);
      handleAuthFailure();
      return false;
    }
  };

  // Handle authentication failure (unauthorized, token expired, etc.)
  const handleAuthFailure = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    clearAllTimers();
  };

  // Login function - sends credentials and sets cookies on the server
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      // First, get CSRF token
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf/`, {
        method: "GET",
        credentials: "include",
      });

      const csrfToken = getCookie("csrftoken");

      // Attempt login
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login_staff/`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      // Fetch user data after successful login
      await fetchUserData();
      
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
      const csrfToken = getCookie("csrftoken");
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout_staff/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include", // Important for including cookies
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear all state and timers regardless of server response
      handleAuthFailure();
      setLoading(false);
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
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);