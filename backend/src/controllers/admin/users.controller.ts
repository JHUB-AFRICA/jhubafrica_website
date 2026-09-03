import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../../config/supabase.js'

export async function getAdminUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, is_active, is_verified, created_at')
      .eq('role', 'ADMIN')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(users || [])
  } catch (err) {
    next(err)
  }
}

export async function createAdminUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, firstName, lastName, role = 'ADMIN' } = req.body

    // Check if email is already registered in public users
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .ilike('email', email.trim())
      .maybeSingle()

    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email address already exists.' })
    }

    // Create user in Supabase Auth via Admin client
    const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { firstName, lastName, role: role.toUpperCase() },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return res.status(409).json({ error: 'A user with this email address already exists in authentication.' })
      }
      throw error
    }

    // Sync user profile into public users table
    const { data: profile, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        email: email.trim(),
        first_name: firstName,
        last_name: lastName,
        role: role.toUpperCase(),
        is_verified: true,
        is_active: true,
      })
      .select('id, email, first_name, last_name, role, is_active, is_verified, created_at')
      .single()

    if (dbError) {
      console.error('[createAdminUser] DB profile sync error:', dbError)
      throw dbError
    }

    res.status(201).json({
      message: 'Admin account created successfully',
      user: profile,
    })
  } catch (err) {
    next(err)
  }
}

