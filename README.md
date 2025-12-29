# 滴答清单 New Tab

> 将新标签页变成专注任务面板

每次打开新标签页，不再是空白或广告，而是你今天最重要的任务。

## 功能特性

- **专注模式** - 大时钟 + 今日重点任务，帮助你保持专注
- **智能清单** - 今天、明天、本周、已过期，一目了然
- **任务管理** - 查看、完成、编辑、删除、新建，全功能支持
- **多主题切换** - 手帐、玫瑰、海洋、暗黑四种风格
- **跨设备同步** - 主题偏好自动同步

## 截图

<!-- TODO: 添加截图 -->

## 安装

### 从 Chrome Web Store 安装

<!-- TODO: 上架后添加链接 -->

### 本地开发安装

1. 克隆仓库
```bash
git clone https://github.com/gwifloria/chrome-dida-extension.git
cd chrome-dida-extension
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env，填入滴答清单 API 凭证
```

4. 构建
```bash
npm run build
```

5. 加载扩展
   - 打开 Chrome，访问 `chrome://extensions/`
   - 开启「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择 `dist` 目录

## 开发

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run typecheck

# 代码检查
npm run lint
```

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Ant Design
- Chrome Extension Manifest V3

## 项目结构

```
src/
├── newtab/          # 新标签页入口
├── background/      # Service Worker
├── components/      # React 组件
├── hooks/           # React Hooks
├── services/        # API 服务
├── contexts/        # React Context
├── utils/           # 工具函数
├── constants/       # 常量
├── themes/          # 主题配置
└── types/           # TypeScript 类型
```

## 滴答清单 API

本扩展使用滴答清单官方 Open API：
- 文档：https://developer.dida365.com/docs
- 需要在开发者平台注册应用获取 Client ID 和 Client Secret

## 隐私政策

查看 [PRIVACY.md](./PRIVACY.md)

## 许可证

MIT
