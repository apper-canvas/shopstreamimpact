import React from 'react';
import { cn } from '@/utils/cn';

const Badge = React.forwardRef(({ 
  children, 
  className, 
  variant = 'default', 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-black",
    error: "bg-error text-white",
    outline: "border border-gray-300 text-gray-700 bg-transparent",
    sale: "bg-gradient-to-r from-primary to-accent text-white font-semibold",
    new: "bg-success text-white font-semibold"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;