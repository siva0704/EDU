
import React, { useEffect } from 'react';
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

  // Logo circle variants for staggered animation
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse" as const,
        repeatDelay: 0.5
      }
    })
  };

  // Array for the circles in the logo
  const circles = Array.from({ length: 3 });

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
          <div className="relative inline-block">
            {/* Modern Circle Logo Animation */}
            <div className="relative p-4">
              <motion.div
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity
                }}
                className="absolute inset-0 rounded-full border-t-4 border-l-4 border-primary/30 w-full h-full"
              />
              
              <div className="flex justify-center items-center h-20 w-20">
                {circles.map((_, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={circleVariants}
                    initial="hidden"
                    animate="visible"
                    className={`absolute rounded-full bg-primary ${
                      i === 0 ? 'h-4 w-4' : i === 1 ? 'h-6 w-6 opacity-60' : 'h-8 w-8 opacity-30'
                    }`}
                  />
                ))}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </motion.div>
              </div>
            </div>
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
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-muted-foreground mb-2">
            Loading your educational experience...
          </p>
          
          {/* Loading progress dots */}
          <div className="flex justify-center space-x-2 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
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
