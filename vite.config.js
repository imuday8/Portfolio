import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import statsHandler from './api/coding-stats.js';

export default defineConfig({
  root: 'app',
  base: './',
  publicDir: false,
  plugins: [react(), tailwindcss(), {
    name: 'coding-stats-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/coding-stats', (req, res) => {
        res.status = code => { res.statusCode = code; return res; };
        res.json = data => res.end(JSON.stringify(data));
        statsHandler(req, res).catch(() => { res.statusCode = 503; res.end('{}'); });
      });
    },
  }],
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
