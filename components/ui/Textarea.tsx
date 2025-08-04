import React from 'react';
import { cn } from '@/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  maxLength,
  showCharCount = false,
  className,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const charCount = props.value?.toString().length || 0;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'input-field resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        maxLength={maxLength}
        {...props}
      />
      <div className="flex justify-between items-center mt-1">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
        {showCharCount && maxLength && (
          <p className={cn(
            "text-sm ml-auto",
            charCount > maxLength * 0.9 ? "text-orange-500" : "text-slate-500 dark:text-slate-400"
          )}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}; 