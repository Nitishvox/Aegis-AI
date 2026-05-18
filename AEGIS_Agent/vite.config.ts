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
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Core React Bundle (Must be stable)
              if (
                id.includes('react/') || 
                id.includes('react-dom') || 
                id.includes('scheduler') ||
                id.includes('react-router') ||
                id.includes('remix-run') ||
                id.includes('use-sync-external-store')
              ) {
                return 'vendor-react';
              }
              
              // Heavy Visualization & Processing (isolated)
              if (id.includes('recharts')) return 'vendor-recharts';
              if (id.includes('d3/')) return 'vendor-d3';
              if (id.includes('jspdf')) return 'vendor-jspdf';
              if (id.includes('html2canvas')) return 'vendor-html2canvas';
              if (id.includes('framer-motion')) return 'vendor-framer';
              if (id.includes('motion')) return 'vendor-motion';
              
              // UI Framework Components
              if (id.includes('lucide-react')) return 'vendor-lucide';
              if (id.includes('@radix-ui')) return 'vendor-radix';
              
              // AI & APIs
              if (id.includes('@google/genai')) return 'vendor-ai';
              if (id.includes('groq')) return 'vendor-groq';
              
              // Content Stack - Keep all markdown libs together to avoid circular deps
              if (id.includes('markdown') || id.includes('remark') || id.includes('micromark') || 
                  id.includes('mdast') || id.includes('vfile') || id.includes('unified') || 
                  id.includes('decode-named-character-reference')) {
                return 'vendor-markdown';
              }
              
              // Styling & Utilities
              if (id.includes('tailwindcss') || id.includes('autoprefixer')) return 'vendor-tailwind';
              if (id.includes('clsx') || id.includes('tailwind-merge')) return 'vendor-classnames';
              if (id.includes('date-fns')) return 'vendor-datefns';
              if (id.includes('sonner')) return 'vendor-sonner';
              if (id.includes('next-themes')) return 'vendor-themes';
              
              // Everything else (minimal fallback)
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
