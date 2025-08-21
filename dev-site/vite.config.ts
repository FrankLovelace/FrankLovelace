import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Aquí le decimos a Vite cuáles son todas nuestras páginas HTML.
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        portal: resolve(__dirname, 'portal.html'),
        certificate: resolve(__dirname, 'certificate.html'),
      },
    },
  },
})