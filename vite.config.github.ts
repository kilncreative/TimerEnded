import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic'
  })],
  base: './',
  define: {
    'process.env.NODE_ENV': '"production"',
    '__DEV__': false,
    'process.env.DEBUG': 'false'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html')
      },
      output: {
        manualChunks: undefined,
        format: 'es'
      }
    }
  },
  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@assets': path.resolve(__dirname, 'attached_assets')
    }
  },
  root: 'client'
})