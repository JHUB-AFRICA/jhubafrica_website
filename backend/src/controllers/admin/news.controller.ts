import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../../config/supabase.js'
import { redis, CacheKey } from '../../config/redis.js'
import { NotFoundError } from '../../middleware/error.middleware.js'

export async function getAdminPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, category, featured, search, tag, status } = req.query as any
    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50))
    const offset = (pageNum - 1) * limitNum

    let query = supabaseAdmin
      .from('posts')
      .select(`
        id, slug, title, excerpt, content, category, is_published,
        is_featured, published_at, cover_image_url, tags, authorId, created_at, updated_at,
        post_images ( id, url, order )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (category) query = query.eq('category', category)
    if (status)   query = query.eq('status', status)
    if (featured) query = query.eq('is_featured', true)
    if (search)   query = query.ilike('title', `%${search}%`)
    if (tag)      query = query.contains('tags', [tag])

    let result = await query

    if (result.error) {
      console.warn('[getAdminPosts fallback]:', result.error.message)
      let fallbackQuery = supabaseAdmin
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limitNum - 1)

      if (category) fallbackQuery = fallbackQuery.eq('category', category)
      if (featured) fallbackQuery = fallbackQuery.eq('is_featured', true)
      if (search)   fallbackQuery = fallbackQuery.ilike('title', `%${search}%`)

      result = await fallbackQuery
      if (result.error) throw result.error
    }

    const { data, count } = result

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

export async function getAdminPostById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    let resData = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        post_images ( id, url, order )
      `)
      .eq('id', id)
      .maybeSingle()

    if (resData.error) {
      resData = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (resData.error) throw resData.error
    }

    if (!resData.data) throw new NotFoundError('Article')

    const mapped = {
      ...resData.data,
      images: Array.isArray(resData.data.post_images)
        ? resData.data.post_images.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        : (resData.data.cover_image_url ? [{ url: resData.data.cover_image_url, order: 0 }] : []),
    }

    res.json({ data: mapped })
  } catch (err) {
    next(err)
  }
}

export async function createAdminPost(req: Request, res: Response, next: NextFunction) {
  try {
    const slugify = (await import('slugify')).default
    const slug = slugify(req.body.title, { lower: true, strict: true })

    const {
      title,
      excerpt,
      content,
      contentJson,
      category,
      isPublished,
      status,
      isFeatured,
      publishedAt,
      coverImageUrl,
      images,
      tags,
      authorId
    } = req.body

    const effectiveStatus = status || (isPublished ? 'PUBLISHED' : 'DRAFT')
    const effectiveIsPublished = effectiveStatus === 'PUBLISHED' || Boolean(isPublished)
    const effectiveCoverImage = coverImageUrl || (Array.isArray(images) && images.length > 0 ? (typeof images[0] === 'string' ? images[0] : images[0]?.url) : null)
    const newPostId = crypto.randomUUID()

    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        id: newPostId,
        slug,
        title,
        excerpt: excerpt || null,
        content: content || '',
        content_json: contentJson || null,
        category: category || 'news',
        is_published: effectiveIsPublished,
        status: effectiveStatus,
        is_featured: Boolean(isFeatured),
        published_at: publishedAt || (effectiveIsPublished ? new Date().toISOString() : null),
        cover_image_url: effectiveCoverImage,
        tags: tags || [],
        authorId: authorId || null,
      })
      .select()
      .single()

    if (error) throw error

    // Insert associated images if supplied
    if (Array.isArray(images) && images.length > 0) {
      const imageRows = images.map((img: any, idx: number) => ({
        id: crypto.randomUUID(),
        post_id: newPostId,
        url: typeof img === 'string' ? img : img.url,
        order: typeof img === 'object' && typeof img.order === 'number' ? img.order : idx,
      })).filter((row) => Boolean(row.url))

      if (imageRows.length > 0) {
        await supabaseAdmin.from('post_images').insert(imageRows)
      }
    }

    // Evict Redis Cache
    if (redis) {
      await Promise.all([
        redis.del(CacheKey.news()),
        redis.del(CacheKey.news('featured')),
      ])
    }

    // Retrieve created post with images
    const { data: fullPost } = await supabaseAdmin
      .from('posts')
      .select(`*, post_images ( id, url, order )`)
      .eq('id', newPostId)
      .single()

    res.status(201).json({
      data: {
        ...(fullPost || data),
        images: ((fullPost?.post_images || [])).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function updateAdminPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const {
      title,
      excerpt,
      content,
      contentJson,
      category,
      isPublished,
      status,
      isFeatured,
      publishedAt,
      coverImageUrl,
      images,
      tags,
      authorId
    } = req.body

    // Retrieve existing post to clear specific slug cache
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('slug, published_at, status')
      .eq('id', id)
      .single()

    const updates: any = {}
    if (title !== undefined) {
      updates.title = title
      const slugify = (await import('slugify')).default
      updates.slug = slugify(title, { lower: true, strict: true })
    }
    if (excerpt !== undefined) updates.excerpt = excerpt || null
    if (content !== undefined) updates.content = content
    if (contentJson !== undefined) updates.content_json = contentJson
    if (category !== undefined) updates.category = category

    if (status !== undefined) {
      updates.status = status
      updates.is_published = status === 'PUBLISHED'
      if (status === 'PUBLISHED' && !existing?.published_at && !publishedAt) {
        updates.published_at = new Date().toISOString()
      }
    } else if (isPublished !== undefined) {
      updates.is_published = isPublished
      updates.status = isPublished ? 'PUBLISHED' : 'DRAFT'
      if (isPublished && !existing?.published_at && !publishedAt) {
        updates.published_at = new Date().toISOString()
      }
    }

    if (isFeatured !== undefined) updates.is_featured = isFeatured
    if (publishedAt !== undefined) updates.published_at = publishedAt || null
    if (coverImageUrl !== undefined) updates.cover_image_url = coverImageUrl || null
    if (tags !== undefined) updates.tags = tags
    if (authorId !== undefined) updates.authorId = authorId || null

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) throw new NotFoundError('Article')

    // If full images array passed, synchronize post_images
    if (Array.isArray(images)) {
      await supabaseAdmin.from('post_images').delete().eq('post_id', id)
      const imageRows = images.map((img: any, idx: number) => ({
        id: crypto.randomUUID(),
        post_id: id,
        url: typeof img === 'string' ? img : img.url,
        order: typeof img === 'object' && typeof img.order === 'number' ? img.order : idx,
      })).filter((row) => Boolean(row.url))

      if (imageRows.length > 0) {
        await supabaseAdmin.from('post_images').insert(imageRows)
      }
    }

    // Evict Redis Cache
    if (redis) {
      const cacheKeys = [
        CacheKey.news(),
        CacheKey.news('featured'),
      ]
      if (existing?.slug) cacheKeys.push(CacheKey.news(existing.slug))
      if (data.slug && data.slug !== existing?.slug) cacheKeys.push(CacheKey.news(data.slug))

      const client = redis
      await Promise.all(cacheKeys.map(k => client.del(k)))
    }

    // Retrieve updated post with images
    const { data: fullPost } = await supabaseAdmin
      .from('posts')
      .select(`*, post_images ( id, url, order )`)
      .eq('id', id)
      .single()

    res.json({
      data: {
        ...(fullPost || data),
        images: ((fullPost?.post_images || [])).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteAdminPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params

    // Retrieve existing post to clear specific slug cache & get image urls for cleanup
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('slug, post_images ( url )')
      .eq('id', id)
      .single()

    // Delete post (cascade will delete post_images in DB)
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Storage cleanup for deleted images
    if (existing?.post_images && existing.post_images.length > 0) {
      try {
        const filePaths = existing.post_images
          .map((img: any) => {
            const parts = (img.url || '').split('/post-images/')
            return parts.length > 1 ? decodeURIComponent(parts[1].split('?')[0]) : null
          })
          .filter(Boolean) as string[]

        if (filePaths.length > 0) {
          await supabaseAdmin.storage.from('post-images').remove(filePaths)
        }
      } catch (storageErr) {
        console.warn('[Storage Cleanup Warning]:', storageErr)
      }
    }

    // Evict Redis Cache
    if (redis) {
      const cacheKeys = [
        CacheKey.news(),
        CacheKey.news('featured'),
      ]
      if (existing?.slug) cacheKeys.push(CacheKey.news(existing.slug))

      const client = redis
      await Promise.all(cacheKeys.map(k => client.del(k)))
    }

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
