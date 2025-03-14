
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type UserRole = 'admin' | 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
  department?: string;
  position?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data based on role
const getUserData = (role: UserRole): User | null => {
  if (!role) return null;
  
  const currentDate = new Date().toLocaleString();
  
  const mockUsers: Record<string, User> = {
    admin: {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      lastLogin: currentDate,
      department: 'IT Department',
      position: 'System Administrator'
    },
    teacher: {
      id: 'teacher-1',
      name: 'Teacher User',
      email: 'teacher@example.com',
      role: 'teacher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
      lastLogin: currentDate,
      department: 'Science Department',
      position: 'Senior Lecturer'
    },
    student: {
      id: 'student-1',
      name: 'Student User',
      email: 'student@example.com',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      lastLogin: currentDate,
      department: 'Computer Science',
      position: 'Undergraduate Student'
    }
  };
  
  return mockUsers[role];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    return savedRole || null;
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    return savedRole ? getUserData(savedRole) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      const userData = getUserData(savedRole as UserRole);
      setRole(savedRole as UserRole);
      setUser(userData);
      setIsAuthenticated(true);
    }
    // Simulate a loading state for authentication
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  const login = (role: UserRole) => {
    const userData = getUserData(role);
    setRole(role);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', role as string);
    
    toast({
      title: "Logged in successfully",
      description: `Welcome, ${userData?.name}! You are now logged in as ${role}.`,
    });
  };
  
  const logout = () => {
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  const value = { 
    user, 
    role, 
    setRole, 
    isAuthenticated, 
    login, 
    logout,
    isLoading 
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
