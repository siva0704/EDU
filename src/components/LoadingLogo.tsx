
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    animate: {
      rotate: [0, 0, 0],
      scale: [0.9, 1, 0.9],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseRingVariants = {
    animate: {
      scale: [0.85, 1.15],
      opacity: [0.2, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut"
      }
    }
  };

  // Loading dots
  const dotVariants = {
    animate: (i: number) => ({
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative"
        >
          {/* Pulse rings around logo - enhanced for dark mode */}
          <motion.div
            variants={pulseRingVariants}
            animate="animate"
            className="absolute inset-0 rounded-full border-2 border-primary/30 dark:border-primary/40"
          />
          
          <motion.div
            variants={pulseRingVariants}
            animate="animate"
            transition={{ delay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-primary/20 dark:border-primary/30"
          />
          
          {/* Rotating container for the logo */}
          <div className="relative">
            <motion.div
              className="p-5 relative"
              variants={containerVariants}
              animate="animate"
            >
              {/* The actual logo */}
              <div className="h-24 w-24 relative">
                <img 
                  src="/lovable-uploads/72700888-906e-492c-b8f1-e7d0a7c5b8b5.png" 
                  alt="CASCADE Logo" 
                  className="h-full w-full object-contain" 
                />
                
                {/* Animated overlay effect - enhanced for dark mode */}
                <motion.div 
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/15 rounded-full" 
                  animate={{ 
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </motion.div>
            
            {/* Circular progress track - enhanced for dark mode */}
            <motion.div
              className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary/40 dark:border-primary/50"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                ease: "linear",
                repeat: Infinity
              }}
            />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
        >
          CASCADE HUB
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-muted-foreground mb-2">
            Loading your educational experience...
          </p>
          
          {/* Animated loading dots */}
          <div className="flex justify-center space-x-2 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={dotVariants}
                animate="animate"
                className="h-2 w-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingLogo;
