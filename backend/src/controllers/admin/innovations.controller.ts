import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../../config/supabase.js'
import { redis, CacheKey } from '../../config/redis.js'
import { NotFoundError } from '../../middleware/error.middleware.js'

export async function updateSubmissionStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { status } = req.body

    const { data, error } = await supabaseAdmin
      .from('innovations')
      .update({ status })
      .eq('id', id)
      .select('*, team_members(*)')
      .single()

    if (error || !data) throw new NotFoundError('Innovation')

    if (redis) {
      try {
        await redis.del(CacheKey.innovations())
        await redis.del(CacheKey.innovations('featured'))
        if (data.slug) await redis.del(CacheKey.innovations(data.slug))
      } catch (cacheErr) {
        console.warn('[updateSubmissionStatus cache invalidation warning]:', cacheErr)
      }
    }

    res.json({ data })
  } catch (err) {
    next(err)
  }
}

export async function toggleFeatured(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const is_featured = req.body.isFeatured !== undefined ? req.body.isFeatured : true

    const { data, error } = await supabaseAdmin
      .from('innovations')
      .update({ is_featured })
      .eq('id', id)
      .select('*, team_members(*)')
      .single()

    if (error || !data) throw new NotFoundError('Innovation')

    if (redis) {
      try {
        await redis.del(CacheKey.innovations())
        await redis.del(CacheKey.innovations('featured'))
        if (data.slug) await redis.del(CacheKey.innovations(data.slug))
      } catch (cacheErr) {
        console.warn('[toggleFeatured cache invalidation warning]:', cacheErr)
      }
    }

    res.json({ data })
  } catch (err) {
    next(err)
  }
}

export async function getAdminInnovations(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabaseAdmin
      .from('innovations')
      .select('id, slug, title, tagline, description, stage, status, sector, is_featured, cover_image_url, created_at, problem, solution, support_required, team_members(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

export async function deleteAdminInnovation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params

    // 1. Fetch innovation first to obtain metadata and slug
    const { data: existing } = await supabaseAdmin
      .from('innovations')
      .select('id, slug, cover_image_url')
      .eq('id', id)
      .single()

    // 2. Cascade delete related sponsorships
    try {
      await supabaseAdmin
        .from('sponsorships')
        .delete()
        .eq('innovation_id', id)
    } catch (sponsorshipDelErr) {
      console.warn('[deleteAdminInnovation] sponsorships delete skipped:', sponsorshipDelErr)
    }

    // 3. Cascade delete related child team members
    try {
      await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('innovation_id', id)
    } catch (teamDelErr) {
      console.warn('[deleteAdminInnovation] team_members delete skipped:', teamDelErr)
    }

    // 4. Cascade delete related innovation images
    try {
      await supabaseAdmin
        .from('innovation_images')
        .delete()
        .eq('innovation_id', id)
    } catch (imgDelErr) {
      console.warn('[deleteAdminInnovation] innovation_images delete skipped:', imgDelErr)
    }

    // 5. Cascade delete or unlink innovation submissions
    try {
      await supabaseAdmin
        .from('innovation_submissions')
        .delete()
        .eq('innovation_id', id)
    } catch (subDelErr) {
      console.warn('[deleteAdminInnovation] innovation_submissions delete skipped:', subDelErr)
    }

    // 6. Cascade delete any partner requests
    try {
      await supabaseAdmin
        .from('partner_requests')
        .delete()
        .eq('innovation_id', id)
    } catch (partnerDelErr) {
      console.warn('[deleteAdminInnovation] partner_requests delete skipped:', partnerDelErr)
    }

    // 4. Delete innovation record
    const { data, error } = await supabaseAdmin
      .from('innovations')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[deleteAdminInnovation error]:', error)
      throw error
    }

    // 5. Invalidate caches
    if (redis) {
      try {
        await redis.del(CacheKey.innovations())
        await redis.del(CacheKey.innovations('featured'))
        if (existing?.slug) {
          await redis.del(CacheKey.innovations(existing.slug))
        }
      } catch (cacheErr) {
        console.warn('[deleteAdminInnovation cache invalidation warning]:', cacheErr)
      }
    }

    res.json({
      success: true,
      message: 'Innovation deleted successfully',
      data: data || existing,
    })
  } catch (err) {
    next(err)
  }
}
