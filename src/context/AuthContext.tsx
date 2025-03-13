
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'teacher' | 'student' | null;

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    return savedRole || null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setRole(savedRole as UserRole);
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = (role: UserRole) => {
    setRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', role as string);
  };
  
  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
  };
  
  const value = { role, setRole, isAuthenticated, login, logout };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
