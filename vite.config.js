// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables globals like describe, test, expect
    environment: 'jsdom', // Simulates a browser environment for React components
  },
});
