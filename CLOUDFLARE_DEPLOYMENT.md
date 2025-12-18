# 🚀 Cloudflare Pages Deployment Guide

## Configuration for Cloudflare Pages

### Build Settings:
- **Framework preset:** None (or "Create React App" if available)
- **Build command:** `npm run build` or `yarn build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty)
- **Node version:** 18 or higher

### Environment Variables (if needed):
```
NODE_VERSION=18
NODE_ENV=production
```

### SPA Routing:
The `public/_redirects` file handles client-side routing automatically.
All routes (/*) are redirected to /index.html with a 200 status.

### Caching Headers:
The `public/_headers` file configures aggressive caching for static assets:
- JS bundles: 1 year cache
- Fonts: 1 year cache
- Assets: 1 year cache

### Notes:
- Cloudflare Pages automatically uses the `_redirects` and `_headers` files from the build output.
- These files must be in the `dist/` folder after build (Expo copies them from `public/` automatically).
- No additional configuration needed in Cloudflare dashboard for SPA routing.
