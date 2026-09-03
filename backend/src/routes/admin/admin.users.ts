import { Router } from 'express'
import { validate } from '../../middleware/validate.middleware.js'
import { z } from 'zod'
import { getAdminUsers, createAdminUser } from '../../controllers/admin/users.controller.js'

const router = Router()

const adminCreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'INNOVATOR', 'STUDENT', 'PARTNER', 'FUNDER']).default('ADMIN'),
})

// ── GET / ──────────────────────────────────────────────
router.get('/', getAdminUsers)

// ── POST / ─────────────────────────────────────────────
router.post('/', validate(adminCreateUserSchema), createAdminUser)

export default router

