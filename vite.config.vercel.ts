import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
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
      input: path.resolve(__dirname, 'client/index.vercel.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@assets': path.resolve(__dirname, 'attached_assets')
    }
  }
})
