
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingLogoProps {
  duration?: number;
  onComplete?: () => void;
}

const LoadingLogo: React.FC<LoadingLogoProps> = ({ 
  duration = 2000, 
  onComplete 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut" 
          }}
          className="mb-6"
        >
          <div className="inline-block p-3 rounded-full bg-primary/10">
            <motion.div
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                duration: 1.5,
                ease: "linear",
                repeat: Infinity
              }}
              className="relative"
            >
              <Loader2 className="h-16 w-16 text-primary" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
        >
          EDU Hub Connector
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-muted-foreground"
        >
          Loading your educational experience...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingLogo;
