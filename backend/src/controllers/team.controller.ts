import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase.js'

export async function getTeamMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query as any
    let query = supabase
      .from('jhub_team_members')
      .select('id, name, title, bio, avatar_url, category')
      .order('name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    res.json({ data })
  } catch (err) {
    next(err)
  }
}
