import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  className?: string;
  showShortcut?: boolean;
  autoFocus?: boolean;
  isMobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索...',
  onSearch,
  onClear,
  className,
  showShortcut = true,
  autoFocus = false,
  isMobile = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
          'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm',
          'border-slate-200 dark:border-slate-600',
          isFocused && 'ring-2 ring-blue-500 border-transparent',
          'hover:border-slate-300 dark:hover:border-slate-500',
          isMobile ? 'py-1.5' : 'py-2'
        )}
      >
        <Search className={cn(
          "text-slate-400 flex-shrink-0",
          isMobile ? "w-3 h-3" : "w-4 h-4"
        )} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500",
            isMobile ? "text-xs" : "text-sm"
          )}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className={cn(
              "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0 touch-target",
              isMobile ? "w-3 h-3" : "w-4 h-4"
            )}
          >
            <X className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />
          </button>
        )}
        
        {showShortcut && !query && !isMobile && (
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </div>
    </div>
  );
}; 