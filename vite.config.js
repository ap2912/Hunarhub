import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// HashRouter is used for routing (see App.jsx), so no server-side
// rewrite rules are needed — the build deploys as-is on GitHub Pages,
// Netlify, or Vercel.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1200,
  },
});
