
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'purple' | 'blue' | 'green';

export type ThemeInfo = {
  id: Theme;
  name: string;
  description: string;
  intent: 'neutral' | 'creative' | 'professional' | 'nature';
};

export const themeData: Record<Theme, ThemeInfo> = {
  'light': { 
    id: 'light', 
    name: 'Light Mode', 
    description: 'Default light appearance',
    intent: 'neutral'
  },
  'dark': { 
    id: 'dark', 
    name: 'Dark Mode', 
    description: 'Reduced eye strain in low light',
    intent: 'neutral'
  },
  'purple': { 
    id: 'purple', 
    name: 'Creative Purple', 
    description: 'Inspiring, creative mindset',
    intent: 'creative'
  },
  'blue': { 
    id: 'blue', 
    name: 'Professional Blue', 
    description: 'Focus and productivity',
    intent: 'professional'
  },
  'green': { 
    id: 'green', 
    name: 'Natural Green', 
    description: 'Calm, balanced atmosphere',
    intent: 'nature'
  }
};

type ThemeContextType = {
  theme: Theme;
  themeInfo: ThemeInfo;
  setTheme: (theme: Theme) => void;
  availableThemes: ThemeInfo[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Check for saved theme or system preference
    if (savedTheme && Object.keys(themeData).includes(savedTheme)) {
      return savedTheme;
    }
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'purple', 'blue', 'green');
    
    // Add selected theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const value = { 
    theme,
    themeInfo: themeData[theme],
    setTheme,
    availableThemes: Object.values(themeData),
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
