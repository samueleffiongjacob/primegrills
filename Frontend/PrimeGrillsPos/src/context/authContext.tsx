import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the user type
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  phone: string;
  last_login?: string | null;
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isAuthorized: (requiredRole?: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  redirectPath: string;
  setRedirectPath: (path: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAdmin: false,
  isAuthenticated: false,
  isAuthorized: () => false,
  redirectPath: '/',
  setRedirectPath: () => {},
  login: async () => {},
  logout: async () => {},
  loading: true
});

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>('/');
  const [loading, setLoading] = useState(true);
  const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 hours for auto-logout

  // Fetch user data on mount (uses cookies automatically)
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
        setIsAdmin(userData.staff_profile.role === "pos");
        setRedirectPath('/');
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

  // Set up auto-logout after 6 hours of session
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const autoLogoutTimer = setTimeout(() => {
      logout();
    }, SIX_HOURS);
    
    return () => clearTimeout(autoLogoutTimer);
  }, [isAuthenticated]);

  // Check if user is authorized based on role
  const isAuthorized = (requiredRole?: string): boolean => {
    if (!user) return false; // Not authenticated
    if (user.staff_profile.status !== "Active" && !isAdmin) return false; // Inactive users have no access

    // If no role is required, just check authentication & status
    if (!requiredRole) return true;

    // Check if the user's role matches the required role
    return user.staff_profile.role === requiredRole || isAdmin;
  };

  // Login function - sends credentials and sets cookies on the server
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login_pos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for including cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
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
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout_staff/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      isAdmin, 
      isAuthenticated, 
      isAuthorized, 
      login, 
      logout,
      redirectPath,
      setRedirectPath,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);