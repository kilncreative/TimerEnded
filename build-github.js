#!/usr/bin/env node

import { build } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import crypto from 'crypto'

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

    // Find the built JS file and calculate its hash
    const distDir = path.resolve(__dirname, 'dist/assets')
    const jsFiles = fs.readdirSync(distDir).filter(file => file.startsWith('main-') && file.endsWith('.js'))
    
    if (jsFiles.length > 0) {
      const jsFile = path.join(distDir, jsFiles[0])
      const jsContent = fs.readFileSync(jsFile)
      const hash = crypto.createHash('sha256').update(jsContent).digest('base64')
      
      // Update the CSP in the built HTML file
      const htmlFile = path.resolve(__dirname, 'dist/index.html')
      let htmlContent = fs.readFileSync(htmlFile, 'utf8')
      
      // Replace the CSP meta tag with the correct hash
      const cspRegex = /<meta http-equiv="Content-Security-Policy" content="[^"]*">/
      const newCSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'sha256-${hash}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">`
      
      htmlContent = htmlContent.replace(cspRegex, newCSP)
      fs.writeFileSync(htmlFile, htmlContent)
      
      console.log(`✅ GitHub Pages build completed successfully! Script hash: ${hash}`)
    } else {
      console.log('✅ GitHub Pages build completed successfully!')
    }
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

buildForGitHub()