
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Lock, Mail, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, role, isLoading } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student' | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && role) {
      // If already authenticated, redirect to recordings page
      navigate('/recordings');
    }
  }, [isAuthenticated, role, navigate]);
  
  const handleLoginDialogOpen = (role: 'admin' | 'teacher' | 'student') => {
    setSelectedRole(role);
    setIsLoginDialogOpen(true);
    setLoginError(null);
    
    // Set default login credentials based on role
    if (role === 'admin') {
      setLoginEmail('admin@example.com');
    } else if (role === 'teacher') {
      setLoginEmail('teacher@example.com');
    } else {
      setLoginEmail('student@example.com');
    }
    setLoginPassword('password');
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) return;
    
    setLoggingIn(true);
    setLoginError(null);
    
    // For demonstration, check if using the expected email for the role
    const expectedEmails: Record<string, string> = {
      admin: 'admin@example.com',
      teacher: 'teacher@example.com',
      student: 'student@example.com'
    };
    
    setTimeout(() => {
      if (loginPassword.length < 6) {
        setLoginError('Password must be at least 6 characters');
        setLoggingIn(false);
        return;
      }
      
      // In a real app you'd validate credentials against a backend
      // For demo purposes, we'll allow the login if email contains the role name
      if (loginEmail.includes(selectedRole)) {
        login(selectedRole);
        setIsLoginDialogOpen(false);
        navigate('/recordings');
      } else {
        setLoginError(`Please use ${expectedEmails[selectedRole]} for ${selectedRole} login.`);
      }
      setLoggingIn(false);
    }, 1000);
  };
  
  const handleDemoLogin = () => {
    if (!selectedRole) return;
    setIsConfirmDialogOpen(false);
    login(selectedRole);
    navigate('/recordings');
  };
  
  const handleRoleSelect = (role: 'admin' | 'teacher' | 'student') => {
    setSelectedRole(role);
    setIsConfirmDialogOpen(true);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="text-center max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary/10 text-primary font-semibold py-1 px-3 rounded-full text-sm inline-block mb-6">
            Welcome to EDU Hub Connector
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Connecting Educational Resources
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Access class recordings, attendance records, lesson plans, department contacts, and educational events all in one place.
          </p>
        </motion.div>
        
        <motion.div
          className="w-full max-w-4xl mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex overflow-hidden h-72 rounded-2xl shadow-lg border">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/20 backdrop-blur-xl"></div>
            <div className="relative w-full h-full p-6 flex items-center">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="EDU Hub"
                className="absolute inset-0 w-full h-full object-cover opacity-10"
              />
              <div className="z-10 text-foreground max-w-xl">
                <h2 className="text-2xl font-bold mb-4">Streamlined Educational Management</h2>
                <p className="mb-6">An integrated platform designed for administrators, teachers, and students to collaborate effectively and access educational resources seamlessly.</p>
                <p className="text-sm text-muted-foreground">Please select your role to continue.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Admin Role Card */}
          <motion.div variants={item}>
            <div className="bg-white dark:bg-black/40 border hover:border-primary/40 rounded-xl p-6 h-full card-hover">
              <h3 className="text-xl font-semibold mb-3">Administrator</h3>
              <p className="text-muted-foreground text-sm mb-6">Full access to manage users, content, and analytics. Oversee all aspects of the platform.</p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleLoginDialogOpen('admin')} 
                  className="flex-1"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button 
                  onClick={() => handleRoleSelect('admin')} 
                  className="flex-1"
                >
                  Demo Mode
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Teacher Role Card */}
          <motion.div variants={item}>
            <div className="bg-white dark:bg-black/40 border hover:border-primary/40 rounded-xl p-6 h-full card-hover">
              <h3 className="text-xl font-semibold mb-3">Teacher</h3>
              <p className="text-muted-foreground text-sm mb-6">Upload and edit content, mark attendance, create lesson plans, and view contacts/events.</p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleLoginDialogOpen('teacher')} 
                  className="flex-1"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button 
                  onClick={() => handleRoleSelect('teacher')} 
                  className="flex-1"
                >
                  Demo Mode
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Student Role Card */}
          <motion.div variants={item}>
            <div className="bg-white dark:bg-black/40 border hover:border-primary/40 rounded-xl p-6 h-full card-hover">
              <h3 className="text-xl font-semibold mb-3">Student</h3>
              <p className="text-muted-foreground text-sm mb-6">View class recordings, check attendance, access lesson plans, and see events/contacts.</p>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleLoginDialogOpen('student')} 
                  className="flex-1"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button 
                  onClick={() => handleRoleSelect('student')} 
                  className="flex-1"
                >
                  Demo Mode
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login as {selectedRole}</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the {selectedRole} dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4 py-4">
            {loginError && (
              <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{loginError}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  className="pl-10"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className="pl-10" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsLoginDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loggingIn}>
                {loggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog for Demo Mode */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Use Demo Mode</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to log in as a {selectedRole} in demo mode. This will give you immediate access with sample data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDemoLogin}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
