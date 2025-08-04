import React, { useState } from 'react';
import { ApiConfig, ModelConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChevronDown, Check, Settings } from 'lucide-react';

interface ModelSelectorProps {
  apiConfigs: ApiConfig[];
  currentApiConfig: ApiConfig | null;
  currentModel: ModelConfig | null;
  onApiConfigChange: (config: ApiConfig) => void;
  onModelChange: (model: ModelConfig) => void;
  onSettingsClick: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  apiConfigs,
  currentApiConfig,
  currentModel,
  onApiConfigChange,
  onModelChange,
  onSettingsClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 监听快捷键
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[200px] justify-between"
        data-model-selector
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {currentApiConfig?.provider?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">
              {currentModel?.displayName || '选择模型'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentApiConfig?.name || '未配置'}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {/* API配置列表 */}
            <div className="mb-3">
              <div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                API配置
              </div>
              {apiConfigs.map((config) => (
                <div
                  key={config.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    currentApiConfig?.id === config.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() => handleApiConfigSelect(config)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {config.provider?.charAt(0) || 'A'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{config.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {config.provider} • {config.models.length} 个模型
                        </div>
                      </div>
                    </div>
                    {currentApiConfig?.id === config.id && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      currentModel?.id === model.id
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{model.displayName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {model.name} • 最大 {model.maxTokens} tokens
                        </div>
                      </div>
                      {currentModel?.id === model.id && (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                icon={<Settings className="w-4 h-4" />}
                onClick={() => {
                  setIsOpen(false);
                  onSettingsClick();
                }}
                className="w-full justify-start"
              >
                管理配置
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}; 