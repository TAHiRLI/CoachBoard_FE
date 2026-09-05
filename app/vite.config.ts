import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
     port: 5173, // 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

    },
  },
  optimizeDeps: {
    // ffmpeg.wasm ships its own worker script; letting Vite pre-bundle it
    // races with the worker's dynamic import and the worker request hangs forever.
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
})
