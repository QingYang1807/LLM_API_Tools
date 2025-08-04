import React, { useRef, useEffect } from 'react';
import { ChatSession } from '@/types';
import { Message } from '@/components/chat/Message';
import { MessageInput } from '@/components/chat/MessageInput';
import { formatDate } from '@/utils';
import { cn } from '@/utils';

interface ChatInterfaceProps {
  session: ChatSession;
  onSendMessage: (message: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  session,
  onSendMessage,
  onEditMessage,
  isLoading,
  isMobile = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages]);

  const handleCopy = (content: string) => {
    // 可以添加复制成功的提示
    console.log('消息已复制到剪贴板');
  };

  const handleDownload = (content: string) => {
    // 可以添加下载成功的提示
    console.log('消息已下载');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 聊天头部 */}
      <div className="glass-effect border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{session.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {session.model.displayName} • {formatDate(session.updatedAt)}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400",
            isMobile ? "hidden" : "flex"
          )}>
            <span>温度: {session.config.temperature}</span>
            <span>•</span>
            <span>最大Token: {session.config.maxTokens}</span>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">开始新的对话</h3>
              <p className="text-slate-500 dark:text-slate-400 responsive-text">
                输入您的第一个消息，AI助手将为您提供帮助
              </p>
            </div>
          </div>
        ) : (
          session.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onEdit={onEditMessage}
              isMobile={isMobile}
            />
          ))
        )}
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="message-bubble assistant-message mr-auto max-w-4xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 safe-area-bottom">
        <MessageInput
          onSend={onSendMessage}
          disabled={isLoading}
          loading={isLoading}
          placeholder="输入您的消息..."
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}; 