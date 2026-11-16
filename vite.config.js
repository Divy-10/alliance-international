import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Warn if any chunk exceeds 500 kB
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        /**
         * Split vendor libraries into separate chunks so the browser can
         * cache them independently from the application code.
         * rolldown (Vite 8) requires manualChunks to be a function.
         */
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
        },
      },
    },

    // Use Vite 8's default OXC minifier (esbuild is deprecated in Vite 8)
    // minify: 'oxc' is the default — do not set 'esbuild'

    // No sourcemaps in production — reduces bundle size
    sourcemap: false,

    // Target modern browsers — avoids legacy polyfill bloat
    target: 'es2020',
  },

  // Ensure preview server also handles SPA routing
  preview: {
    port: 4173,
  },
});
