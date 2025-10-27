import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Load environment variables
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow frontend to call local backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // used only when running locally
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
