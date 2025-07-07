import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white hover:from-[#E55A2B] hover:to-[#E8841A] focus:ring-primary shadow-lg hover:shadow-xl",
    secondary: "bg-secondary text-white hover:bg-[#003A6B] focus:ring-secondary shadow-md hover:shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-error text-white hover:bg-red-700 focus:ring-error shadow-md hover:shadow-lg",
    success: "bg-success text-white hover:bg-green-700 focus:ring-success shadow-md hover:shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;