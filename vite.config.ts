import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/edu-hub-connector-21/', // e.g., '/my-react-app/'
});