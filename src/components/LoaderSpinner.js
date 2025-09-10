import React from 'react';
import { motion } from 'framer-motion';

const LoaderSpinner = ({ 
  size = 'md', 
  color = '#65a30d', 
  className = '', 
  text = null,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center py-8';

  const Spinner = () => (
    <div className="relative">
      {/* Outer rotating ring */}
      <motion.div
        className={`${sizeClasses[size]} border-4 border-transparent rounded-full`}
        style={{ 
          borderTopColor: color,
          borderRightColor: `${color}40`,
        }}
        variants={spinnerVariants}
        animate="animate"
      />
      
      {/* Inner pulsing dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={pulseVariants}
        animate="animate"
      >
        <div 
          className={`${size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : 'h-4 w-4'} rounded-full`}
          style={{ backgroundColor: color }}
        />
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={containerClasses}>
        <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 p-8 flex flex-col items-center space-y-4">
          <Spinner />
          {text && (
            <motion.p 
              className={`text-gray-300 ${textSizeClasses[size]} font-medium`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <Spinner />
        {text && (
          <motion.p 
            className={`text-gray-400 ${textSizeClasses[size]} font-medium`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 animate-pulse ${className}`}>
      <div className="space-y-4">
        {/* Image placeholder */}
        <div className="h-48 bg-gray-700/50 rounded-xl"></div>
        
        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700/30 rounded w-1/2"></div>
        </div>
        
        {/* Content placeholder */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-700/30 rounded"></div>
          <div className="h-3 bg-gray-700/30 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

// Grid skeleton for multiple cards
export const SkeletonGrid = ({ count = 6, cardClassName = '' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} className={cardClassName} />
      ))}
    </div>
  );
};

export default LoaderSpinner;
