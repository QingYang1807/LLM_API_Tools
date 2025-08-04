import React from 'react';
import { cn } from '@/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-effect rounded-xl p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 