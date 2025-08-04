import React, { useState } from 'react';
import { ApiConfig, ModelConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChevronUp, Settings, Zap } from 'lucide-react';

interface QuickModelSwitchProps {
  apiConfigs: ApiConfig[];
  currentApiConfig: ApiConfig | null;
  currentModel: ModelConfig | null;
  onApiConfigChange: (config: ApiConfig) => void;
  onModelChange: (model: ModelConfig) => void;
  onSettingsClick: () => void;
}

export const QuickModelSwitch: React.FC<QuickModelSwitchProps> = ({
  apiConfigs,
  currentApiConfig,
  currentModel,
  onApiConfigChange,
  onModelChange,
  onSettingsClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuickSwitch = (config: ApiConfig, model: ModelConfig) => {
    onApiConfigChange(config);
    onModelChange(model);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded && (
        <Card className="mb-2 p-3 bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              快速切换
            </div>
            {apiConfigs.map((config) => (
              <div key={config.id} className="space-y-1">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {config.name}
                </div>
                <div className="flex flex-wrap gap-1">
                  {config.models.slice(0, 3).map((model) => (
                    <Button
                      key={model.id}
                      variant={currentModel?.id === model.id ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => handleQuickSwitch(config, model)}
                      className="text-xs h-6 px-2"
                    >
                      {model.displayName}
                    </Button>
                  ))}
                  {config.models.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSettingsClick}
                      className="text-xs h-6 px-2"
                    >
                      +{config.models.length - 3}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="ghost"
                size="sm"
                icon={<Settings className="w-3 h-3" />}
                onClick={onSettingsClick}
                className="w-full text-xs h-6"
              >
                管理配置
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      <Button
        variant="primary"
        size="lg"
        icon={isExpanded ? <ChevronUp className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 rounded-full shadow-lg"
        title="快速切换模型"
      />
    </div>
  );
}; 