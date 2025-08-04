'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastContainer } from '@/components/ui/Toast';
import { KeyboardShortcuts } from '@/components/ui/KeyboardShortcuts';
import { HelpModal } from '@/components/ui/HelpModal';
import { QuickModelSwitch } from '@/components/ui/QuickModelSwitch';
import { ApiConfig, ChatSession, Message, ModelConfig, Notification, SearchResult } from '@/types';
import { StorageService } from '@/services/storage';
import { ApiService, defaultZhipuConfig } from '@/services/api';
import { generateId, searchInText, calculateRelevance } from '@/utils';

export default function HomePage() {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([]);
  const [currentApiConfig, setCurrentApiConfig] = useState<ApiConfig | null>(null);
  const [currentModel, setCurrentModel] = useState<ModelConfig | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 检测设备类型
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // 移动端默认隐藏侧边栏
      if (width < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  // 点击外部关闭侧边栏（移动端）
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, showSidebar]);

  // 添加通知
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  // 移除通知
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // 初始化数据
  useEffect(() => {
    const configs = StorageService.getApiConfigs();
    const sessions = StorageService.getChatSessions();

    if (configs.length === 0) {
      // 如果没有配置，添加默认的智谱AI配置
      StorageService.addApiConfig(defaultZhipuConfig);
      setApiConfigs([defaultZhipuConfig]);
      setCurrentApiConfig(defaultZhipuConfig);
      setCurrentModel(defaultZhipuConfig.models[0]);
      addNotification({
        type: 'info',
        title: '欢迎使用',
        message: '已为您配置默认的智谱AI API，您可以在设置中修改配置。',
      });
    } else {
      setApiConfigs(configs);
      const defaultConfig = configs.find(c => c.isDefault) || configs[0];
      setCurrentApiConfig(defaultConfig);
      setCurrentModel(defaultConfig.models[0]);
    }

    setChatSessions(sessions);
    if (sessions.length > 0) {
      setCurrentSession(sessions[0]);
    }
  }, [addNotification]);

  // 搜索功能
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];

    chatSessions.forEach(session => {
      session.messages.forEach(message => {
        if (searchInText(message.content, query)) {
          results.push({
            sessionId: session.id,
            sessionTitle: session.title,
            messageId: message.id,
            messageContent: message.content,
            timestamp: message.timestamp,
            relevance: calculateRelevance(message.content, query),
          });
        }
      });
    });

    // 按相关性排序
    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results);
    setIsSearching(false);
  }, [chatSessions]);

  // 创建新会话
  const createNewSession = useCallback(() => {
    if (!currentApiConfig || !currentModel) {
      addNotification({
        type: 'error',
        title: '创建失败',
        message: '请先配置API设置。',
      });
      return;
    }

    const newSession: ChatSession = {
      id: generateId(),
      title: '新对话',
      messages: [],
      config: {
        maxTokens: currentModel.maxTokens,
        temperature: currentModel.temperature,
        topP: currentModel.topP,
        frequencyPenalty: currentModel.frequencyPenalty,
        presencePenalty: currentModel.presencePenalty,
        stream: true,
      },
      apiConfig: currentApiConfig,
      model: currentModel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    StorageService.addChatSession(newSession);
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    
    // 移动端创建新会话后自动隐藏侧边栏
    if (isMobile) {
      setShowSidebar(false);
    }
    
    addNotification({
      type: 'success',
      title: '创建成功',
      message: '新对话已创建。',
    });
  }, [currentApiConfig, currentModel, addNotification, isMobile]);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!currentSession || !currentApiConfig || !currentModel) {
      addNotification({
        type: 'error',
        title: '发送失败',
        message: '请先选择对话和配置。',
      });
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      model: currentModel.name,
    };

    // 添加用户消息
    const updatedMessages = [...currentSession.messages, userMessage];
    const updatedSession = {
      ...currentSession,
      messages: updatedMessages,
      updatedAt: new Date(),
    };

    // 更新会话
    StorageService.updateChatSession(updatedSession);
    setCurrentSession(updatedSession);
    setChatSessions(prev => 
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    );

    setIsLoading(true);

    try {
      const apiService = new ApiService(currentApiConfig);
      let assistantMessage: Message;

      if (currentSession.config.stream) {
        // 流式响应
        let streamedContent = '';
        assistantMessage = {
          id: generateId(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          model: currentModel.name,
        };

        // 添加空的助手消息
        const sessionWithEmptyMessage = {
          ...updatedSession,
          messages: [...updatedMessages, assistantMessage],
        };
        StorageService.updateChatSession(sessionWithEmptyMessage);
        setCurrentSession(sessionWithEmptyMessage);

        await apiService.sendMessageStream(
          updatedMessages,
          currentModel,
          (chunk) => {
            streamedContent += chunk;
            const messageWithChunk = {
              ...assistantMessage,
              content: streamedContent,
            };
            const sessionWithChunk = {
              ...sessionWithEmptyMessage,
              messages: [...updatedMessages, messageWithChunk],
            };
            StorageService.updateChatSession(sessionWithChunk);
            setCurrentSession(sessionWithChunk);
          },
          (fullResponse) => {
            const finalMessage = {
              ...assistantMessage,
              content: fullResponse,
            };
            const finalSession = {
              ...sessionWithEmptyMessage,
              messages: [...updatedMessages, finalMessage],
              updatedAt: new Date(),
            };
            StorageService.updateChatSession(finalSession);
            setCurrentSession(finalSession);
            setChatSessions(prev => 
              prev.map(s => s.id === finalSession.id ? finalSession : s)
            );
            addNotification({
              type: 'success',
              title: '回复完成',
              message: 'AI助手已回复您的消息。',
            });
          },
          (error) => {
            console.error('流式响应错误:', error);
            addNotification({
              type: 'error',
              title: '发送失败',
              message: error.message,
            });
          }
        );
      } else {
        // 非流式响应
        const response = await apiService.sendMessage(updatedMessages, currentModel);
        const responseData = response as any;
        
        assistantMessage = {
          id: generateId(),
          role: 'assistant',
          content: responseData.choices[0].message.content,
          timestamp: new Date(),
          model: currentModel.name,
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedMessages, assistantMessage],
          updatedAt: new Date(),
        };

        StorageService.updateChatSession(finalSession);
        setCurrentSession(finalSession);
        setChatSessions(prev => 
          prev.map(s => s.id === finalSession.id ? finalSession : s)
        );
        addNotification({
          type: 'success',
          title: '回复完成',
          message: 'AI助手已回复您的消息。',
        });
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      addNotification({
        type: 'error',
        title: '发送失败',
        message: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, currentApiConfig, currentModel, addNotification]);

  // 编辑消息
  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!currentSession) return;

    const updatedMessages = currentSession.messages.map(msg =>
      msg.id === messageId ? { ...msg, content: newContent } : msg
    );

    const updatedSession = {
      ...currentSession,
      messages: updatedMessages,
      updatedAt: new Date(),
    };

    StorageService.updateChatSession(updatedSession);
    setCurrentSession(updatedSession);
    setChatSessions(prev => 
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    );
    addNotification({
      type: 'success',
      title: '编辑成功',
      message: '消息已更新。',
    });
  }, [currentSession, addNotification]);

  // 切换会话
  const switchSession = useCallback((session: ChatSession) => {
    setCurrentSession(session);
    setCurrentApiConfig(session.apiConfig);
    setCurrentModel(session.model);
    
    // 移动端切换会话后自动隐藏侧边栏
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile]);

  // 删除会话
  const deleteSession = useCallback((sessionId: string) => {
    StorageService.deleteChatSession(sessionId);
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (currentSession?.id === sessionId) {
      const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSession(remainingSessions[0]);
        setCurrentApiConfig(remainingSessions[0].apiConfig);
        setCurrentModel(remainingSessions[0].model);
      } else {
        setCurrentSession(null);
      }
    }
    addNotification({
      type: 'success',
      title: '删除成功',
      message: '对话已删除。',
    });
  }, [currentSession, chatSessions, addNotification]);

  // 更新API配置
  const updateApiConfig = useCallback((config: ApiConfig) => {
    StorageService.updateApiConfig(config);
    setApiConfigs(prev => prev.map(c => c.id === config.id ? config : c));
    setCurrentApiConfig(config);
    setCurrentModel(config.models[0]);
    addNotification({
      type: 'success',
      title: '配置更新',
      message: 'API配置已更新。',
    });
  }, [addNotification]);

  // 切换API配置
  const handleApiConfigChange = useCallback((config: ApiConfig) => {
    setCurrentApiConfig(config);
    if (config.models.length > 0) {
      setCurrentModel(config.models[0]);
    }
    addNotification({
      type: 'success',
      title: '配置切换',
      message: `已切换到 ${config.name}。`,
    });
  }, [addNotification]);

  // 切换模型
  const handleModelChange = useCallback((model: ModelConfig) => {
    setCurrentModel(model);
    addNotification({
      type: 'success',
      title: '模型切换',
      message: `已切换到 ${model.displayName}。`,
    });
  }, [addNotification]);

  // 清空聊天
  const clearChat = useCallback(() => {
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      messages: [],
      updatedAt: new Date(),
    };
    
    StorageService.updateChatSession(updatedSession);
    setCurrentSession(updatedSession);
    setChatSessions(prev => 
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    );
    addNotification({
      type: 'success',
      title: '清空成功',
      message: '对话已清空。',
    });
  }, [currentSession, addNotification]);

  // 快捷键处理
  const handleEscape = useCallback(() => {
    setShowSettings(false);
    setShowHelp(false);
    if (isMobile && showSidebar) {
      setShowSidebar(false);
    }
  }, [isMobile, showSidebar]);

  // 切换侧边栏
  const toggleSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 快捷键管理 */}
      <KeyboardShortcuts
        onNewChat={createNewSession}
        onToggleSidebar={toggleSidebar}
        onSearch={() => {
          // 触发搜索焦点
          const searchInput = document.querySelector('input[placeholder*="搜索"]') as HTMLInputElement;
          searchInput?.focus();
        }}
        onSettings={() => setShowSettings(true)}
        onClearChat={clearChat}
        onEscape={handleEscape}
        onModelSelector={() => {
          // 触发模型选择器
          const modelSelector = document.querySelector('[data-model-selector]') as HTMLButtonElement;
          modelSelector?.click();
        }}
      />

      <Header 
        apiConfigs={apiConfigs}
        currentApiConfig={currentApiConfig}
        currentModel={currentModel}
        onApiConfigChange={handleApiConfigChange}
        onModelChange={handleModelChange}
        onSettingsClick={() => setShowSettings(true)}
        onSearch={handleSearch}
        onToggleSidebar={toggleSidebar}
        showSidebar={showSidebar}
        onHelpClick={() => setShowHelp(true)}
        isMobile={isMobile}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* 移动端遮罩层 */}
        {isMobile && showSidebar && (
          <div 
            className="overlay"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* 侧边栏 */}
        <div 
          ref={sidebarRef}
          className={`
            ${isMobile ? 'sidebar-mobile' : 'sidebar-desktop'}
            ${isTablet ? 'sidebar-tablet' : ''}
            ${isMobile && !showSidebar ? '-translate-x-full' : ''}
            ${!isMobile ? 'flex-shrink-0' : ''}
          `}
        >
          <Sidebar
            chatSessions={chatSessions}
            currentSession={currentSession}
            apiConfigs={apiConfigs}
            currentApiConfig={currentApiConfig}
            currentModel={currentModel}
            onNewChat={createNewSession}
            onSwitchSession={switchSession}
            onDeleteSession={deleteSession}
            onUpdateApiConfig={updateApiConfig}
            showSettings={showSettings}
            onCloseSettings={() => setShowSettings(false)}
            onOpenSettings={() => setShowSettings(true)}
            isMobile={isMobile}
          />
        </div>
        
        {/* 主内容区域 */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentSession ? (
            <ChatInterface
              session={currentSession}
              onSendMessage={sendMessage}
              onEditMessage={editMessage}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              <div className="text-center max-w-md w-full">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 gradient-text">欢迎使用LLM API Tools</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 responsive-text">
                  开始一个新的对话，体验智能AI助手。支持多种模型和实时对话。
                </p>
                <button
                  onClick={createNewSession}
                  className="btn-primary button-hover touch-target"
                >
                  开始新对话
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast通知 */}
      <ToastContainer 
        toasts={notifications.map(notification => ({
          ...notification,
          onClose: removeNotification,
        }))} 
        onClose={removeNotification}
        isMobile={isMobile}
      />

      {/* 快速模型切换 */}
      <QuickModelSwitch
        apiConfigs={apiConfigs}
        currentApiConfig={currentApiConfig}
        currentModel={currentModel}
        onApiConfigChange={handleApiConfigChange}
        onModelChange={handleModelChange}
        onSettingsClick={() => setShowSettings(true)}
        isMobile={isMobile}
      />

      {/* 帮助模态框 */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} isMobile={isMobile} />
    </div>
  );
} 