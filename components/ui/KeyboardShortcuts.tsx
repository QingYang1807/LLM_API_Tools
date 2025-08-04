import React, { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface KeyboardShortcutsProps {
  onNewChat?: () => void;
  onSendMessage?: () => void;
  onClearChat?: () => void;
  onToggleSidebar?: () => void;
  onSearch?: () => void;
  onSettings?: () => void;
  onEscape?: () => void;
  onModelSelector?: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onNewChat,
  onSendMessage,
  onClearChat,
  onToggleSidebar,
  onSearch,
  onSettings,
  onEscape,
  onModelSelector,
}) => {
  // 新建对话: Cmd/Ctrl + N
  useHotkeys('cmd+n, ctrl+n', (e) => {
    e.preventDefault();
    onNewChat?.();
  }, { enableOnFormTags: true });

  // 发送消息: Cmd/Ctrl + Enter
  useHotkeys('cmd+enter, ctrl+enter', (e) => {
    e.preventDefault();
    onSendMessage?.();
  }, { enableOnFormTags: true });

  // 清空聊天: Cmd/Ctrl + K
  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    onClearChat?.();
  }, { enableOnFormTags: true });

  // 切换侧边栏: Cmd/Ctrl + B
  useHotkeys('cmd+b, ctrl+b', (e) => {
    e.preventDefault();
    onToggleSidebar?.();
  }, { enableOnFormTags: true });

  // 搜索: Cmd/Ctrl + F
  useHotkeys('cmd+f, ctrl+f', (e) => {
    e.preventDefault();
    onSearch?.();
  }, { enableOnFormTags: true });

  // 设置: Cmd/Ctrl + ,
  useHotkeys('cmd+,, ctrl+,', (e) => {
    e.preventDefault();
    onSettings?.();
  }, { enableOnFormTags: true });

  // 模型选择器: Cmd/Ctrl + M
  useHotkeys('cmd+m, ctrl+m', (e) => {
    e.preventDefault();
    onModelSelector?.();
  }, { enableOnFormTags: true });

  // 退出/取消: Escape
  useHotkeys('escape', (e) => {
    e.preventDefault();
    onEscape?.();
  }, { enableOnFormTags: true });

  return null; // 这是一个纯功能组件，不渲染任何UI
}; 