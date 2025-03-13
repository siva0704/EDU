
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && role) {
      // If already authenticated, redirect to recordings page
      navigate('/recordings');
    }
  }, [isAuthenticated, role, navigate]);
  
  const handleRoleSelect = (selectedRole: 'admin' | 'teacher' | 'student') => {
    login(selectedRole);
    toast({
      title: "Welcome!",
      description: `You are now logged in as ${selectedRole}.`,
    });
    navigate('/recordings');
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
              <Button 
                onClick={() => handleRoleSelect('admin')} 
                className="w-full"
              >
                Continue as Admin
              </Button>
            </div>
          </motion.div>
          
          {/* Teacher Role Card */}
          <motion.div variants={item}>
            <div className="bg-white dark:bg-black/40 border hover:border-primary/40 rounded-xl p-6 h-full card-hover">
              <h3 className="text-xl font-semibold mb-3">Teacher</h3>
              <p className="text-muted-foreground text-sm mb-6">Upload and edit content, mark attendance, create lesson plans, and view contacts/events.</p>
              <Button 
                onClick={() => handleRoleSelect('teacher')} 
                className="w-full"
              >
                Continue as Teacher
              </Button>
            </div>
          </motion.div>
          
          {/* Student Role Card */}
          <motion.div variants={item}>
            <div className="bg-white dark:bg-black/40 border hover:border-primary/40 rounded-xl p-6 h-full card-hover">
              <h3 className="text-xl font-semibold mb-3">Student</h3>
              <p className="text-muted-foreground text-sm mb-6">View class recordings, check attendance, access lesson plans, and see events/contacts.</p>
              <Button 
                onClick={() => handleRoleSelect('student')} 
                className="w-full"
              >
                Continue as Student
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
