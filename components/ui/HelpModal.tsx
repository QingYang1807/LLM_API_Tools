import React from 'react';
import { X, Command, Plus, Send, Trash2, Search, Settings, Sidebar, Zap } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Command className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">帮助与快捷键</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                了解如何使用LLM API Tools
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="w-4 h-4" />}
            onClick={onClose}
          />
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-8">
          {/* 快捷键 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Command className="w-5 h-5" />
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
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm">{shortcut.description}</span>
                    </div>
                    <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 功能特性 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">功能特性</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-medium mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
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
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 使用提示
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 使用Shift+Enter可以在消息中换行</li>
              <li>• 点击消息右上角的菜单可以复制、下载或编辑消息</li>
              <li>• 在设置中可以配置多个API提供商</li>
              <li>• 支持导出对话记录为多种格式</li>
              <li>• 可以搜索历史对话内容</li>
              <li>• 使用Ctrl+M快速打开模型选择器</li>
              <li>• 右下角浮动按钮可快速切换模型</li>
            </ul>
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            版本 1.0.0 • 更多帮助请查看文档
          </p>
          <Button
            variant="primary"
            onClick={onClose}
          >
            知道了
          </Button>
        </div>
      </div>
    </div>
  );
}; 