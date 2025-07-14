import viteConfigWrapper from '../../../vite-cjs-wrapper.cjs' // Ruta relativa a la raíz
const defineConfig = viteConfigWrapper
import vue from '@vitejs/plugin-vue2'
import path from 'path'
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [vue(),
    Components({
      resolvers: [
        // Vuetify
        VuetifyResolver(),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  server: {
    port: 8080,
    open: true,
    proxy: {
      '/graphql': {
        target: process.env.VITE_API_HOST || 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/scss/variables.scss";
        `
      }
    }
  },
  optimizeDeps: {
    include: ['graphql-tag', 'vuetify']
  }
})