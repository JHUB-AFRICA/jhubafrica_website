import { Router } from 'express'
import { validate } from '../middleware/validate.middleware.js'
import { authLimiter } from '../middleware/rateLimiter.middleware.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireCsrfHeader } from '../middleware/csrf.middleware.js'
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema.js'
import { register, login, adminLogin, refresh, logout, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller.js'

const router = Router()

// ── POST /auth/register ────────────────────────────────
router.post('/register', authLimiter, validate(registerSchema), register)

// ── POST /auth/login ───────────────────────────────────
router.post('/login', authLimiter, requireCsrfHeader, validate(loginSchema), login)

// ── POST /auth/admin/login ────────────────────────────
router.post('/admin/login', authLimiter, requireCsrfHeader, validate(loginSchema), adminLogin)

// ── POST /auth/forgot-password ────────────────────────
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword)

// ── POST /auth/reset-password ─────────────────────────
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword)

// ── POST /auth/refresh ─────────────────────────────────
router.post('/refresh', authLimiter, requireCsrfHeader, refresh)

// ── POST /auth/logout ──────────────────────────────────
router.post('/admin/logout', requireAuth, requireCsrfHeader, logout)

// ── GET /auth/me ───────────────────────────────────────
router.get('/me', requireAuth, getMe)

export default router
