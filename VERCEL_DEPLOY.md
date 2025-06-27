# Deploy to Vercel

## Quick Setup

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Build the project**:
   ```bash
   node build-vercel.js
   ```

## Deploy Methods

### Method 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the settings from `vercel.json`
5. Click "Deploy"

### Method 2: Vercel CLI
```bash
vercel --prod
```

### Method 3: Drag & Drop
1. Run `node build-vercel.js`
2. Go to [vercel.com](https://vercel.com)
3. Drag the `dist` folder to the deploy area

## Files Created for Vercel

- `vercel.json` - Vercel configuration with routing and headers
- `vite.config.vercel.ts` - Optimized Vite config for Vercel
- `client/index.vercel.html` - Clean HTML template (no CSP restrictions)
- `build-vercel.js` - Build script for Vercel deployment
- `manifest.json` - PWA manifest (auto-generated)

## Key Differences from GitHub Pages

✅ **No CSP eval restrictions** - React Query and all libraries work  
✅ **Automatic HTTPS and CDN**  
✅ **Zero configuration** - Just push to deploy  
✅ **Better performance** - Edge functions and caching  
✅ **Custom domains** on free tier  

Your timer app will work perfectly on Vercel without any eval-related issues!