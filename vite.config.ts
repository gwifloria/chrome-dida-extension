import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, rmSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-html',
      closeBundle() {
        // 将 HTML 移动到正确位置
        const srcHtml = resolve(__dirname, 'dist/src/newtab/index.html')
        const destDir = resolve(__dirname, 'dist/newtab')
        const destHtml = resolve(destDir, 'index.html')

        if (existsSync(srcHtml)) {
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true })
          }
          copyFileSync(srcHtml, destHtml)
        }

        // 清理 dist/src 目录
        const srcDir = resolve(__dirname, 'dist/src')
        if (existsSync(srcDir)) {
          rmSync(srcDir, { recursive: true })
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/newtab/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/index.js'
          }
          return 'newtab/index.js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
