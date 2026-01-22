import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginSingleSpa from 'vite-plugin-single-spa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginSingleSpa({
      serverPort: 5174,
      spaEntryPoints: 'src/main.tsx'
    })
  ],
  server: {
    port: 5174
  },
  resolve: {
    alias: {
      // In dev, resolve builderbid-auth to the common app's shared exports
      // This avoids side effects from main.tsx (CSS imports, React mounting)
      // In production/single-spa mode, this is resolved via import maps
      'builderbid-auth': path.resolve(__dirname, '../common/src/shared/index.ts')
    }
  },
  build: {
    rollupOptions: {
      // Externalize builderbid-auth for production - resolved via import maps at runtime
      external: ['builderbid-auth']
    }
  }
})
