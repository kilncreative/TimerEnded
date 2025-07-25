import { build } from 'vite'
import fs from 'fs'
import path from 'path'

async function buildForVercel() {
  console.log('Building for Vercel deployment...')
  
  try {
    // Build with Vercel config
    await build({
      configFile: './vite.config.vercel.ts',
      root: process.cwd()
    })
    
    // Move the built HTML to correct location
    const builtHtml = path.resolve('dist/client/index.vercel.html')
    const targetHtml = path.resolve('dist/index.html')
    
    if (fs.existsSync(builtHtml)) {
      fs.copyFileSync(builtHtml, targetHtml)
      // Clean up the client directory
      fs.rmSync(path.resolve('dist/client'), { recursive: true, force: true })
      console.log('✅ Fixed build structure - moved HTML to dist root')
    } else {
      throw new Error('Build failed - source HTML not found')
    }
    
    // Create manifest.json for PWA
    const manifest = {
      "name": "Timer",
      "short_name": "Timer",
      "description": "iOS-style timer with elapsed time tracking",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#000000",
      "theme_color": "#000000",
      "icons": [
        {
          "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNjQiIGN5PSI2NCIgcj0iNjQiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSI2NCIgeT0iNjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDAwMDAiPjU6MjM8L3RleHQ+PC9zdmc+",
          "sizes": "128x128",
          "type": "image/svg+xml"
        }
      ]
    }
    
    fs.writeFileSync(path.resolve('dist/manifest.json'), JSON.stringify(manifest, null, 2))
    console.log('✅ Created manifest.json')
    
    console.log('✅ Vercel build completed successfully!')
    
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

buildForVercel()
