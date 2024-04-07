import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// favicon.ico - 16x16 or 32x32 or 64x64 (png)
// apple-touch-icon.png - 180x180 (iOS), 120x120 (iPhone non-X/Plus), 167x167 (iPadPro), 152x152 (iPad, iPad mini)
// mask-icon.svg - 512x512
// directions to design icons inkscape: https://lucide.dev/guide/design/inkscape-guide
// Generate App Images: https://favicon.inbrowser.app/tools/favicon-generator  (or)
// Generate App Images: https://www.pwabuilder.com/imageGenerator
const vitePWAPlugin = VitePWA({
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true,
    type: 'module',
    navigateFallback: 'index.html',
    // suppressWarnings: true,
  },
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.png'],
  manifest: {
    name: 'MathHub',
    short_name: 'MathHub',
    theme_color: '#324C69',
    background_color: '#869CB5',
    display: 'standalone',
    display_override: ['standalone'],
    icons: [
      { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'pwa-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePWAPlugin],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
