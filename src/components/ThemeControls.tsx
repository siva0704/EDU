
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeControls = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="fixed bottom-5 right-5 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-lg">
      <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)}>
        <ToggleGroupItem value="light" aria-label="Light theme" className="px-3">
          <Sun className="h-4 w-4 mr-2" />
          <span className="sr-only sm:not-sr-only">Light</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark theme" className="px-3">
          <Moon className="h-4 w-4 mr-2" />
          <span className="sr-only sm:not-sr-only">Dark</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="purple" aria-label="Purple theme" className="px-3">
          <div className="h-4 w-4 rounded-full bg-theme-purple mr-2" />
          <span className="sr-only sm:not-sr-only">Purple</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="blue" aria-label="Blue theme" className="px-3">
          <div className="h-4 w-4 rounded-full bg-theme-blue mr-2" />
          <span className="sr-only sm:not-sr-only">Blue</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="green" aria-label="Green theme" className="px-3">
          <div className="h-4 w-4 rounded-full bg-theme-green mr-2" />
          <span className="sr-only sm:not-sr-only">Green</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ThemeControls;
