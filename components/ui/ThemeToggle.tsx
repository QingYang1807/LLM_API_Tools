import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeToggleProps {
  className?: string;
  onThemeChange?: (theme: ThemeMode) => void;
  isMobile?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  onThemeChange,
  isMobile = false,
}) => {
  const [theme, setTheme] = useState<ThemeMode>('auto');
  const [mounted, setMounted] = useState(false);

  // 初始化主题
  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('theme') as ThemeMode;
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }
  }, []);

  // 应用主题
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    try {
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
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  }, [theme, mounted, onThemeChange]);

  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // 渲染占位符（防止水合不匹配）
  if (!mounted) {
    return (
      <div className={cn(
        'rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse',
        isMobile ? 'w-9 h-9' : 'w-10 h-10',
        className
      )} />
    );
  }

  const getIcon = () => {
    const iconSize = isMobile ? "w-4 h-4" : "w-5 h-5";
    switch (theme) {
      case 'light':
        return <Sun className={iconSize} />;
      case 'dark':
        return <Moon className={iconSize} />;
      case 'auto':
        return <Monitor className={iconSize} />;
      default:
        return <Monitor className={iconSize} />;
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
      default:
        return '跟随系统';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      icon={getIcon()}
      onClick={toggleTheme}
      className={cn(
        'p-0 touch-target transition-colors duration-200',
        isMobile ? 'w-9 h-9' : 'w-10 h-10',
        className
      )}
      title={getTooltip()}
    />
  );
}; 