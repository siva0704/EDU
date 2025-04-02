
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { 
  Video, 
  CheckSquare, 
  BookOpen, 
  Users, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  LogOut,
  FileText,
  GraduationCap
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all duration-200 group hover:bg-sidebar-accent",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80"
      )}
    >
      <Icon className={cn(
        "h-5 w-5 transition-all",
        isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
      )} />
      
      {!isCollapsed && (
        <span className="transition-opacity duration-200">{label}</span>
      )}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { role, logout } = useAuth();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const renderRoleSpecificItems = () => {
    const items = [
      { to: "/recordings", icon: Video, label: "Class Recordings", roles: ['admin', 'teacher', 'student'] },
      { to: "/attendance", icon: CheckSquare, label: "Digital Attendance", roles: ['admin', 'teacher', 'student'] },
      { to: "/lesson-plans", icon: BookOpen, label: "Lesson Plans", roles: ['admin', 'teacher', 'student'] },
      { to: "/results", icon: FileText, label: "Exam Results", roles: ['admin', 'teacher', 'student'] },
      { to: "/students", icon: GraduationCap, label: "Students", roles: ['admin', 'teacher'] },
      { to: "/contacts", icon: Users, label: "Department Contacts", roles: ['admin', 'teacher', 'student'] },
      { to: "/events", icon: Calendar, label: "Educational Events", roles: ['admin', 'teacher', 'student'] },
      { to: "/settings", icon: Settings, label: "Settings", roles: ['admin', 'teacher', 'student'] }
    ];
    
    return items
      .filter(item => item.roles.includes(role as string))
      .map((item, index) => (
        <SidebarItem
          key={index}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isCollapsed={isCollapsed}
        />
      ));
  };
  
  return (
    <div 
      className={cn(
        "h-screen sticky top-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 flex flex-col",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between h-16 px-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="font-semibold text-lg flex items-center gap-2">
            <span className="text-primary font-bold">CASCADE</span>
            <span>HUB</span>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className={cn(
            "p-1.5 rounded-full hover:bg-sidebar-accent transition-all",
            isCollapsed ? "mx-auto" : "ml-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-1">{renderRoleSpecificItems()}</nav>
      </div>
      
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center w-full gap-3 px-3 py-2 text-sidebar-foreground/80 rounded-lg hover:bg-sidebar-accent transition-all duration-200"
        >
          <LogOut className="h-5 w-5 text-sidebar-foreground/60" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
