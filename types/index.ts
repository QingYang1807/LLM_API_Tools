export interface ApiConfig {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  apiKey: string;
  models: ModelConfig[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelConfig {
  id: string;
  name: string;
  displayName: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  isDefault: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model: string;
  isEditing?: boolean;
  originalContent?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  config: {
    maxTokens: number;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    stream: boolean;
  };
  apiConfig: ApiConfig;
  model: ModelConfig;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  tags?: string[];
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
}

export interface UserPreferences {
  theme: ThemeConfig;
  shortcuts: {
    newChat: string;
    sendMessage: string;
    clearChat: string;
    toggleSidebar: string;
  };
  autoSave: boolean;
  autoScroll: boolean;
  showLineNumbers: boolean;
  fontSize: number;
  compactMode: boolean;
}

export interface SearchResult {
  sessionId: string;
  sessionTitle: string;
  messageId: string;
  messageContent: string;
  timestamp: Date;
  relevance: number;
}

export interface ExportOptions {
  format: 'json' | 'markdown' | 'txt' | 'html';
  includeMetadata: boolean;
  includeTimestamps: boolean;
  sessionIds: string[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

export interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ZhipuApiResponse {
  id: string;
  request_id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
      audio?: {
        id: string;
        data: string;
        expires_at: string;
      };
      tool_calls?: any[];
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    prompt_tokens_details?: {
      cached_tokens: number;
    };
    total_tokens: number;
  };
  video_result?: Array<{
    url: string;
    cover_image_url: string;
  }>;
  web_search?: Array<{
    icon: string;
    title: string;
    link: string;
    media: string;
    publish_date: string;
    content: string;
    refer: string;
  }>;
  content_filter?: Array<{
    role: string;
    level: number;
  }>;
} 