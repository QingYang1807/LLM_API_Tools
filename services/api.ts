import { ApiConfig, ModelConfig, Message, ZhipuApiResponse } from '@/types';

export class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async sendMessage(
    messages: Message[],
    model: ModelConfig,
    stream: boolean = false
  ): Promise<ZhipuApiResponse | ReadableStream> {
    const url = this.config.baseUrl;
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };

    const body = {
      model: model.name,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: model.maxTokens,
      temperature: model.temperature,
      top_p: model.topP,
      frequency_penalty: model.frequencyPenalty,
      presence_penalty: model.presencePenalty,
      stream: stream,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      if (stream) {
        return response.body as ReadableStream;
      } else {
        const data = await response.json();
        return data as ZhipuApiResponse;
      }
    } catch (error) {
      console.error('API调用错误:', error);
      throw error;
    }
  }

  async sendMessageStream(
    messages: Message[],
    model: ModelConfig,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const stream = await this.sendMessage(messages, model, true) as ReadableStream;
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete(fullResponse);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onComplete(fullResponse);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0]?.delta?.content) {
                const content = parsed.choices[0].delta.content;
                fullResponse += content;
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error);
    }
  }
}

// 默认智谱AI配置
export const defaultZhipuConfig: ApiConfig = {
  id: 'zhipu-default',
  name: '智谱AI',
  provider: 'zhipu',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  apiKey: '',
  models: [
    {
      id: 'glm-4.5',
      name: 'glm-4.5',
      displayName: 'GLM-4.5',
      maxTokens: 4096,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
      isDefault: true,
    },
    {
      id: 'glm-4.5-air',
      name: 'glm-4.5-air',
      displayName: 'GLM-4.5-Air',
      maxTokens: 4096,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
      isDefault: false,
    },
  ],
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}; 