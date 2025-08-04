import React from 'react';
import { X, Command, Plus, Send, Trash2, Search, Settings, Sidebar, Zap } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const shortcuts = [
  { key: 'Cmd/Ctrl + N', description: '新建对话', icon: Plus },
  { key: 'Cmd/Ctrl + Enter', description: '发送消息', icon: Send },
  { key: 'Cmd/Ctrl + K', description: '清空聊天', icon: Trash2 },
  { key: 'Cmd/Ctrl + B', description: '切换侧边栏', icon: Sidebar },
  { key: 'Cmd/Ctrl + F', description: '搜索', icon: Search },
  { key: 'Cmd/Ctrl + M', description: '模型选择器', icon: Zap },
  { key: 'Cmd/Ctrl + ,', description: '设置', icon: Settings },
  { key: 'Escape', description: '取消/退出', icon: X },
];

const features = [
  {
    title: '智能对话',
    description: '支持多种AI模型，实时流式响应，智能上下文理解',
    icon: '💬',
  },
  {
    title: 'Markdown渲染',
    description: '支持代码高亮、表格、链接等Markdown语法',
    icon: '📝',
  },
  {
    title: '消息编辑',
    description: '可以编辑已发送的消息，支持快捷键操作',
    icon: '✏️',
  },
  {
    title: '多会话管理',
    description: '支持多个对话会话，独立配置和状态管理',
    icon: '📁',
  },
  {
    title: '主题切换',
    description: '支持浅色、深色和跟随系统主题',
    icon: '🎨',
  },
  {
    title: '数据导出',
    description: '支持导出对话记录，多种格式可选',
    icon: '📤',
  },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, isMobile = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className={cn(
        "relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full overflow-y-auto",
        isMobile ? "max-h-[95vh]" : "max-w-2xl max-h-[90vh]"
      )}>
        {/* 头部 */}
        <div className={cn(
          "flex items-center justify-between border-b border-slate-200 dark:border-slate-700",
          isMobile ? "p-4" : "p-6"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center",
              isMobile ? "w-8 h-8" : "w-10 h-10"
            )}>
              <Command className={cn("text-white", isMobile ? "w-4 h-4" : "w-5 h-5")} />
            </div>
            <div>
              <h2 className={cn(
                "font-semibold",
                isMobile ? "text-lg" : "text-xl"
              )}>帮助与快捷键</h2>
              <p className={cn(
                "text-slate-500 dark:text-slate-400",
                isMobile ? "text-xs" : "text-sm"
              )}>
                了解如何使用LLM API Tools
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<X className={cn("", isMobile ? "w-4 h-4" : "w-4 h-4")} />}
            onClick={onClose}
            className="touch-target"
          />
        </div>

        {/* 内容 */}
        <div className={cn("space-y-6", isMobile ? "p-4" : "p-6")}>
          {/* 快捷键 */}
          <div>
            <h3 className={cn(
              "font-semibold mb-4 flex items-center gap-2",
              isMobile ? "text-base" : "text-lg"
            )}>
              <Command className={cn("", isMobile ? "w-4 h-4" : "w-5 h-5")} />
              快捷键
            </h3>
            <div className="grid gap-3">
              {shortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("text-slate-500", isMobile ? "w-3 h-3" : "w-4 h-4")} />
                      <span className={cn("", isMobile ? "text-xs" : "text-sm")}>{shortcut.description}</span>
                    </div>
                    <kbd className={cn(
                      "px-2 py-1 font-mono bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded",
                      isMobile ? "text-xs" : "text-xs"
                    )}>
                      {shortcut.key}
                    </kbd>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 功能特性 */}
          <div>
            <h3 className={cn(
              "font-semibold mb-4",
              isMobile ? "text-base" : "text-lg"
            )}>功能特性</h3>
            <div className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1" : "md:grid-cols-2"
            )}>
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className={cn("", isMobile ? "text-xl" : "text-2xl")}>{feature.icon}</span>
                    <div>
                      <h4 className={cn(
                        "font-medium mb-1",
                        isMobile ? "text-sm" : "text-base"
                      )}>{feature.title}</h4>
                      <p className={cn(
                        "text-slate-600 dark:text-slate-400",
                        isMobile ? "text-xs" : "text-sm"
                      )}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 使用提示 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className={cn(
              "font-medium text-blue-900 dark:text-blue-100 mb-2",
              isMobile ? "text-sm" : "text-base"
            )}>
              💡 使用提示
            </h4>
            <ul className={cn(
              "text-blue-800 dark:text-blue-200 space-y-1",
              isMobile ? "text-xs" : "text-sm"
            )}>
              <li>• 使用Shift+Enter可以在消息中换行</li>
              <li>• 点击消息右上角的菜单可以复制、下载或编辑消息</li>
              <li>• 在设置中可以配置多个API提供商</li>
              <li>• 支持导出对话记录为多种格式</li>
              <li>• 可以搜索历史对话内容</li>
              <li>• 使用Ctrl+M快速打开模型选择器</li>
              <li>• 右下角浮动按钮可快速切换模型</li>
              {isMobile && (
                <>
                  <li>• 移动端支持手势操作和触摸优化</li>
                  <li>• 侧边栏可滑动关闭，点击外部区域关闭</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* 底部 */}
        <div className={cn(
          "flex items-center justify-between border-t border-slate-200 dark:border-slate-700",
          isMobile ? "p-4 flex-col gap-3" : "p-6"
        )}>
          <p className={cn(
            "text-slate-500 dark:text-slate-400",
            isMobile ? "text-xs" : "text-sm"
          )}>
            版本 1.0.0 • 更多帮助请查看文档
          </p>
          <Button
            variant="primary"
            onClick={onClose}
            className="touch-target w-full"
          >
            知道了
          </Button>
        </div>
      </div>
    </div>
  );
}; 