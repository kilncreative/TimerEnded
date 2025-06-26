#!/usr/bin/env node

import { build } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function buildForGitHub() {
  try {
    await build({
      configFile: path.resolve(__dirname, 'vite.config.github.ts'),
      root: path.resolve(__dirname, 'client'),
      base: './',
      build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true
      }
    })
    console.log('✅ GitHub Pages build completed successfully!')
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

buildForGitHub()