import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 子路径部署时由 Actions 传入 VITE_BASE（如 /n4a-website/）；本地默认 /
  base: process.env.VITE_BASE || '/',
})
