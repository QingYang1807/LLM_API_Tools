import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  isMobile?: boolean;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  isMobile = false,
}) => {
  const Icon = toastIcons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'relative rounded-lg border shadow-lg',
        isMobile ? 'p-3 max-w-full mx-4' : 'p-4 max-w-sm w-full',
        toastStyles[type]
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn(
          "flex-shrink-0 mt-0.5",
          isMobile ? "w-4 h-4" : "w-5 h-5"
        )} />
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium",
            isMobile ? "text-sm" : "text-sm"
          )}>{title}</h4>
          {message && (
            <p className={cn(
              "mt-1 opacity-90",
              isMobile ? "text-xs" : "text-sm"
            )}>{message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className={cn(
            "flex-shrink-0 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center touch-target",
            isMobile ? "w-4 h-4" : "w-5 h-5"
          )}
        >
          <X className={cn("", isMobile ? "w-2.5 h-2.5" : "w-3 h-3")} />
        </button>
      </div>
    </motion.div>
  );
};

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  isMobile?: boolean;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  isMobile = false,
}) => {
  return (
    <div className={cn(
      "fixed z-[9999] space-y-2",
      isMobile ? "top-4 left-4 right-4" : "top-4 right-4"
    )}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} isMobile={isMobile} />
        ))}
      </AnimatePresence>
    </div>
  );
}; 