# LLM API Tools - 智能对话助手

一个功能强大、界面优雅的跨设备AI对话工具，支持多种大模型API，专为开发者、研究人员和AI爱好者设计。

## ✨ 主要特性

### 🤖 多模型支持
- **智谱AI (GLM系列)** - 支持GLM-4、GLM-4V等模型
- **OpenAI** - 支持GPT-3.5、GPT-4等模型
- **Anthropic** - 支持Claude系列模型
- **自定义API** - 支持任意兼容OpenAI格式的API

### 💬 智能对话体验
- **实时流式响应** - 打字机效果，即时显示AI回复
- **上下文记忆** - 智能维护对话上下文
- **Markdown渲染** - 支持代码高亮、表格、链接等
- **消息编辑** - 可编辑已发送的消息
- **多会话管理** - 独立管理多个对话会话

### 📱 跨设备优化
- **响应式设计** - 完美适配PC、平板、手机
- **触摸优化** - 移动端手势操作和触摸反馈
- **PWA支持** - 可安装为原生应用
- **离线缓存** - 本地存储对话记录
- **安全区域** - 适配刘海屏、曲面屏

### 🎨 用户体验
- **深色/浅色主题** - 支持跟随系统主题
- **快捷键支持** - 丰富的键盘快捷键
- **搜索功能** - 快速搜索历史对话
- **数据导出** - 支持多种格式导出
- **实时通知** - 优雅的Toast通知系统

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/llm-api-tools.git
cd llm-api-tools
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **打开浏览器**
访问 [http://localhost:3000](http://localhost:3000)

### 配置API

1. 点击右上角"设置"按钮
2. 选择"API配置"
3. 添加您的API密钥和配置信息
4. 选择要使用的模型
5. 开始对话！

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + N` | 新建对话 |
| `Ctrl/Cmd + Enter` | 发送消息 |
| `Ctrl/Cmd + K` | 清空聊天 |
| `Ctrl/Cmd + B` | 切换侧边栏 |
| `Ctrl/Cmd + F` | 搜索 |
| `Ctrl/Cmd + M` | 模型选择器 |
| `Ctrl/Cmd + ,` | 设置 |
| `Escape` | 取消/退出 |

## 📱 移动端特性

### 触摸优化
- **触摸目标** - 所有按钮最小44px触摸区域
- **手势操作** - 侧边栏滑动关闭
- **虚拟键盘** - 自动调整布局适配键盘
- **安全区域** - 适配各种屏幕尺寸

### 移动端快捷键
- **长按消息** - 快速操作菜单
- **下拉刷新** - 刷新对话列表
- **双击** - 快速编辑消息

## 🎯 使用场景

### 开发者
- **代码调试** - 快速获取编程建议
- **API测试** - 测试不同模型的响应
- **文档生成** - 自动生成技术文档

### 研究人员
- **数据分析** - AI辅助数据分析
- **论文写作** - 智能写作助手
- **实验记录** - 记录研究过程

### 内容创作者
- **创意写作** - 激发创作灵感
- **内容编辑** - 智能内容优化
- **多语言翻译** - 跨语言内容创作

## 🔧 技术栈

- **前端框架** - Next.js 14 (App Router)
- **UI组件** - React + TypeScript
- **样式系统** - Tailwind CSS
- **动画库** - Framer Motion
- **状态管理** - React Hooks
- **本地存储** - LocalStorage API
- **PWA** - Next.js PWA支持

## 📦 项目结构

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
├── utils/               # 工具函数
└── public/              # 静态资源
```

## 🎨 设计理念

### 用户体验优先
- **简洁直观** - 清晰的界面布局
- **响应迅速** - 流畅的交互体验
- **易于使用** - 降低学习成本

### 跨设备一致性
- **统一体验** - 在不同设备上保持一致
- **适配优化** - 针对不同屏幕尺寸优化
- **性能优化** - 确保在各种设备上流畅运行

### 可扩展性
- **模块化设计** - 易于添加新功能
- **插件系统** - 支持第三方扩展
- **API标准化** - 支持更多AI服务商

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 编写单元测试覆盖新功能
- 更新文档说明新特性

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 优秀的React框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用的CSS框架
- [Framer Motion](https://www.framer.com/motion/) - 流畅的动画库
- [Lucide Icons](https://lucide.dev/) - 精美的图标库

## 📞 联系我们

- **项目主页**: [GitHub Repository](https://github.com/your-username/llm-api-tools)
- **问题反馈**: [Issues](https://github.com/your-username/llm-api-tools/issues)
- **功能建议**: [Discussions](https://github.com/your-username/llm-api-tools/discussions)

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！ 