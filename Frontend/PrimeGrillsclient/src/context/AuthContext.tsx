import { createContext, useContext, useState, useEffect } from "react";

// Define types
interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Initialize auth state from storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Function to log in
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('logging in');
      
      // First, get CSRF token
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf/`, {
        method: "GET",
        credentials: "include", // Required for cookies to be sent
      });
      
      const csrfToken = getCookie("csrftoken");
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login/`, {
        method: "POST",
        credentials: "include", // Required for cookies to be sent
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Parse the error response from the server
        const errorResponse = await response.json();
        return (errorResponse?.message);
      }

      // Set authentication state to true if login was successful
      setIsAuthenticated(true);
      
      // After successful login, fetch user profile
      await fetchUserProfile();
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const csrfToken = getCookie("csrftoken");
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/profile/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken || "",
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, try to refresh it
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            throw new Error("Failed to refresh token");
          }
          return await fetchUserProfile(); // Try again after token refresh
        }
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      console.log('user ', userData);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      if (String(error).includes("Failed to refresh token")) {
        logout();
      }
    }
  };

  // Utility function to extract CSRF token from cookies
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  // Function to refresh token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const csrfToken = getCookie("csrftoken");
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/token/refresh/`, {
        method: "POST",
        credentials: "include", // Required for HTTP-only cookies
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }
      
      return true;
    } catch (error) {
      console.error("Refresh Token Error:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Function to log out
  const logout = async () => {
    try {
      const csrfToken = getCookie("csrftoken");
      
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
      });
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');

      // When user logs out, we keep their cart in their user-specific storage
      // The cart will be empty for anonymous users
      localStorage.setItem('anonymous_cart', JSON.stringify([]));
    }
  };

  // Initial setup: Check authentication and fetch profile
  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        // If profile fetch fails, try refreshing the token
        console.log("Initial profile fetch failed:", error);
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          await fetchUserProfile();
        } else {
          // If refresh fails, ensure logged out state
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    initAuth();
  }, []);

  // Auto-refresh token every 14 minutes (assuming a 15-minute expiry)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};