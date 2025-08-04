import React, { useState } from 'react';
import { ApiConfig, ModelConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ModelSelector } from '@/components/ui/ModelSelector';
import { Settings, Search, X, Menu, HelpCircle } from 'lucide-react';
import { cn } from '@/utils';

interface HeaderProps {
  apiConfigs: ApiConfig[];
  currentApiConfig: ApiConfig | null;
  currentModel: ModelConfig | null;
  onApiConfigChange: (config: ApiConfig) => void;
  onModelChange: (model: ModelConfig) => void;
  onSettingsClick: () => void;
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
  showSidebar?: boolean;
  onHelpClick?: () => void;
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
  showSidebar = true,
  onHelpClick,
  isMobile = false,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="glass-effect border-b border-slate-200 dark:border-slate-700 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between">
        {/* 左侧：菜单按钮和标题 */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Menu className="w-5 h-5" />}
              onClick={onToggleSidebar}
              className={cn("touch-target", isMobile ? "block" : "lg:hidden")}
              title="切换侧边栏"
            />
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div className={cn("responsive-text font-semibold", isMobile ? "text-base" : "hidden sm:block")}>
              <h1 className="text-lg font-semibold">LLM API Tools</h1>
            </div>
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

        {/* 右侧：搜索栏 */}
        <div className={cn("max-w-md", isMobile ? "hidden" : "hidden md:block")}>
          {onSearch && (
            <SearchBar
              placeholder="搜索对话和消息..."
              onSearch={onSearch}
              showShortcut={false}
            />
          )}
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-2">
          {/* 移动端搜索按钮 */}
          {onSearch && (
            <Button
              variant="ghost"
              size="sm"
              icon={showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              onClick={() => setShowSearch(!showSearch)}
              className={cn("touch-target", isMobile ? "block" : "md:hidden")}
              title="搜索"
            />
          )}

          {/* 帮助按钮 */}
          {onHelpClick && (
            <Button
              variant="ghost"
              size="sm"
              icon={<HelpCircle className="w-4 h-4" />}
              onClick={onHelpClick}
              className="touch-target"
              title="帮助"
            />
          )}

          {/* 主题切换 */}
          <ThemeToggle />

          {/* 设置按钮 */}
          <Button
            variant="ghost"
            size="sm"
            icon={<Settings className="w-4 h-4" />}
            onClick={onSettingsClick}
            className="touch-target"
            title="设置"
          />
        </div>
      </div>

      {/* 移动端搜索栏 */}
      {showSearch && onSearch && (
        <div className="mt-3 md:hidden">
          <SearchBar
            placeholder="搜索对话和消息..."
            onSearch={onSearch}
            showShortcut={false}
            autoFocus={true}
          />
        </div>
      )}

      {/* 状态指示器 */}
      <div className={cn(
        "flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400",
        isMobile ? "flex-wrap gap-2" : ""
      )}>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>已连接</span>
        </div>
        
        {currentModel && (
          <div className="flex items-center gap-1">
            <span>模型:</span>
            <span className="font-medium">{currentModel.displayName}</span>
          </div>
        )}
        
        {currentApiConfig && (
          <div className="flex items-center gap-1">
            <span>提供商:</span>
            <span className="font-medium">{currentApiConfig.provider}</span>
          </div>
        )}
      </div>
    </header>
  );
}; 