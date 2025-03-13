
import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { User, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const RoleSelector: React.FC = () => {
  const { role, login } = useAuth();
  
  const handleRoleChange = (newRole: UserRole) => {
    if (newRole) {
      login(newRole);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 animate-scale-in">
        <DropdownMenuItem onClick={() => handleRoleChange('admin')} className="cursor-pointer">
          <div className="w-full flex items-center justify-between">
            Admin
            {role === 'admin' && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('teacher')} className="cursor-pointer">
          <div className="w-full flex items-center justify-between">
            Teacher
            {role === 'teacher' && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('student')} className="cursor-pointer">
          <div className="w-full flex items-center justify-between">
            Student
            {role === 'student' && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSelector;
