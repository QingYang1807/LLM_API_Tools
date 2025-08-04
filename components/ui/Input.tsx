import React from 'react';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMobile?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  isMobile = false,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={cn(
          "block font-medium text-slate-700 dark:text-slate-300 mb-2",
          isMobile ? "text-sm" : "text-sm"
        )}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={cn(
              "text-slate-400",
              isMobile ? "h-4 w-4" : "h-5 w-5"
            )}>{leftIcon}</div>
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'input-field',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500',
            isMobile && 'text-sm',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className={cn(
              "text-slate-400",
              isMobile ? "h-4 w-4" : "h-5 w-5"
            )}>{rightIcon}</div>
          </div>
        )}
      </div>
      {error && (
        <p className={cn(
          "mt-1 text-red-600 dark:text-red-400",
          isMobile ? "text-xs" : "text-sm"
        )}>{error}</p>
      )}
      {helperText && !error && (
        <p className={cn(
          "mt-1 text-slate-500 dark:text-slate-400",
          isMobile ? "text-xs" : "text-sm"
        )}>{helperText}</p>
      )}
    </div>
  );
}; 