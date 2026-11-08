import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// 웹사이트 빌드: npx vite build -c vite.web.config.ts → dist-web/
export default defineConfig({
  root: r('./web'),
  base: '/',
  publicDir: r('./web/public'),
  plugins: [react()],
  define: { 'import.meta.env.VITE_TARGET': JSON.stringify('web') },
  resolve: {
    alias: {
      '@apps-in-toss/web-framework': r('./web/shims/ait.ts'),
      '@toss/tds-mobile-ait': r('./web/shims/tds-ait.tsx'),
      '@toss/tds-mobile': r('./web/shims/tds.tsx'),
    },
  },
  build: { outDir: r('./dist-web'), emptyOutDir: true, assetsDir: '' },
});
