import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Message as MessageType } from '@/types';
import { formatTime, copyToClipboard, downloadText } from '@/utils';
import { Button } from '@/components/ui/Button';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Copy, Download, User, Bot, Edit3, Check, X, MoreVertical } from 'lucide-react';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageProps {
  message: MessageType;
  onCopy?: (content: string) => void;
  onDownload?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  isEditing?: boolean;
  isMobile?: boolean;
}

export const Message: React.FC<MessageProps> = ({
  message,
  onCopy,
  onDownload,
  onEdit,
  isEditing = false,
  isMobile = false,
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  useEffect(() => {
    if (isEditingLocal && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditingLocal]);

  // 更新按钮位置信息
  useEffect(() => {
    if (showActions && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [showActions]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content);
      onCopy?.(message.content);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `message-${message.role}-${timestamp}.txt`;
    downloadText(message.content, filename);
    onDownload?.(message.content);
  };

  const handleEdit = () => {
    setIsEditingLocal(true);
    setEditContent(message.content);
  };

  const handleSave = () => {
    if (editContent.trim() !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditingLocal(false);
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditingLocal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderActionsMenu = () => {
    if (!showActions || !buttonRect) return null;

    const menuStyle = {
      position: 'fixed' as const,
      top: buttonRect.bottom + 4,
      right: window.innerWidth - buttonRect.right,
      zIndex: 9999,
    };

    return (
      <div
        style={menuStyle}
        className={cn(
          "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg",
          isMobile ? "min-w-28" : "min-w-32"
        )}
      >
        <div className="p-1">
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors touch-target"
          >
            <Copy className="w-3 h-3" />
            复制
          </button>
          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors touch-target"
          >
            <Download className="w-3 h-3" />
            下载
          </button>
          {isUser && (
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors touch-target"
            >
              <Edit3 className="w-3 h-3" />
              编辑
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'message-bubble mb-4 group',
          isUser ? 'user-message ml-auto' : 'assistant-message mr-auto',
          isUser ? (isMobile ? 'max-w-full' : 'max-w-3xl') : (isMobile ? 'max-w-full' : 'max-w-4xl')
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            'flex-shrink-0 rounded-full flex items-center justify-center',
            isUser ? 'bg-blue-600' : 'bg-slate-600',
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          )}>
            {isUser ? (
              <User className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
            ) : (
              <Bot className={cn("text-white", isMobile ? "w-3 h-3" : "w-4 h-4")} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                "font-medium",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {isUser ? '您' : 'AI助手'}
              </span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-slate-500 dark:text-slate-400",
                  isMobile ? "text-xs" : "text-xs"
                )}>
                  {formatTime(message.timestamp)}
                </span>
                
                <div className="relative">
                  <Button
                    ref={buttonRef}
                    variant="ghost"
                    size="sm"
                    icon={<MoreVertical className={cn("", isMobile ? "w-3 h-3" : "w-3 h-3")} />}
                    onClick={() => setShowActions(!showActions)}
                    className={cn(
                      "transition-opacity touch-target",
                      isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </div>
              </div>
            </div>
            
            {isEditingLocal ? (
              <div className="space-y-2">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    isMobile ? "text-sm" : "text-base"
                  )}
                  rows={Math.max(3, editContent.split('\n').length)}
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Check className="w-3 h-3" />}
                    onClick={handleSave}
                    className="touch-target"
                  >
                    保存
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-3 h-3" />}
                    onClick={handleCancel}
                    className="touch-target"
                  >
                    取消
                  </Button>
                  <span className={cn(
                    "text-slate-500",
                    isMobile ? "text-xs hidden" : "text-xs"
                  )}>
                    Cmd+Enter 保存，Esc 取消
                  </span>
                </div>
              </div>
            ) : (
              <div className={cn(
                "prose max-w-none",
                isMobile ? "prose-xs" : "prose-sm"
              )}>
                <MarkdownRenderer content={message.content} />
              </div>
            )}
            
            {isAssistant && !isEditingLocal && (
              <div className={cn(
                "flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 transition-opacity",
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Copy className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />}
                  onClick={handleCopy}
                  className="touch-target"
                >
                  {isMobile ? "" : "复制"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />}
                  onClick={handleDownload}
                  className="touch-target"
                >
                  {isMobile ? "" : "下载"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 使用Portal渲染操作菜单 */}
      {showActions && createPortal(renderActionsMenu(), document.body)}

      {/* 点击外部关闭菜单 */}
      {showActions && createPortal(
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setShowActions(false)}
        />,
        document.body
      )}
    </>
  );
}; 