import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase.js'
import { withCache, CacheKey, CacheTTL } from '../config/redis.js'
import { NotFoundError } from '../middleware/error.middleware.js'

export async function getNews(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, category, featured, search, tag } = req.query as any
    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20))
    const offset = (pageNum - 1) * limitNum

    let query = supabase
      .from('posts')
      .select(`
        id, slug, title, content, excerpt, category, published_at,
        is_featured, is_published, cover_image_url, tags,
        post_images ( id, url, order )
      `, { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (category) query = query.eq('category', category)
    if (featured) query = query.eq('is_featured', true)
    if (search)   query = query.ilike('title', `%${search}%`)
    if (tag)      query = query.contains('tags', [tag])

    let result = await query

    // Fallback if post_images relation does not exist in Supabase DB yet
    if (result.error) {
      console.warn('[getNews fallback query triggered]:', result.error.message)
      let fallbackQuery = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .range(offset, offset + limitNum - 1)

      if (category) fallbackQuery = fallbackQuery.eq('category', category)
      if (featured) fallbackQuery = fallbackQuery.eq('is_featured', true)
      if (search)   fallbackQuery = fallbackQuery.ilike('title', `%${search}%`)

      result = await fallbackQuery
      if (result.error) throw result.error
    }

    const { data, count } = result

    // Normalize post_images
    const mapped = (data || []).map((p: any) => ({
      ...p,
      images: Array.isArray(p.post_images)
        ? p.post_images.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        : (p.cover_image_url ? [{ url: p.cover_image_url, order: 0 }] : []),
    }))

    res.json({
      data: mapped,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: count ?? mapped.length,
        totalPages: Math.ceil((count ?? mapped.length) / limitNum),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getFeaturedNews(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await withCache(CacheKey.news('featured'), CacheTTL.short, async () => {
      let query = supabase
        .from('posts')
        .select(`
          id, slug, title, excerpt, category, published_at, cover_image_url,
          post_images ( id, url, order )
        `)
        .eq('is_published', true)
        .eq('is_featured', true)
        .limit(4)

      let res = await query
      if (res.error) {
        let fallback = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .eq('is_featured', true)
          .limit(4)
        if (fallback.error) throw fallback.error
        res = fallback
      }

      return (res.data || []).map((p: any) => ({
        ...p,
        images: Array.isArray(p.post_images)
          ? p.post_images.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          : (p.cover_image_url ? [{ url: p.cover_image_url, order: 0 }] : []),
      }))
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

export async function getArticleBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params
    const data = await withCache(CacheKey.news(slug), CacheTTL.medium, async () => {
      let res = await supabase
        .from('posts')
        .select(`
          *,
          post_images ( id, url, order )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()

      if (res.error) {
        let fallback = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle()
        if (fallback.error) throw fallback.error
        res = fallback
      }

      if (!res.data) return null

      return {
        ...res.data,
        images: Array.isArray(res.data.post_images)
          ? res.data.post_images.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          : (res.data.cover_image_url ? [{ url: res.data.cover_image_url, order: 0 }] : []),
      }
    })
    if (!data) throw new NotFoundError('Article')
    res.json({ data })
  } catch (err) {
    next(err)
  }
}
