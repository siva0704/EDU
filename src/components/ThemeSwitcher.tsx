
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

// This component is now deprecated in favor of the new ThemeControls
// It's kept for backwards compatibility
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant={theme === 'light' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setTheme('light')}
        className="flex items-center gap-2"
      >
        <Sun className="h-4 w-4" />
        <span>Light</span>
      </Button>
      <Button 
        variant={theme === 'dark' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setTheme('dark')}
        className="flex items-center gap-2"
      >
        <Moon className="h-4 w-4" />
        <span>Dark</span>
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
