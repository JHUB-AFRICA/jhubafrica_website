<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import fs from 'node:fs/promises'
import path from 'node:path'

function apiPlugin() {
  const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

  async function readDb() {
    try {
      const raw = await fs.readFile(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return { news: [], events: [] };
    }
  }

  async function writeDb(data: any) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  return {
    name: 'api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        try {
          const url = new URL(req.url, 'http://localhost');
          const pathname = url.pathname;
          const method = req.method;

          // GET /api/news
          if (pathname === '/api/news' && method === 'GET') {
            const db = await readDb();
            res.end(JSON.stringify(db.news));
            return;
          }

          // GET /api/events
          if (pathname === '/api/events' && method === 'GET') {
            const db = await readDb();
            res.end(JSON.stringify(db.events));
            return;
          }

          // Helper to parse JSON body
          const getBody = () => new Promise<any>((resolve) => {
            let body = '';
            req.on('data', (chunk: string) => body += chunk);
            req.on('end', () => {
              try {
                resolve(JSON.parse(body));
              } catch {
                resolve({});
              }
            });
          });

          // POST /api/news
          if (pathname === '/api/news' && method === 'POST') {
            const body = await getBody();
            const db = await readDb();
            const { action, post } = body;

            if (action === 'add') {
              const newPost = { ...post, id: `n_${Date.now()}` };
              db.news = [newPost, ...db.news];
              await writeDb(db);
              res.end(JSON.stringify(newPost));
            } else if (action === 'update') {
              db.news = db.news.map((n: any) => n.id === post.id ? post : n);
              await writeDb(db);
              res.end(JSON.stringify(post));
            } else if (action === 'delete') {
              db.news = db.news.filter((n: any) => n.id !== post.id);
              await writeDb(db);
              res.end(JSON.stringify({ success: true }));
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid action' }));
            }
            return;
          }

          // POST /api/events
          if (pathname === '/api/events' && method === 'POST') {
            const body = await getBody();
            const db = await readDb();
            const { action, event } = body;

            if (action === 'add') {
              const newEvent = { ...event, id: `e_${Date.now()}` };
              db.events = [...db.events, newEvent];
              await writeDb(db);
              res.end(JSON.stringify(newEvent));
            } else if (action === 'update') {
              db.events = db.events.map((e: any) => e.id === event.id ? event : e);
              await writeDb(db);
              res.end(JSON.stringify(event));
            } else if (action === 'delete') {
              db.events = db.events.filter((e: any) => e.id !== event.id);
              await writeDb(db);
              res.end(JSON.stringify({ success: true }));
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid action' }));
            }
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Not Found' }));

        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    },
    configurePreviewServer(server: any) {
      this.configureServer(server);
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), tsconfigPaths(), react(), apiPlugin()],
})


=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
>>>>>>> abe87807609cea66bcfad370e7c217e9da976570
