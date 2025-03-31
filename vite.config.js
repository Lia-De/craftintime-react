import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://lia-de.github.io/craftintime-react",
  server: {
    proxy: {
      '/api': {
        target: 'https://craftintimeapi-cre5hhfuhudvajac.swedencentral-01.azurewebsites.net/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
