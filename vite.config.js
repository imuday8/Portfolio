import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'app',
  base: './',
  publicDir: false,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'build-assets',
    sourcemap: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{
            name: 'three-runtime',
            test: /node_modules[\\/](three|@react-three)[\\/]/,
            entriesAware: true,
            minSize: 0,
            maxSize: 260000,
            priority: 20
          }]
        }
      }
    }
  },
  server: { port: 5173, strictPort: true }
});
