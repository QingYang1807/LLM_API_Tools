import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ApiConfig, ModelConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChevronDown, Check, Settings } from 'lucide-react';
import { cn } from '@/utils';

interface ModelSelectorProps {
  apiConfigs: ApiConfig[];
  currentApiConfig: ApiConfig | null;
  currentModel: ModelConfig | null;
  onApiConfigChange: (config: ApiConfig) => void;
  onModelChange: (model: ModelConfig) => void;
  onSettingsClick: () => void;
  isMobile?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  apiConfigs,
  currentApiConfig,
  currentModel,
  onApiConfigChange,
  onModelChange,
  onSettingsClick,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // 监听快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 更新按钮位置信息
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [isOpen]);

  const handleApiConfigSelect = (config: ApiConfig) => {
    onApiConfigChange(config);
    if (config.models.length > 0) {
      onModelChange(config.models[0]);
    }
    setIsOpen(false);
  };

  const handleModelSelect = (model: ModelConfig) => {
    onModelChange(model);
    setIsOpen(false);
  };

  const renderDropdown = () => {
    if (!isOpen || !buttonRect) return null;

    const dropdownStyle = {
      position: 'fixed' as const,
      top: buttonRect.bottom + 4,
      left: buttonRect.left,
      width: buttonRect.width,
      zIndex: 9999,
    };

    return (
      <div
        style={dropdownStyle}
        className={cn(
          "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-y-auto",
          isMobile ? "max-h-80" : "max-h-96"
        )}
      >
        <div className="p-2">
          {/* API配置列表 */}
          <div className="mb-3">
            <div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              API配置
            </div>
            {apiConfigs.map((config) => (
              <div
                key={config.id}
                className={cn(
                  "p-2 rounded cursor-pointer transition-colors touch-target",
                  currentApiConfig?.id === config.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                )}
                onClick={() => handleApiConfigSelect(config)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center",
                      isMobile ? "w-4 h-4" : "w-4 h-4"
                    )}>
                      <span className="text-white text-xs font-bold">
                        {config.provider?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className={cn(
                        "font-medium",
                        isMobile ? "text-xs" : "text-sm"
                      )}>{config.name}</div>
                      <div className={cn(
                        "text-slate-500 dark:text-slate-400",
                        isMobile ? "text-xs" : "text-xs"
                      )}>
                        {config.provider} • {config.models.length} 个模型
                      </div>
                    </div>
                  </div>
                  {currentApiConfig?.id === config.id && (
                    <Check className={cn(
                      "text-blue-600 dark:text-blue-400",
                      isMobile ? "w-3 h-3" : "w-4 h-4"
                    )} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 模型列表 */}
          {currentApiConfig && (
            <div>
              <div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                模型选择
              </div>
              {currentApiConfig.models.map((model) => (
                <div
                  key={model.id}
                  className={cn(
                    "p-2 rounded cursor-pointer transition-colors touch-target",
                    currentModel?.id === model.id
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  )}
                  onClick={() => handleModelSelect(model)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={cn(
                        "font-medium",
                        isMobile ? "text-xs" : "text-sm"
                      )}>{model.displayName}</div>
                      <div className={cn(
                        "text-slate-500 dark:text-slate-400",
                        isMobile ? "text-xs" : "text-xs"
                      )}>
                        {model.name} • 最大 {model.maxTokens} tokens
                      </div>
                    </div>
                    {currentModel?.id === model.id && (
                      <Check className={cn(
                        "text-green-600 dark:text-green-400",
                        isMobile ? "w-3 h-3" : "w-4 h-4"
                      )} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 设置按钮 */}
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              icon={<Settings className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />}
              onClick={() => {
                setIsOpen(false);
                onSettingsClick();
              }}
              className="w-full justify-start touch-target"
            >
              管理配置
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        <Button
          ref={buttonRef}
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "justify-between touch-target",
            isMobile ? "min-w-[160px]" : "min-w-[200px]"
          )}
          data-model-selector
        >
          <div className="flex items-center gap-2">
            <div className={cn(
              "bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center",
              isMobile ? "w-5 h-5" : "w-6 h-6"
            )}>
              <span className={cn(
                "text-white font-bold",
                isMobile ? "text-xs" : "text-xs"
              )}>
                {currentApiConfig?.provider?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="text-left">
              <div className={cn(
                "font-medium",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {currentModel?.displayName || '选择模型'}
              </div>
              <div className={cn(
                "text-slate-500 dark:text-slate-400",
                isMobile ? "text-xs" : "text-xs"
              )}>
                {currentApiConfig?.name || '未配置'}
              </div>
            </div>
          </div>
          <ChevronDown className={cn(
            "transition-transform",
            isMobile ? "w-3 h-3" : "w-4 h-4",
            isOpen ? 'rotate-180' : ''
          )} />
        </Button>
      </div>

      {/* 使用Portal渲染下拉框到body */}
      {isOpen && createPortal(renderDropdown(), document.body)}

      {/* 点击外部关闭 */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsOpen(false)}
        />,
        document.body
      )}
    </>
  );
}; 