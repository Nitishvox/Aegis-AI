import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Core React
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router') || id.includes('remix-run')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react-core';
              
              // Specific Heavy Libs
              if (id.includes('lucide-react')) return 'vendor-lucide';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('recharts')) return 'vendor-recharts';
              if (id.includes('d3')) return 'vendor-d3';
              if (id.includes('jspdf')) return 'vendor-pdf';
              if (id.includes('html2canvas')) return 'vendor-canvas';
              if (id.includes('@google/genai')) return 'vendor-gemini';
              if (id.includes('date-fns')) return 'vendor-date-fns';
              
              // Radix UI Splitting
              if (id.includes('@radix-ui')) {
                const component = id.split('@radix-ui/')[1]?.split('/')[0];
                return component ? `vendor-radix-${component}` : 'vendor-radix';
              }
              
              // Markdown Stack
              if (id.includes('react-markdown') || id.includes('remark') || id.includes('micromark') || id.includes('mdast') || id.includes('vfile') || id.includes('unist') || id.includes('decode-named-character-reference')) {
                return 'vendor-markdown-stack';
              }
              
              // UI Utils
              if (id.includes('sonner') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
                return 'vendor-ui-shared';
              }
              
              return 'vendor-misc';
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
