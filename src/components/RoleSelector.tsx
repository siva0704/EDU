
import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { User, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const RoleSelector: React.FC = () => {
  const { role, login } = useAuth();
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const handleRoleChange = (newRole: UserRole) => {
    if (newRole) {
      login(newRole);
      setOpen(false);
    }
  };
  
  if (isDesktop) {
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
  }
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Change Role</DrawerTitle>
          <DrawerDescription>
            Select a role to switch your view mode
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 grid gap-2">
          <Button
            variant={role === 'admin' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleRoleChange('admin')}
          >
            Admin
          </Button>
          <Button
            variant={role === 'teacher' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleRoleChange('teacher')}
          >
            Teacher
          </Button>
          <Button
            variant={role === 'student' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => handleRoleChange('student')}
          >
            Student
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RoleSelector;
