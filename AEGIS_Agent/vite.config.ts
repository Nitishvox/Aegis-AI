import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Core UI libraries
              if (id.includes('lucide-react')) return 'vendor-lucide';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              
              // Heavy processing / visualization libraries
              if (id.includes('recharts') || id.includes('d3')) return 'vendor-charts';
              if (id.includes('jspdf')) return 'vendor-pdf';
              if (id.includes('html2canvas')) return 'vendor-canvas';
              
              // Content processing
              if (id.includes('react-markdown') || id.includes('remark') || id.includes('micromark') || id.includes('mdast') || id.includes('vfile')) return 'vendor-markdown';
              
              // React and ecosystem
              if (id.includes('react')) return 'vendor-react';
              
              // Remaining common libs
              return 'vendor-libs';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
