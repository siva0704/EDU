
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from '@/context/ThemeContext';

const ThemeControls = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="fixed bottom-5 right-5 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-lg">
      <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value as Theme)}>
        <ToggleGroupItem value="light" aria-label="Light theme" className="px-3">
          <Sun className="h-4 w-4 mr-2" />
          <span className="sr-only sm:not-sr-only">Light</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark theme" className="px-3">
          <Moon className="h-4 w-4 mr-2" />
          <span className="sr-only sm:not-sr-only">Dark</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ThemeControls;
