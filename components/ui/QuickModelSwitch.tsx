import React, { useState, useEffect, useRef } from 'react';
import { ApiConfig, ModelConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Zap, Settings, X } from 'lucide-react';
import { cn } from '@/utils';

interface QuickModelSwitchProps {
  apiConfigs: ApiConfig[];
  currentApiConfig: ApiConfig | null;
  currentModel: ModelConfig | null;
  onApiConfigChange: (config: ApiConfig) => void;
  onModelChange: (model: ModelConfig) => void;
  onSettingsClick: () => void;
  isMobile?: boolean;
}

interface Position {
  x: number;
  y: number;
}

export const QuickModelSwitch: React.FC<QuickModelSwitchProps> = ({
  apiConfigs,
  currentApiConfig,
  currentModel,
  onApiConfigChange,
  onModelChange,
  onSettingsClick,
  isMobile = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  // 初始化位置
  useEffect(() => {
    const savedPosition = localStorage.getItem('quickModelSwitchPosition');
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition);
        setPosition(pos);
      } catch (error) {
        console.error('Failed to parse saved position:', error);
        setDefaultPosition();
      }
    } else {
      setDefaultPosition();
    }
  }, []);

  const setDefaultPosition = () => {
    const defaultPos = isMobile 
      ? { x: window.innerWidth - 80, y: window.innerHeight - 80 }
      : { x: window.innerWidth - 100, y: window.innerHeight - 100 };
    setPosition(defaultPos);
  };

  // 保存位置到localStorage
  const savePosition = (pos: Position) => {
    localStorage.setItem('quickModelSwitchPosition', JSON.stringify(pos));
  };

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return; // 展开时不拖拽
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isExpanded) return; // 展开时不拖拽
    
    const touch = e.touches[0];
    setIsDragging(true);
    
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  };

  // 处理拖拽移动
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // 边界检查
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    
    const newPosition = { x: clampedX, y: clampedY };
    setPosition(newPosition);
  };

  // 处理触摸移动
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;
    
    // 边界检查
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    
    const newPosition = { x: clampedX, y: clampedY };
    setPosition(newPosition);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }
  };

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      if (position.x > maxX || position.y > maxY) {
        const newPosition = {
          x: Math.min(position.x, maxX),
          y: Math.min(position.y, maxY),
        };
        setPosition(newPosition);
        savePosition(newPosition);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  const handleModelSelect = (config: ApiConfig, model: ModelConfig) => {
    onApiConfigChange(config);
    onModelChange(model);
    setIsExpanded(false);
  };

  const handleDoubleClick = () => {
    if (!isDragging) {
      onSettingsClick();
    }
  };

  return (
    <div 
      className={cn(
        "fixed z-[9999]",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* 主按钮 */}
      <div
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
        className={cn(
          "relative touch-target",
          isDragging ? "select-none" : ""
        )}
      >
        <Button
          variant="primary"
          size="lg"
          icon={<Zap className="w-6 h-6" />}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "rounded-full shadow-lg hover:shadow-xl transition-all duration-200 touch-target",
            isMobile ? "w-12 h-12" : "w-14 h-14",
            isDragging ? "scale-110" : "hover:scale-110"
          )}
        />
      </div>

      {/* 展开的模型列表 */}
      {isExpanded && (
        <Card className={cn(
          "absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700",
          isMobile ? "max-w-xs" : "max-w-sm"
        )}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn(
              "font-medium",
              isMobile ? "text-sm" : "text-base"
            )}>快速切换</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="w-4 h-4" />}
              onClick={() => setIsExpanded(false)}
              className="touch-target"
            />
          </div>
          
          <div className="space-y-2">
            {apiConfigs.slice(0, isMobile ? 2 : 3).map((config) => (
              <div key={config.id} className="space-y-1">
                <div className={cn(
                  "font-medium text-slate-600 dark:text-slate-400",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  {config.name}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {config.models.slice(0, isMobile ? 1 : 2).map((model) => (
                    <Button
                      key={model.id}
                      variant={currentModel?.id === model.id ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => handleModelSelect(config, model)}
                      className={cn(
                        "justify-start touch-target",
                        isMobile ? "text-xs py-1" : "text-sm py-2"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          currentModel?.id === model.id 
                            ? "bg-white" 
                            : "bg-blue-500"
                        )} />
                        <span className="truncate">{model.displayName}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              icon={<Settings className="w-4 h-4" />}
              onClick={() => {
                setIsExpanded(false);
                onSettingsClick();
              }}
              className="w-full justify-start touch-target"
            >
              管理配置
            </Button>
          </div>
        </Card>
      )}

      {/* 拖拽提示 */}
      {!isExpanded && (
        <div className={cn(
          "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 transition-opacity duration-200 pointer-events-none",
          isDragging ? "opacity-100" : ""
        )}>
          拖拽移动
        </div>
      )}
    </div>
  );
}; 