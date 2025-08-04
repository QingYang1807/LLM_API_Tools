import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Send, Paperclip, Smile, Mic, StopCircle } from 'lucide-react';
import { cn } from '@/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
  loading = false,
  placeholder = '输入您的消息...',
  className,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxRows = 6;
  const minRows = 1;

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const scrollHeight = textarea.scrollHeight;
      const newRows = Math.min(maxRows, Math.max(minRows, Math.ceil(scrollHeight / lineHeight)));
      setRows(newRows);
    }
  }, [message]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !loading) {
      onSend(trimmedMessage);
      setMessage('');
      setRows(1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 这里可以添加文件处理逻辑
      console.log('文件上传:', file.name);
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      // 开始录音
      setIsRecording(true);
      // 这里可以添加录音逻辑
    } else {
      // 停止录音
      setIsRecording(false);
      // 这里可以添加停止录音逻辑
    }
  };

  const isSendDisabled = !message.trim() || disabled || loading;

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-end gap-2 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-lg">
        {/* 文件上传按钮 */}
        <label className="flex-shrink-0">
          <input
            type="file"
            accept=".txt,.md,.json,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Paperclip className="w-4 h-4" />}
            className="w-10 h-10 p-0"
            title="上传文件"
          />
        </label>

        {/* 文本输入区域 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled || loading}
            className={cn(
              'w-full resize-none border-none outline-none bg-transparent',
              'text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'focus:ring-0 focus:border-none',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{
              minHeight: `${minRows * 1.5}rem`,
              maxHeight: `${maxRows * 1.5}rem`,
            }}
          />
          
          {/* 字符计数 */}
          {message.length > 0 && (
            <div className="absolute bottom-0 right-0 text-xs text-slate-400 dark:text-slate-500">
              {message.length}
            </div>
          )}
        </div>

        {/* 语音录制按钮 */}
        <Button
          variant="ghost"
          size="sm"
          icon={isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          onClick={handleVoiceRecord}
          className={cn(
            'w-10 h-10 p-0',
            isRecording && 'text-red-500 animate-pulse'
          )}
          title={isRecording ? '停止录音' : '语音输入'}
        />

        {/* 表情按钮 */}
        <Button
          variant="ghost"
          size="sm"
          icon={<Smile className="w-4 h-4" />}
          className="w-10 h-10 p-0"
          title="插入表情"
        />

        {/* 发送按钮 */}
        <Button
          variant="primary"
          size="sm"
          icon={<Send className="w-4 h-4" />}
          onClick={handleSend}
          disabled={isSendDisabled}
          loading={loading}
          className="w-10 h-10 p-0"
          title="发送消息 (Enter)"
        />
      </div>

      {/* 快捷键提示 */}
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
        Enter 发送，Shift+Enter 换行
      </div>

      {/* 录音状态指示器 */}
      {isRecording && (
        <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">正在录音...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 