import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import { NODE_ENV, API_VERSION, PORT, CORS_ORIGINS } from '../src/config/env.js'
import { apiLimiter } from '../src/middleware/rateLimiter.middleware.js'
import { errorHandler, notFoundHandler } from '../src/middleware/error.middleware.js'

// ── Route modules ──────────────────────────────────────
import apiRouter from '../src/routes/router.js'
import { supabaseAdmin } from '../src/config/supabase.js'

// ── App ────────────────────────────────────────────────
const app = express()

// Trust Render's proxy so req.ip / X-Forwarded-For are read correctly
app.set('trust proxy', 1)

// ── Security & parsing ─────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cookieParser())

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'https://jhubafrica.com',
  'https://www.jhubafrica.com',
]

const allowedOrigins = CORS_ORIGINS
  ? [...new Set([...CORS_ORIGINS.split(',').map((s) => s.trim()), ...defaultOrigins])]
  : defaultOrigins

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true)
      }
      // Allow localhost or 127.0.0.1 on any port in dev/preview
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true)
      }
      return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'x-requested-with',
      'X-CSRF-Token',
      'x-csrf-token',
    ],
  })
)

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// if (isDev) {
//   app.use(morgan('dev'))
// } else {
//   app.use(morgan('combined'))
// }

// ── Global rate limit ──────────────────────────────────
app.use(`/api/${API_VERSION}`, apiLimiter)

// ── Health check ───────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: API_VERSION,
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ── API Routes ─────────────────────────────────────────
app.use(`/api/${API_VERSION}`, apiRouter)

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to JHUB Africa API',
    version: API_VERSION,
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

app.get('/test-supabase', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')

  if (error) {
    return res.status(500).json(error)
  }

  res.json(data)
})

// ── 404 & error handlers (must be last) ───────────────
app.use(notFoundHandler)
app.use(errorHandler)

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ┌────────────────────────────────────────────────┐
  │  JHUB Africa API                               │
  │  http://localhost:${PORT}                      │
  │                                                │
  │  Environment : ${NODE_ENV}                     │
  │  API version : ${API_VERSION}                  │
  │  Base URL    : /api/${API_VERSION}             │
  └────────────────────────────────────────────────┘
  `)
})

export default app
