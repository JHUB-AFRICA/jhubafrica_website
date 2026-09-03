import { Request, Response, NextFunction } from 'express'
import { supabase, supabaseAdmin } from '../config/supabase.js'
import { signToken, signRefreshToken, blacklistToken } from '../middleware/auth.middleware.js'
import { CookieOptions } from 'express'
import { redis } from '../config/redis.js'
import { NODE_ENV, JWT_SECRET, CORS_ORIGINS } from '../config/env.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/email.service.js'
import { compileResetPasswordEmail } from '../templates/emails/reset-password.template.js'

// CHANGED: derive isProd once, reuse below
const isProd = NODE_ENV === 'production'

// CHANGED: secure/sameSite now depend on environment.
// Previously secure:true + sameSite:'none' silently dropped the cookie
// on http://localhost, since browsers refuse Secure cookies on non-HTTPS
// origins — meaning refresh could never work in local dev.
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/api/v1/auth/refresh',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}

const { maxAge, ...clearCookieOptions } = cookieOptions

interface RotatedTokenGrace {
  token: string
  userId: string
  rotatedAt: number
}
let rotatedTokensGrace: RotatedTokenGrace[] = []

async function addTokenToGracePeriod(token: string, userId: string) {
  if (redis) {
    await redis.setex(`grace:${token}`, 15, userId)
  } else {
    rotatedTokensGrace.push({ token, userId, rotatedAt: Date.now() })
  }
}

async function isTokenInGracePeriod(token: string): Promise<string | null> {
  const now = Date.now()
  rotatedTokensGrace = rotatedTokensGrace.filter(t => now - t.rotatedAt < 15000)

  if (redis) {
    const userId = await redis.get(`grace:${token}`)
    return userId as string | null
  }

  const found = rotatedTokensGrace.find(t => t.token === token)
  return found ? found.userId : null
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, firstName, lastName, role } = req.body

    // Create user in Supabase Auth
    const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { firstName, lastName, role },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return res.status(409).json({ error: 'Email already registered' })
      }
      throw error
    }

    // Sync user profile into public users table
    const { error: dbError } = await supabaseAdmin.from('users').insert({
      id: authUser.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: role.toUpperCase(),
      is_verified: true,
      is_active: true,
    })
    // CHANGED: log before throwing so failures are visible in server logs
    // instead of surfacing only as a generic 500 to the client.
    if (dbError) {
      console.error('[register] users insert failed:', dbError)
      throw dbError
    }

    const token = signToken({
      sub: authUser.user.id,
      email,
      role: role.toLowerCase() as any,
    })
    const refreshToken = signRefreshToken(authUser.user.id)

    res.status(201).json({
      message: 'Account created. Please verify your email.',
      token,
      refreshToken,
      user: {
        id: authUser.user.id,
        email,
        firstName,
        lastName,
        role,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const role = data.user.user_metadata?.role ?? 'guest'

    const token = signToken({
      sub: data.user.id,
      email: data.user.email!,
      role,
    })
    const refreshToken = signRefreshToken(data.user.id)

    // Save refresh token in DB
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const { error: dbError } = await supabaseAdmin.from('refresh_tokens').insert({
      id: crypto.randomUUID(),
      token: refreshToken,
      user_id: data.user.id,
      expires_at: expiresAt.toISOString()
    })
    // CHANGED: log before throwing (see register() above for why)
    if (dbError) {
      console.error('[login] refresh_tokens insert failed:', dbError)
      throw dbError
    }

    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.json({
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
        ...data.user.user_metadata,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function adminLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    let role = data.user.user_metadata?.role
    if (!role || role.toLowerCase() !== 'admin') {
      const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()
      if (dbUser?.role) {
        role = dbUser.role
      }
    }

    if ((role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Administrator privileges required' })
    }

    const token = signToken({
      sub: data.user.id,
      email: data.user.email!,
      role: 'admin',
    })
    const refreshToken = signRefreshToken(data.user.id)

    // Save refresh token in DB
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const { error: dbError } = await supabaseAdmin.from('refresh_tokens').insert({
      id: crypto.randomUUID(),
      token: refreshToken,
      user_id: data.user.id,
      expires_at: expiresAt.toISOString()
    })

    if (dbError) {
      console.error('[adminLogin] refresh_tokens insert failed:', dbError)
      throw dbError
    }

    res.cookie('refreshToken', refreshToken, cookieOptions)

    res.json({
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: 'admin',
        ...data.user.user_metadata,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' })
    }

    const jwt = await import('jsonwebtoken')
    const { REFRESH_TOKEN_SECRET } = await import('../config/env.js')

    let payload: { sub: string }
    try {
      payload = jwt.default.verify(refreshToken, REFRESH_TOKEN_SECRET as string) as { sub: string }
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token signature' })
    }

    const userId = payload.sub

    // Check if token exists in the database
    const { data: dbToken, error: findError } = await supabaseAdmin
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .maybeSingle()

    if (findError) throw findError

    let isValid = false
    if (dbToken) {
      const isExpired = new Date(dbToken.expires_at).getTime() < Date.now()
      if (!isExpired) {
        isValid = true
      }
    }

    if (!isValid) {
      // Check grace period cache
      const graceUserId = await isTokenInGracePeriod(refreshToken)
      if (graceUserId === userId) {
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId)
        if (!user.user) {
          return res.status(401).json({ error: 'User not found' })
        }
        const { data: dbUser } = await supabaseAdmin.from('users').select('role').eq('id', userId).maybeSingle()
        const userRole = (dbUser?.role || user.user.user_metadata?.role || 'guest').toLowerCase()

        const newToken = signToken({
          sub: userId,
          email: user.user.email!,
          role: userRole as any,
        })
        return res.json({ token: newToken })
      }

      // Reuse Attack Detected!
      console.warn(`[SECURITY ALERT] Refresh token reuse detected for User ${userId}. Revoking all sessions!`)
      await supabaseAdmin.from('refresh_tokens').delete().eq('user_id', userId)
      res.clearCookie('refreshToken', clearCookieOptions)
      return res.status(401).json({ error: 'SESSION_COMPROMISED' })
    }

    // Token is valid! Rotate it.
    // 1. Delete old token
    await supabaseAdmin.from('refresh_tokens').delete().eq('token', refreshToken)

    // 2. Put old token into grace period cache
    await addTokenToGracePeriod(refreshToken, userId)

    // 3. Issue new tokens
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (!user.user) {
      return res.status(401).json({ error: 'User not found' })
    }

    const { data: dbUser } = await supabaseAdmin.from('users').select('role').eq('id', userId).maybeSingle()
    const userRole = (dbUser?.role || user.user.user_metadata?.role || 'guest').toLowerCase()

    const newAccessToken = signToken({
      sub: userId,
      email: user.user.email!,
      role: userRole as any,
    })
    const newRefreshToken = signRefreshToken(userId)

    // 4. Save new refresh token in DB
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await supabaseAdmin.from('refresh_tokens').insert({
      id: crypto.randomUUID(),
      token: newRefreshToken,
      user_id: userId,
      expires_at: expiresAt.toISOString()
    })

    // 5. Set new cookie
    res.cookie('refreshToken', newRefreshToken, cookieOptions)

    res.json({ token: newAccessToken })
  } catch (err) {
    next(err)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.token
    const exp = req.user?.exp
    if (token && exp) {
      await blacklistToken(token, exp)
    }

    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
      await supabaseAdmin.from('refresh_tokens').delete().eq('token', refreshToken)
    }

    res.clearCookie('refreshToken', clearCookieOptions)

    if (req.user?.sub) {
      await supabaseAdmin.auth.admin.signOut(req.user.sub)
    }

    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(req.user!.sub)
    if (!user.user) return res.status(404).json({ error: 'User not found' })

    res.json({
      id: user.user.id,
      email: user.user.email,
      role: user.user.user_metadata?.role,
      isVerified: user.user.email_confirmed_at != null,
      ...user.user.user_metadata,
    })
  } catch (err) {
    next(err)
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body

    // 1. Verify user exists in DB and has ADMIN privileges
    const { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role')
      .ilike('email', email.trim())
      .maybeSingle()

    // Generic safe response message to prevent email harvesting
    const successMsg = 'If an administrator account with this email exists, password reset instructions have been sent.'

    if (!dbUser || (dbUser.role || '').toLowerCase() !== 'admin') {
      return res.json({ message: successMsg })
    }

    // 2. Generate signed reset JWT (valid for 15 minutes)
    const resetToken = jwt.sign(
      {
        sub: dbUser.id,
        email: dbUser.email,
        purpose: 'admin_password_reset',
      },
      JWT_SECRET as string,
      { expiresIn: '15m' }
    )

    // 3. Resolve frontend URL
    const frontendUrl =
      req.headers.origin ||
      (CORS_ORIGINS ? CORS_ORIGINS.split(',')[0].trim() : 'http://localhost:5173')
    const resetUrl = `${frontendUrl}/admin?resetToken=${encodeURIComponent(resetToken)}`

    // 4. Send email
    const recipientName = dbUser.first_name ? `${dbUser.first_name} ${dbUser.last_name || ''}`.trim() : 'Administrator'
    const emailHtml = compileResetPasswordEmail({
      recipientName,
      resetUrl,
      expiresInMinutes: 15,
    })

    await sendEmail({
      to: dbUser.email,
      subject: '🔒 Reset Your JHUB Africa Administrator Password',
      html: emailHtml,
    })

    console.info(`🔑 [ADMIN PASSWORD RESET LINK]: ${resetUrl}`)

    res.json({
      message: successMsg,
      // In development or simulation mode, return the resetUrl for ease of testing
      ...(!isProd ? { devResetUrl: resetUrl } : {})
    })
  } catch (err) {
    next(err)
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body

    // 1. Verify reset token
    let payload: { sub: string; email: string; purpose: string }
    try {
      payload = jwt.verify(token, JWT_SECRET as string) as any
    } catch (jwtErr: any) {
      if (jwtErr?.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'This password reset link has expired. Please request a new one.' })
      }
      return res.status(400).json({ error: 'Invalid or malformed password reset link.' })
    }

    if (payload.purpose !== 'admin_password_reset' || !payload.sub) {
      return res.status(400).json({ error: 'Invalid reset token purpose.' })
    }

    // 2. Verify user in DB is still an admin
    const { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('id', payload.sub)
      .maybeSingle()

    if (!dbUser || (dbUser.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'User is not authorized for administrator password reset.' })
    }

    // 3. Update password in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(payload.sub, {
      password: newPassword,
    })

    if (updateError) {
      console.error('[resetPassword] Supabase update password failed:', updateError)
      throw updateError
    }

    // 4. Invalidate all active refresh tokens for this user
    await supabaseAdmin.from('refresh_tokens').delete().eq('user_id', payload.sub)

    res.json({
      message: 'Password has been successfully updated. You can now log in with your new password.'
    })
  } catch (err) {
    next(err)
  }
}