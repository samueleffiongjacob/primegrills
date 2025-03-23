import { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  address: string;
  profileImage: string | null;
  phone: string;
  memberSince: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<string | boolean>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for authentication when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to fetch the user profile
        await fetchUserProfile();
      } catch (error) {
        // If there's an error, ensure the user is logged out
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<string | boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login/`, {
        method: "POST",
        credentials: "include", // Important: This ensures cookies are sent with the request
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        return errorResponse?.error || "Login failed";
      }

      setIsAuthenticated(true);
      await fetchUserProfile();
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return "Login failed";
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/email/verify/resend/`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      return response.ok;
    } catch (error) {
      console.error("Resend Email Error:", error);
      return false;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/`, {
        method: "GET",
        credentials: "include", // Important: This ensures cookies are sent with the request
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      // Don't automatically log out here anymore
      // Let the error be caught by the caller
      throw error;
    }
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (isLoading) {
    // You could return a loading spinner here if you want
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      fetchUserProfile,
      resendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};