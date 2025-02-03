import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    target: 'es6',
    outDir: '../dist',
    emptyOutDir: true,
  },
});
