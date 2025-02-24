// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';


// Define the user type
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  image?: string;
  status: "Active" | "Inactive";
  // Add any other user properties you need
  roles?: string[];
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isAuthorized: (requiredRoles?: string[]) => boolean;
  login: (email: string, userData: Omit<User, 'email'>) => void;
  logout: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isAuthorized: () => false,
  login: () => {},
  logout: () => {}
});

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Check if user is admin - we can customize this logic
        setIsAdmin(parsedUser.email.includes('admin') || 
                  (parsedUser.roles?.includes('admin') || false));
      } catch (error) {
        // Handle invalid JSON in localStorage
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Check if user is authorized based on status and roles
  const isAuthorized = (requiredRoles?: string[]): boolean => {
    // Not authenticated
    if (!user) return false;
    
    // Inactive users have no access unless they're admin
    if (user.status !== 'Active' && !isAdmin) return false;
    
    // If no specific roles required, just check if authenticated and active
    if (!requiredRoles || requiredRoles.length === 0) {
      return user.status === 'Active';
    }
    
    // Check if user has any of the required roles
    if (user.roles) {
      return requiredRoles.some(role => user.roles?.includes(role)) || isAdmin;
    }
    
    // If we need role-based access but user has no roles defined
    return isAdmin;
  };

  // Login function - stores user in state and localStorage
  const login = (email: string, userData: Omit<User, 'email'>) => {
    const newUser = { email, ...userData };
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAdmin(email.includes('admin') || 
              (userData.roles?.includes('admin') || false));
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Logout function - clears user state and localStorage
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  // Providing auth context to children components
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isAuthenticated, 
      isAuthorized,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook for using the auth context
export const useAuth = () => useContext(AuthContext);