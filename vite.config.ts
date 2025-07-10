import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
// import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()]
  // build: {
  //   rollupOptions: {
  //     // external: ['react-router', 'react-router-dom']
  //   }
  // },
  // server: {
  //   watch: {
  //     usePolling: true,
  //     interval: 100,
  //     ignored: ['**/node_modules/**', '**/.git/**']
  //   }
  // },
  // optimizeDeps: {
  //   include: [
  //     '@emotion/styled',
  //     '@emotion/react',
  //     'cookie',
  //     '@mui/material',
  //     '@mui/icons-material'
  //   ]
  // },
  // resolve: {
  //   alias: {
  //     // '@': path.resolve(__dirname, '/src'),
  //     // '@': path.resolve(__dirname, './src')
  //     '@': './src',
  //     'prop-types': './node_modules/prop-types/prop-types.js',
  //     cookie: './node_modules/@mui/icons-material/cookie.js',
  //     generateUtilityClasses:
  //       './node_modules/@mui/utils/generateUtilityClasses/generateUtilityClasses.js',
  //     generateUtilityClass:
  //       './node_modules/@mui/utils/generateUtilityClass/generateUtilityClass.js',
  //     '@mui/utils/generateUtilityClass':
  //       './node_modules/@mui/utils/generateUtilityClass/generateUtilityClass.js',
  //     '@mui/utils/generateUtilityClasses':
  //       './node_modules/@mui/utils/generateUtilityClasses/generateUtilityClasses.js',
  //     clsx: './node_modules/clsx/dist/clsx.js'
  //   }
  // }
});
