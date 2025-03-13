
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import RoleSelector from './RoleSelector';
import { Bell, Search } from 'lucide-react';

const getPageTitle = (pathname: string): string => {
  const paths: Record<string, string> = {
    '/': 'Dashboard',
    '/recordings': 'Class Recordings',
    '/attendance': 'Digital Attendance',
    '/lesson-plans': 'Lesson Plans',
    '/contacts': 'Department Contacts',
    '/events': 'Educational Events',
    '/settings': 'Settings',
  };
  
  return paths[pathname] || 'Page Not Found';
};

const Header: React.FC = () => {
  const location = useLocation();
  const { role } = useAuth();
  const pageTitle = getPageTitle(location.pathname);
  
  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <span className="hidden sm:inline">Home</span>
          <span className="hidden sm:inline">/</span>
          <span>{pageTitle}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="search" 
            placeholder="Search..."
            className="h-9 w-[200px] rounded-full bg-secondary px-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        <div className={cn(
          "h-8 px-3 flex items-center gap-2 text-sm font-medium rounded-full",
          role === 'admin' ? "bg-primary/10 text-primary" :
          role === 'teacher' ? "bg-yellow-500/10 text-yellow-600" :
          "bg-green-500/10 text-green-600"
        )}>
          <span className="capitalize">{role}</span>
        </div>
        
        <RoleSelector />
      </div>
    </header>
  );
};

export default Header;
