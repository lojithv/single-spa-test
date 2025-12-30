import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginSingleSpa from 'vite-plugin-single-spa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginSingleSpa({
      serverPort: 5175,
      spaEntryPoints: 'src/main.tsx'
    })
  ],
  server: {
    port: 5175
  }
})
