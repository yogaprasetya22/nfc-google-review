import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'local-api-upload-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Helper shim for res.status and res.json
          const customRes = res as any;
          if (!customRes.status) {
            customRes.status = function (code: number) {
              this.statusCode = code;
              return this;
            };
          }
          if (!customRes.json) {
            customRes.json = function (data: any) {
              this.setHeader('Content-Type', 'application/json');
              this.end(JSON.stringify(data));
              return this;
            };
          }

          if (req.url === '/api/upload' && req.method === 'POST') {
            try {
              const handlerModule: any = await import('./api/upload.js' as any);
              await handlerModule.default(req, customRes);
            } catch (err: any) {
              console.error('Local /api/upload error:', err);
              customRes.status(500).json({ success: false, error: err.message });
            }
            return;
          }

          if (req.url?.startsWith('/api/gdrive-files') && req.method === 'GET') {
            try {
              const handlerModule: any = await import('./api/gdrive-files.js' as any);
              await handlerModule.default(req, customRes);
            } catch (err: any) {
              console.error('Local /api/gdrive-files error:', err);
              customRes.status(500).json({ success: false, error: err.message });
            }
            return;
          }

          if (req.url?.startsWith('/api/gdrive-image') && req.method === 'GET') {
            try {
              const handlerModule: any = await import('./api/gdrive-image.js' as any);
              await handlerModule.default(req, customRes);
            } catch (err: any) {
              console.error('Local /api/gdrive-image error:', err);
              customRes.status(500).json({ success: false, error: err.message });
            }
            return;
          }

          if (req.url?.startsWith('/api/gdrive-delete') && (req.method === 'DELETE' || req.method === 'POST')) {
            try {
              const handlerModule: any = await import('./api/gdrive-delete.js' as any);
              await handlerModule.default(req, customRes);
            } catch (err: any) {
              console.error('Local /api/gdrive-delete error:', err);
              customRes.status(500).json({ success: false, error: err.message });
            }
            return;
          }

          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  }
})
