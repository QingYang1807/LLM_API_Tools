# LLM API Tools

一个功能强大的LLM API管理工具，支持多种AI模型，提供直观的聊天界面和丰富的功能特性。

## ✨ 主要功能

### 🤖 智能对话
- 支持多种AI模型（智谱AI、OpenAI、Anthropic等）
- 实时流式响应，打字机效果
- 智能上下文理解，保持对话连贯性
- 支持Markdown渲染和代码高亮

### 💬 消息管理
- 消息编辑功能，支持快捷键操作
- 一键复制和下载消息内容
- 消息搜索功能，快速定位历史对话
- 多会话管理，独立配置和状态

### 🎨 用户体验
- 现代化UI设计，支持浅色/深色主题
- 响应式布局，适配各种设备
- 丰富的动画效果和交互反馈
- 快捷键支持，提升操作效率

### ⚙️ 配置管理
- 多API提供商配置
- 模型参数自定义
- 数据导入导出功能
- 本地数据持久化

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
npm start
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + N` | 新建对话 |
| `Cmd/Ctrl + Enter` | 发送消息 |
| `Cmd/Ctrl + K` | 清空聊天 |
| `Cmd/Ctrl + B` | 切换侧边栏 |
| `Cmd/Ctrl + F` | 搜索 |
| `Cmd/Ctrl + ,` | 设置 |
| `Escape` | 取消/退出 |

## 🛠️ 技术栈

- **前端框架**: Next.js 14 + React 18
- **样式**: Tailwind CSS + Framer Motion
- **类型安全**: TypeScript
- **状态管理**: React Hooks
- **Markdown渲染**: react-markdown + react-syntax-highlighter
- **快捷键**: react-hotkeys-hook

## 📁 项目结构

```
LLM_API_Tools/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── chat/             # 聊天相关组件
│   ├── layout/           # 布局组件
│   ├── settings/         # 设置组件
│   └── ui/               # 通用UI组件
├── services/             # 服务层
│   ├── api.ts           # API服务
│   └── storage.ts       # 存储服务
├── types/               # TypeScript类型定义
└── utils/               # 工具函数
```

## 🎯 核心特性

### 1. 多模型支持
- 智谱AI (GLM-4, GLM-3-Turbo)
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- 自定义API配置

### 2. 智能交互
- 流式响应，实时显示
- 消息编辑和重发
- 上下文记忆
- 智能错误处理

### 3. 数据管理
- 本地存储
- 数据备份和恢复
- 多种导出格式
- 会话管理

### 4. 用户体验
- 主题切换
- 响应式设计
- 快捷键支持
- 动画效果

## 🔧 配置说明

### API配置
在设置中可以配置多个API提供商：

1. **智谱AI**
   - Base URL: `https://open.bigmodel.cn/api/paas/v4`
   - 需要API Key

2. **OpenAI**
   - Base URL: `https://api.openai.com/v1`
   - 需要API Key

3. **自定义**
   - 支持自定义API端点
   - 灵活的参数配置

### 模型参数
- **Temperature**: 控制输出的随机性 (0-2)
- **Max Tokens**: 最大输出长度
- **Top P**: 核采样参数
- **Frequency Penalty**: 频率惩罚
- **Presence Penalty**: 存在惩罚

## 📝 使用说明

### 开始对话
1. 点击"新建对话"或使用快捷键 `Cmd/Ctrl + N`
2. 选择API配置和模型
3. 开始输入消息

### 管理会话
- 在侧边栏查看所有对话
- 点击切换不同会话
- 右键删除不需要的对话

### 消息操作
- 点击消息右上角菜单
- 支持复制、下载、编辑
- 使用快捷键快速操作

### 搜索功能
- 使用 `Cmd/Ctrl + F` 打开搜索
- 搜索历史对话内容
- 按相关性排序结果

## 🎨 主题定制

支持三种主题模式：
- **浅色模式**: 明亮清晰的界面
- **深色模式**: 护眼的暗色主题
- **跟随系统**: 自动匹配系统主题

## 📱 响应式设计

- 桌面端: 完整功能界面
- 平板端: 适配中等屏幕
- 移动端: 优化触摸操作

## 🔒 隐私安全

- 所有数据本地存储
- 不收集用户信息
- API密钥本地加密
- 支持数据导出备份

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 开发环境
1. Fork项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request

### 代码规范
- 使用TypeScript
- 遵循ESLint规则
- 添加适当的注释
- 编写测试用例

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有开源项目的贡献者，特别是：
- Next.js团队
- Tailwind CSS团队
- React社区
- 各种开源库的维护者

---

**LLM API Tools** - 让AI对话更简单、更高效！ 