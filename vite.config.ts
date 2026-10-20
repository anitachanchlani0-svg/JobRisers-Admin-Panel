import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 5173);

function adminRoutingPlugin(): Plugin {
  return {
    name: 'admin-routing-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname, search] = (req.url ?? '').split('?');
        if (
          pathname &&
          (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/admin-')) &&
          !pathname.slice('/admin'.length).includes('.')
        ) {
          req.url = '/admin/index.html' + (search ? `?${search}` : '');
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname, search] = (req.url ?? '').split('?');
        if (
          pathname &&
          (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/admin-')) &&
          !pathname.slice('/admin'.length).includes('.')
        ) {
          req.url = '/admin/index.html' + (search ? `?${search}` : '');
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), adminRoutingPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: rootDir,
  build: {
    outDir: path.resolve(rootDir, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, 'index.html'),
        admin: path.resolve(rootDir, 'admin/index.html'),
      },
    },
  },
  server: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
