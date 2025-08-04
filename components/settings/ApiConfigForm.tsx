import React, { useState, useEffect } from 'react';
import { ApiConfig, ModelConfig } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Trash2, Save, TestTube } from 'lucide-react';
import { generateId } from '@/utils';
import { cn } from '@/utils';

interface ApiConfigFormProps {
  config?: ApiConfig;
  onSave: (config: ApiConfig) => void;
  onCancel: () => void;
  onTest?: (config: ApiConfig) => Promise<boolean>;
  isMobile?: boolean;
}

export const ApiConfigForm: React.FC<ApiConfigFormProps> = ({
  config,
  onSave,
  onCancel,
  onTest,
  isMobile = false,
}) => {
  const [formData, setFormData] = useState<ApiConfig>({
    id: config?.id || generateId(),
    name: config?.name || '',
    provider: config?.provider || 'zhipu',
    baseUrl: config?.baseUrl || 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    apiKey: config?.apiKey || '',
    models: config?.models || [],
    isDefault: config?.isDefault || false,
    createdAt: config?.createdAt || new Date(),
    updatedAt: config?.updatedAt || new Date(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTesting, setIsTesting] = useState(false);

  const providerOptions = [
    { value: 'zhipu', label: '智谱AI' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'custom', label: '自定义' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '配置名称不能为空';
    }

    if (!formData.baseUrl.trim()) {
      newErrors.baseUrl = 'API地址不能为空';
    } else if (!formData.baseUrl.startsWith('http')) {
      newErrors.baseUrl = 'API地址必须以http或https开头';
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API密钥不能为空';
    }

    if (formData.models.length === 0) {
      newErrors.models = '至少需要配置一个模型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleTest = async () => {
    if (!validateForm()) return;

    setIsTesting(true);
    try {
      if (onTest) {
        const success = await onTest(formData);
        if (success) {
          alert('API连接测试成功！');
        } else {
          alert('API连接测试失败，请检查配置。');
        }
      }
    } catch (error) {
      alert('API连接测试失败：' + (error as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  const addModel = () => {
    const newModel: ModelConfig = {
      id: generateId(),
      name: '',
      displayName: '',
      maxTokens: 4096,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
      isDefault: false,
    };

    setFormData(prev => ({
      ...prev,
      models: [...prev.models, newModel],
    }));
  };

  const updateModel = (index: number, model: ModelConfig) => {
    setFormData(prev => ({
      ...prev,
      models: prev.models.map((m, i) => i === index ? model : m),
    }));
  };

  const removeModel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      models: prev.models.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}>
        <Input
          label="配置名称"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          placeholder="例如：智谱AI配置"
          isMobile={isMobile}
        />

        <Select
          label="服务提供商"
          value={formData.provider}
          onChange={(value) => setFormData(prev => ({ ...prev, provider: value as any }))}
          options={providerOptions}
          isMobile={isMobile}
        />
      </div>

      <Input
        label="API地址"
        value={formData.baseUrl}
        onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
        error={errors.baseUrl}
        placeholder="https://api.example.com/v1/chat/completions"
        isMobile={isMobile}
      />

      <Input
        label="API密钥"
        type="password"
        value={formData.apiKey}
        onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
        error={errors.apiKey}
        placeholder="输入您的API密钥"
        isMobile={isMobile}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            "font-medium",
            isMobile ? "text-base" : "text-lg"
          )}>模型配置</h3>
          <Button
            variant="outline"
            size="sm"
            icon={<Plus className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />}
            onClick={addModel}
            className="touch-target"
          >
            {isMobile ? "添加" : "添加模型"}
          </Button>
        </div>

        {formData.models.map((model, index) => (
          <Card key={model.id} className="p-4">
            <div className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}>
              <Input
                label="模型名称"
                value={model.name}
                onChange={(e) => updateModel(index, { ...model, name: e.target.value })}
                placeholder="例如：glm-4.5"
                isMobile={isMobile}
              />

              <Input
                label="显示名称"
                value={model.displayName}
                onChange={(e) => updateModel(index, { ...model, displayName: e.target.value })}
                placeholder="例如：GLM-4.5"
                isMobile={isMobile}
              />

              <Input
                label="最大Token数"
                type="number"
                value={model.maxTokens}
                onChange={(e) => updateModel(index, { ...model, maxTokens: parseInt(e.target.value) || 4096 })}
                min={1}
                max={32768}
                isMobile={isMobile}
              />

              <Input
                label="温度"
                type="number"
                step="0.1"
                value={model.temperature}
                onChange={(e) => updateModel(index, { ...model, temperature: parseFloat(e.target.value) || 0.7 })}
                min={0}
                max={2}
                isMobile={isMobile}
              />

              <Input
                label="Top P"
                type="number"
                step="0.1"
                value={model.topP}
                onChange={(e) => updateModel(index, { ...model, topP: parseFloat(e.target.value) || 0.9 })}
                min={0}
                max={1}
                isMobile={isMobile}
              />

              <div className="flex items-end">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />}
                  onClick={() => removeModel(index)}
                  className="touch-target"
                >
                  {isMobile ? "删除" : "删除"}
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {errors.models && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.models}</p>
        )}
      </div>

      <div className={cn(
        "flex items-center gap-4",
        isMobile ? "flex-col" : "flex-row"
      )}>
        <Button
          variant="primary"
          icon={<Save className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />}
          onClick={handleSave}
          className="touch-target w-full"
        >
          保存配置
        </Button>

        {onTest && (
          <Button
            variant="outline"
            icon={<TestTube className={cn("", isMobile ? "w-3 h-3" : "w-4 h-4")} />}
            onClick={handleTest}
            loading={isTesting}
            className="touch-target w-full"
          >
            测试连接
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onCancel}
          className="touch-target w-full"
        >
          取消
        </Button>
      </div>
    </div>
  );
}; 