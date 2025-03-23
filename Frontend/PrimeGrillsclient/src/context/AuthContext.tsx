import { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
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

  const login = async (email: string, password: string): Promise<string | boolean> => {
    try {
      //const csrfToken = getCookie("csrftoken");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login/`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          //"X-CSRFToken": csrfToken || "",
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
      //const csrfToken = getCookie("csrftoken");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/email/verify/resend/`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
         // "X-CSRFToken": csrfToken || "",
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
      //const csrfToken = getCookie("csrftoken");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/`, {
        method: "GET",
        credentials: "include",
        headers: {
         // "X-CSRFToken": csrfToken || "",
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      logout(); // Log out the user if fetching the profile fails
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
     // const csrfToken = getCookie("csrftoken");

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
         // "X-CSRFToken": csrfToken || "",
        },
      });
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

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