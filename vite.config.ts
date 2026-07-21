import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createTransport } from 'nodemailer'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import fs from 'node:fs/promises'
import path from 'node:path'

const EMAIL_TO = process.env.EMAIL_TO || 'info.jhub@jkuat.ac.ke';
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@jhub.africa';

function getEmailTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  return createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

function apiPlugin() {
  const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

  async function readDb() {
    try {
      const raw = await fs.readFile(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return { news: [], events: [], innovations: [] };
    }
  }

  async function writeDb(data: any) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  function getBody(req: any) {
    return new Promise<any>((resolve) => {
      let body = '';
      req.on('data', (chunk: string) => (body += chunk));
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve({});
        }
      });
    });
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

            // GET /api/innovations
            if (pathname === '/api/innovations' && method === 'GET') {
              const db = await readDb();
              res.end(JSON.stringify(db.innovations || []));
              return;
            }

            // GET /api/applications
            if (pathname === '/api/applications' && method === 'GET') {
              const db = await readDb();
              res.end(JSON.stringify(db.applications || []));
              return;
            }

          // POST /api/news
          if (pathname === '/api/news' && method === 'POST') {
            const body = await getBody(req);
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
            const body = await getBody(req);
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

          // POST /api/innovations
          if (pathname === '/api/innovations' && method === 'POST') {
            const body = await getBody(req);
            const db = await readDb();
            const { action, innovation } = body;

            if (action === 'add') {
              const newInnovation = { ...innovation, id: `i_${Date.now()}` };
              db.innovations = [newInnovation, ...(db.innovations || [])];
              await writeDb(db);
              res.end(JSON.stringify(newInnovation));
            } else if (action === 'update') {
              db.innovations = (db.innovations || []).map((item: any) => item.id === innovation.id ? innovation : item);
              await writeDb(db);
              res.end(JSON.stringify(innovation));
            } else if (action === 'delete') {
              db.innovations = (db.innovations || []).filter((item: any) => item.id !== innovation.id);
              await writeDb(db);
              res.end(JSON.stringify({ success: true }));
            } else {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid action' }));
            }
            return;
          }

          // POST /api/applications
          if (pathname === '/api/applications' && method === 'POST') {
            const body = await getBody(req);
            const db = await readDb();
            const { action, application } = body;

            if (action === 'add') {
              const newApplication = {
                ...application,
                id: `a_${Date.now()}`,
                date: new Date().toISOString(),
              };
              db.applications = [newApplication, ...(db.applications || [])];
              await writeDb(db);

              const transport = getEmailTransport();
              if (transport) {
                try {
                  await transport.sendMail({
                    from: EMAIL_FROM,
                    to: EMAIL_TO,
                    subject: `JHUB application from ${application.fullName}`,
                    text: `Name: ${application.fullName}\nEmail: ${application.email}\nPhone: ${application.phone}\nRole: ${application.role}\nSource: ${application.source ?? 'Unknown'}\n\nMessage:\n${application.message}`,
                    html: `<p><strong>Name:</strong> ${application.fullName}</p><p><strong>Email:</strong> ${application.email}</p><p><strong>Phone:</strong> ${application.phone}</p><p><strong>Role:</strong> ${application.role}</p><p><strong>Source:</strong> ${application.source ?? 'Unknown'}</p><hr /><p>${application.message.replace(/\n/g, '<br />')}</p>`,
                  });
                } catch (emailError) {
                  console.warn('Application email send failed:', emailError);
                }
              }

              res.end(JSON.stringify(newApplication));
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
  plugins: [TanStackRouterVite(), react(), apiPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
})