import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@dracul/user-frontend': path.resolve(__dirname, '../../user/user-frontend/dist'),
      '@dracul/media-frontend': path.resolve(__dirname, '../../media/media-frontend/dist'),
      '@dracul/customize-frontend': path.resolve(__dirname, '../../customize/customize-frontend/dist'),
      '@dracul/settings-frontend': path.resolve(__dirname, '../../settings/settings-frontend/dist'),
      '@dracul/audit-frontend': path.resolve(__dirname, '../../audit/audit-frontend/dist'),
      '@dracul/notification-frontend': path.resolve(__dirname, '../../notification/notification-frontend/dist'),
      '@dracul/queue-frontend': path.resolve(__dirname, '../../queue/queue-frontend/dist'),
      '@dracul/access-frontend': path.resolve(__dirname, '../../access/access-frontend/dist'),
      '@dracul/dayjs-frontend': path.resolve(__dirname, '../../dayjs/dayjs-frontend/dist')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})