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
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isAuthorized: () => false,
  login: () => {},
  logout: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Check if user is authorized based on role
  const isAuthorized = (requiredRole?: string): boolean => {
    if (!user) return false; // Not authenticated
    if (user.status !== "Active" && !isAdmin) return false; // Inactive users have no access

    // If no role is required, just check authentication & status
    if (!requiredRole) return true;

    // Check if the user's role matches the required role
    return user.role === requiredRole || isAdmin;
  };

  // Login function - stores user in state and localStorage
  const login = (email: string, password: string, userData: Omit<User, "email" | "password">) => {
    const newUser: User = { email, password, ...userData };
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAdmin(newUser.role === "admin");
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Logout function - clears user state and localStorage
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, isAuthorized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);
