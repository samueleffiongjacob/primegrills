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
  login: async () => {},
  logout: async () => {},
  loading: true
});


// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);
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
        console.log(userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set admin status based on role
        if (userData.staff_profile.role === "Manager") {
          setIsAdmin(true);
        }
        
        // Set token expiration (assuming we've just refreshed the token)
        setTokenExpiration(new Date(new Date().getTime() + 15 * 60 * 1000));
      } else {
        // If unauthorized or any other error, try refreshing the token
        const refreshed = await refreshToken();
        if (refreshed) {
          // If refresh successful, try fetching user data again
          await fetchUserData();
        } else {
          // If refresh failed, clear the state
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          setTokenExpiration(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Try token refresh if fetch fails
      const refreshed = await refreshToken();
      if (!refreshed) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setTokenExpiration(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Token refresh function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
      });

      if (response.ok) {
        // Update token expiration time (15 minutes from now)
        console.log('token refreshed')
        setTokenExpiration(new Date(new Date().getTime() + 15 * 60 * 1000));
        return true;
      }
      console.log('token not refreshed')
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

/*   // Initialize auth state on mount
  useEffect(() => {
    fetchUserData();
  }, []);
 */
  // Set up automatic token refreshing
  useEffect(() => {
    if (!isAuthenticated || !tokenExpiration) return;
    
    // Calculate time until refresh (1 minute before expiration)
    const now = new Date();
    const timeUntilRefresh = Math.max(
      0,
      tokenExpiration.getTime() - now.getTime() - 60000
    );
    
    // Set up token refresh
    const refreshTimerId = setTimeout(async () => {
      const success = await refreshToken();
      if (!success) {
        // If refresh fails, log the user out
        logout();
      }
    }, timeUntilRefresh);
    
    // Clean up timer
    return () => clearTimeout(refreshTimerId);
  }, [isAuthenticated, tokenExpiration]);

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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login_staff/`, {
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

      // Set token expiration time (15 minutes from now)
      setTokenExpiration(new Date(new Date().getTime() + 15 * 60 * 1000));

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
      setTokenExpiration(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear the client state even if the server request fails
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setTokenExpiration(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get CSRF token from cookies
  // const getCsrfToken = (): string => {
  //   return document.cookie
  //     .split("; ")
  //     .find(row => row.startsWith("csrftoken="))
  //     ?.split("=")[1] || "";
  // };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
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