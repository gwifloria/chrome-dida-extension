# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome 扩展：替换新标签页，展示滴答清单任务并支持完整操作（查看、标记完成、编辑、删除、新建）。

技术栈：React 19 + Ant Design + TypeScript + Vite

## Commands

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建扩展
npm run build

# 类型检查
npx tsc --noEmit
```

## 开发配置

1. 复制 `.env.example` 为 `.env`，填入滴答清单 API 凭证
2. 运行 `npm run build` 构建
3. Chrome 加载 `dist` 目录为解压的扩展

## Architecture

```
src/
├── newtab/          # 新标签页入口 (React)
│   ├── App.tsx      # 主应用组件
│   └── main.tsx     # 入口点
├── background/      # Service Worker
│   └── index.ts     # OAuth 回调、token 刷新
├── components/      # React 组件
│   ├── TaskList.tsx     # 任务列表
│   ├── TaskItem.tsx     # 单个任务
│   ├── TaskEditor.tsx   # 编辑弹窗
│   └── LoginButton.tsx  # 登录页
├── services/        # 服务层
│   ├── api.ts       # 滴答清单 API 封装
│   ├── auth.ts      # OAuth 认证
│   └── storage.ts   # Chrome storage 封装
├── hooks/           # React Hooks
│   ├── useAuth.ts   # 认证状态
│   └── useTasks.ts  # 任务数据管理
└── types/           # TypeScript 类型
    └── index.ts     # Task, Project, AuthToken 等
```

## 滴答清单 API

- Base URL: `https://api.dida365.com/open/v1`
- OAuth: `https://dida365.com/oauth/authorize`
- 文档: https://developer.dida365.com/docs
