import React, { useState, useRef, useEffect } from 'react';
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
}

export const Message: React.FC<MessageProps> = ({
  message,
  onCopy,
  onDownload,
  onEdit,
  isEditing = false,
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(isEditing);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'message-bubble mb-4 group',
        isUser ? 'user-message ml-auto' : 'assistant-message mr-auto',
        isUser ? 'max-w-3xl' : 'max-w-4xl'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-blue-600' : 'bg-slate-600'
        )}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isUser ? '您' : 'AI助手'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatTime(message.timestamp)}
              </span>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<MoreVertical className="w-3 h-3" />}
                  onClick={() => setShowActions(!showActions)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
                
                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 min-w-32"
                    >
                      <div className="p-1">
                        <button
                          onClick={handleCopy}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          复制
                        </button>
                        <button
                          onClick={handleDownload}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          下载
                        </button>
                        {isUser && (
                          <button
                            onClick={handleEdit}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            编辑
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={Math.max(3, editContent.split('\n').length)}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Check className="w-3 h-3" />}
                  onClick={handleSave}
                >
                  保存
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X className="w-3 h-3" />}
                  onClick={handleCancel}
                >
                  取消
                </Button>
                <span className="text-xs text-slate-500">
                  Cmd+Enter 保存，Esc 取消
                </span>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <MarkdownRenderer content={message.content} />
            </div>
          )}
          
          {isAssistant && !isEditingLocal && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                icon={<Copy className="w-4 h-4" />}
                onClick={handleCopy}
              >
                复制
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handleDownload}
              >
                下载
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 