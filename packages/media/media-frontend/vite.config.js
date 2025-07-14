import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'MediaFrontend',
      fileName: 'media-frontend'
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'vuetify', 'graphql', 'graphql-tag'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          vuetify: 'Vuetify',
          graphql: 'graphql',
          'graphql-tag': 'graphqlTag'
        }
      }
    }
  }
})