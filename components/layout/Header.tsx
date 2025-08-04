import React from 'react';
import { ApiConfig, ModelConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { ModelSelector } from '@/components/ui/ModelSelector';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Menu, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/utils';

interface HeaderProps {
  apiConfigs: ApiConfig[];
  currentApiConfig: ApiConfig | null;
  currentModel: ModelConfig | null;
  onApiConfigChange: (config: ApiConfig) => void;
  onModelChange: (model: ModelConfig) => void;
  onSettingsClick: () => void;
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
  showSidebar: boolean;
  onHelpClick: () => void;
  isMobile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  apiConfigs,
  currentApiConfig,
  currentModel,
  onApiConfigChange,
  onModelChange,
  onSettingsClick,
  onSearch,
  onToggleSidebar,
  showSidebar,
  onHelpClick,
  isMobile = false,
}) => {
  return (
    <header className={cn(
      "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40",
      isMobile ? "mobile-header" : "h-16"
    )}>
      <div className={cn(
        "flex items-center justify-between h-full",
        isMobile ? "px-3 py-2" : "px-4"
      )}>
        {/* 左侧：菜单按钮和标题 */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={<Menu className="w-5 h-5" />}
            onClick={onToggleSidebar}
            className={cn(
              "touch-target",
              isMobile ? "block" : "lg:hidden"
            )}
          />
          
          <div className={cn(
            "flex items-center gap-2",
            isMobile ? "hidden" : "block"
          )}>
            <h1 className="text-lg font-bold gradient-text">LLM API Tools</h1>
          </div>
        </div>

        {/* 中间：模型选择器 */}
        <div className="flex-1 flex justify-center">
          <ModelSelector
            apiConfigs={apiConfigs}
            currentApiConfig={currentApiConfig}
            currentModel={currentModel}
            onApiConfigChange={onApiConfigChange}
            onModelChange={onModelChange}
            onSettingsClick={onSettingsClick}
            isMobile={isMobile}
          />
        </div>

        {/* 右侧：搜索、主题切换、设置 */}
        <div className="flex items-center gap-2">
          <SearchBar
            onSearch={onSearch}
            placeholder="搜索对话和消息..."
            className={cn(
              "touch-target",
              isMobile ? "hidden" : "block"
            )}
          />
          
          <ThemeToggle isMobile={isMobile} />
          
          <Button
            variant="ghost"
            size="sm"
            icon={<HelpCircle className="w-5 h-5" />}
            onClick={onHelpClick}
            className="touch-target"
          />
          
          <Button
            variant="ghost"
            size="sm"
            icon={<Settings className="w-5 h-5" />}
            onClick={onSettingsClick}
            className="touch-target"
          />
        </div>
      </div>
    </header>
  );
}; 