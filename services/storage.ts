import { ApiConfig, ChatSession, Message } from '@/types';
import { parseDates } from '@/utils';

const STORAGE_KEYS = {
  API_CONFIGS: 'llm_api_configs',
  CHAT_SESSIONS: 'llm_chat_sessions',
  SETTINGS: 'llm_settings',
} as const;

export class StorageService {
  // API配置管理
  static getApiConfigs(): ApiConfig[] {
    try {
      const configs = localStorage.getItem(STORAGE_KEYS.API_CONFIGS);
      return configs ? parseDates(JSON.parse(configs)) : [];
    } catch (error) {
      console.error('获取API配置失败:', error);
      return [];
    }
  }

  static saveApiConfigs(configs: ApiConfig[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.API_CONFIGS, JSON.stringify(configs));
    } catch (error) {
      console.error('保存API配置失败:', error);
    }
  }

  static addApiConfig(config: ApiConfig): void {
    const configs = this.getApiConfigs();
    configs.push(config);
    this.saveApiConfigs(configs);
  }

  static updateApiConfig(config: ApiConfig): void {
    const configs = this.getApiConfigs();
    const index = configs.findIndex(c => c.id === config.id);
    if (index !== -1) {
      configs[index] = config;
      this.saveApiConfigs(configs);
    }
  }

  static deleteApiConfig(configId: string): void {
    const configs = this.getApiConfigs();
    const filtered = configs.filter(c => c.id !== configId);
    this.saveApiConfigs(filtered);
  }

  // 聊天会话管理
  static getChatSessions(): ChatSession[] {
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
      return sessions ? parseDates(JSON.parse(sessions)) : [];
    } catch (error) {
      console.error('获取聊天会话失败:', error);
      return [];
    }
  }

  static saveChatSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('保存聊天会话失败:', error);
    }
  }

  static addChatSession(session: ChatSession): void {
    const sessions = this.getChatSessions();
    sessions.unshift(session);
    this.saveChatSessions(sessions);
  }

  static updateChatSession(session: ChatSession): void {
    const sessions = this.getChatSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index !== -1) {
      sessions[index] = session;
      this.saveChatSessions(sessions);
    }
  }

  static deleteChatSession(sessionId: string): void {
    const sessions = this.getChatSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    this.saveChatSessions(filtered);
  }

  static getChatSession(sessionId: string): ChatSession | null {
    const sessions = this.getChatSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  // 设置管理
  static getSettings(): any {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? parseDates(JSON.parse(settings)) : {};
    } catch (error) {
      console.error('获取设置失败:', error);
      return {};
    }
  }

  static saveSettings(settings: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }

  // 数据清理
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.API_CONFIGS);
      localStorage.removeItem(STORAGE_KEYS.CHAT_SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('清理数据失败:', error);
    }
  }

  // 数据导出
  static exportData(): string {
    try {
      const data = {
        apiConfigs: this.getApiConfigs(),
        chatSessions: this.getChatSessions(),
        settings: this.getSettings(),
        exportDate: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('导出数据失败:', error);
      return '';
    }
  }

  // 数据导入
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.apiConfigs) {
        this.saveApiConfigs(data.apiConfigs);
      }
      
      if (data.chatSessions) {
        this.saveChatSessions(data.chatSessions);
      }
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
} 