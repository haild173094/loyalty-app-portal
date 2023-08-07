import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
      '~': fileURLToPath(new URL('./node_modules/', import.meta.url)),
      '@icons': fileURLToPath(new URL('./node_modules/@shopify/polaris-icons/dist/svg', import.meta.url)),
    },
    dedupe: ['vue'],
  },
  build: {
    emptyOutDir: false,
    rollupOptions:{
      input:{
        loyalty: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
      output: {
        dir: 'dist/loyalty',
        assetFileNames: 'assets/loyalty[extname]',
        entryFileNames: 'assets/loyalty.js',
      },
    },
  },
});
