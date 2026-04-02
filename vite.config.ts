import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/zytx/', // 这里的名称必须和您的 GitHub 仓库名一致
})
