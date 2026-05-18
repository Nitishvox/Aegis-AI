import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Core React Bundle (Must be stable)
              if (
                id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('scheduler') ||
                id.includes('react-router') ||
                id.includes('remix-run') ||
                id.includes('use-sync-external-store')
              ) {
                return 'vendor-react';
              }
              
              // Heavy Visualization & Processing
              if (id.includes('recharts') || id.includes('d3')) return 'vendor-viz';
              if (id.includes('jspdf') || id.includes('html2canvas')) return 'vendor-export';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-animation';
              
              // UI Framework Components
              if (id.includes('lucide-react')) return 'vendor-lucide';
              if (id.includes('@radix-ui')) return 'vendor-radix';
              
              // AI & APIs
              if (id.includes('@google/genai')) return 'vendor-ai';
              
              // Content Stack
              if (id.includes('markdown') || id.includes('remark') || id.includes('micromark') || id.includes('mdast') || id.includes('vfile')) {
                return 'vendor-content';
              }
              
              // Common Utilities - Keep separate to avoid circular deps
              if (id.includes('date-fns')) return 'vendor-datefns';
              if (id.includes('sonner')) return 'vendor-sonner';
              if (id.includes('clsx') || id.includes('tailwind-merge')) return 'vendor-css';
              
              return 'vendor-others';
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
