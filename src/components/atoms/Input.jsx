import React from 'react';
import { cn } from '@/utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  const errorStyles = "border-error focus:ring-error";

  return (
    <input
      type={type}
      className={cn(
        baseStyles,
        error && errorStyles,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;