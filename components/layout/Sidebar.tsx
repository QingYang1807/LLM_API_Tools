import React, { useState } from 'react';
import { ApiConfig, ChatSession, ModelConfig } from '@/types';
import { Button } from '@/components/ui/Button';
import { ApiConfigForm } from '@/components/settings/ApiConfigForm';
import { Card } from '@/components/ui/Card';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Trash2, 
  ChevronRight,
  X,
  Download,
  Upload
} from 'lucide-react';
import { formatDate, truncateText } from '@/utils';
import { StorageService } from '@/services/storage';

interface SidebarProps {
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  apiConfigs: ApiConfig[];
  currentApiConfig: ApiConfig | null;
  currentModel: ModelConfig | null;
  onNewChat: () => void;
  onSwitchSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateApiConfig: (config: ApiConfig) => void;
  showSettings: boolean;
  onCloseSettings: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  currentSession,
  apiConfigs,
  currentApiConfig,
  currentModel,
  onNewChat,
  onSwitchSession,
  onDeleteSession,
  onUpdateApiConfig,
  showSettings,
  onCloseSettings,
  onOpenSettings,
}) => {
  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);

  const handleExportData = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `llm-api-tools-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = StorageService.importData(content);
        if (success) {
          alert('数据导入成功！请刷新页面。');
          window.location.reload();
        } else {
          alert('数据导入失败，请检查文件格式。');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      StorageService.clearAllData();
      alert('数据已清除，请刷新页面。');
      window.location.reload();
    }
  };

  if (showSettings) {
    return (
      <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">设置</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="w-4 h-4" />}
              onClick={onCloseSettings}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* API配置 */}
            <div>
              <h3 className="text-md font-medium mb-4">API配置</h3>
              <div className="space-y-3">
                {apiConfigs.map((config) => (
                  <Card key={config.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{config.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {config.provider} • {config.models.length} 个模型
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingConfig(config)}
                      >
                        编辑
                      </Button>
                    </div>
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setEditingConfig({} as ApiConfig)}
                  className="w-full"
                >
                  添加配置
                </Button>
              </div>
            </div>

            {/* 数据管理 */}
            <div>
              <h3 className="text-md font-medium mb-4">数据管理</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleExportData}
                  className="w-full"
                >
                  导出数据
                </Button>
                
                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <div className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Upload className="w-4 h-4" />}
                      className="w-full"
                      onClick={() => {
                        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      导入数据
                    </Button>
                  </div>
                </label>
                
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleClearData}
                  className="w-full"
                >
                  清除所有数据
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (editingConfig !== null) {
    return (
      <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingConfig.id ? '编辑配置' : '新建配置'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="w-4 h-4" />}
              onClick={() => setEditingConfig(null)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ApiConfigForm
            config={editingConfig.id ? editingConfig : undefined}
            onSave={(config) => {
              onUpdateApiConfig(config);
              setEditingConfig(null);
            }}
            onCancel={() => setEditingConfig(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* 新建对话按钮 */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onNewChat}
          className="w-full"
        >
          新建对话
        </Button>
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-y-auto">
        {chatSessions.length === 0 ? (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无对话</p>
            <p className="text-sm">点击"新建对话"开始</p>
          </div>
        ) : (
          <div className="p-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`
                  group relative p-3 rounded-lg cursor-pointer transition-colors
                  ${currentSession?.id === session.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }
                `}
                onClick={() => onSwitchSession(session)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {session.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {session.messages.length > 0
                        ? truncateText(session.messages[session.messages.length - 1].content, 50)
                        : '暂无消息'
                      }
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-3 h-3" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      title="删除对话"
                    />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          icon={<Settings className="w-4 h-4" />}
          onClick={onOpenSettings}
          className="w-full"
        >
          设置
        </Button>
      </div>
    </div>
  );
}; 