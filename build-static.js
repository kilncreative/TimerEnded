#!/usr/bin/env node

import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildStatic() {
  try {
    console.log('Building static version for GitHub Pages...');
    
    await build({
      configFile: resolve(__dirname, 'vite.config.static.ts'),
      mode: 'production'
    });
    
    console.log('✅ Static build complete! Ready for GitHub Pages deployment.');
    console.log('📁 Built files are in the /dist directory');
    console.log('🚀 Upload the /dist folder contents to your GitHub Pages repository');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildStatic();