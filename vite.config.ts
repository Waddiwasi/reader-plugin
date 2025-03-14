import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import { fileURLToPath } from 'node:url'

import { dirname, resolve } from 'node:path'

import { copyFileSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

// 复制manifest.json到dist目录的插件

const copyManifest = () => {
  return {
    name: 'copy-manifest',

    writeBundle: () => {
      copyFileSync(
        resolve(__dirname, 'manifest.json'),

        resolve(__dirname, 'dist/manifest.json')
      )
    },
  }
}

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), copyManifest()],

  build: {
    outDir: 'dist',

    emptyOutDir: true,

    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),

        index: resolve(__dirname, 'index.html'),

        options: resolve(__dirname, 'options.html'),
      },

      output: {
        dir: 'dist',

        entryFileNames: (chunkInfo) => {
          // 为content script使用特殊的输出路径

          if (chunkInfo.name === 'content') {
            return 'content.js'
          }

          return 'assets/[name].js'
        },

        chunkFileNames: 'assets/[name].[hash].js',

        assetFileNames: (assetInfo) => {
          // 为HTML文件使用根目录

          if (assetInfo.name && /\.(html)$/.test(assetInfo.name)) {
            return '[name].[ext]'
          }

          return 'assets/[name].[ext]'
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
