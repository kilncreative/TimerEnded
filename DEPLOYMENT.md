# GitHub Pages Deployment Guide

This timer app is configured for easy deployment to GitHub Pages with proper Content Security Policy headers.

## Quick Setup

1. **Fork/Clone** this repository to your GitHub account
2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
3. **Push to main branch** - deployment happens automatically

## Deployment Process

The app uses GitHub Actions for automatic deployment:

1. **Triggers**: Push to main branch
2. **Build**: Uses `vite.config.github.ts` for frontend-only build
3. **Deploy**: Uses GitHub Actions to deploy directly to GitHub Pages
4. **Access**: Available at `https://yourusername.github.io/your-repo-name`

## Manual Build (Optional)

To test the build locally:

```bash
# Build for GitHub Pages
node build-github.js

# Serve locally to test
npx serve dist
```

## Content Security Policy

The app includes the required CSP header in `client/index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
```

This allows:
- `'unsafe-eval'` for Vite's development features
- `'unsafe-inline'` for Tailwind CSS styles

## PWA Features

The app is configured as a Progressive Web App with:
- Web App Manifest (`/manifest.json`)
- Apple Touch Icon support
- Mobile-optimized viewport
- Full-screen capable on iOS

## File Structure

```
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── vite.config.github.ts         # GitHub Pages build config
├── build-github.js               # Build script
├── client/index.html             # Main HTML with CSP header
├── client/public/manifest.json   # PWA manifest
└── DEPLOYMENT.md                 # This guide
```

## Repository Settings

Ensure your repository has:
- **GitHub Pages enabled** with source set to "GitHub Actions" (Settings → Pages)
- **Actions enabled** (Settings → Actions)
- **Pages permissions** enabled for Actions (this is automatic with "GitHub Actions" source)

## Troubleshooting

- **Build fails**: Check Node.js version (requires 18+)
- **Page not loading**: Verify GitHub Pages is enabled
- **CSP errors**: Ensure the meta tag is properly formatted
- **Assets not loading**: Check that base path is set to `./` in config

The app will be available at your GitHub Pages URL once deployment completes.