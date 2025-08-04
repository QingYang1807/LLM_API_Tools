import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeToggleProps {
  className?: string;
  onThemeChange?: (theme: ThemeMode) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  onThemeChange,
}) => {
  const [theme, setTheme] = useState<ThemeMode>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);
      
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
    onThemeChange?.(theme);
  }, [theme, mounted, onThemeChange]);

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  if (!mounted) {
    return (
      <div className={cn('w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700', className)} />
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'auto':
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return '浅色模式';
      case 'dark':
        return '深色模式';
      case 'auto':
        return '跟随系统';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      icon={getIcon()}
      onClick={toggleTheme}
      className={cn('w-10 h-10 p-0', className)}
      title={getTooltip()}
    />
  );
}; 