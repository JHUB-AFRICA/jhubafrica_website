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
        id, slug, title, author, excerpt, content, content_json, category, status, is_published,
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

/**
 * Auto-extracts a clean, uniform summary excerpt from HTML or TipTap JSON
 */
function generateExcerpt(content?: string, contentJson?: any, maxChars = 140): string {
  let plainText = ''

  if (contentJson && typeof contentJson === 'object') {
    const extractText = (node: any): string => {
      if (!node) return ''
      if (node.text) return node.text
      if (Array.isArray(node.content)) {
        return node.content.map(extractText).join(' ')
      }
      return ''
    }
    plainText = extractText(contentJson).trim()
  }

  if (!plainText && content) {
    plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  if (!plainText) return ''
  if (plainText.length <= maxChars) return plainText

  const sub = plainText.substring(0, maxChars)
  const lastSpace = sub.lastIndexOf(' ')
  return (lastSpace > 60 ? sub.substring(0, lastSpace) : sub).trim() + '...'
}

export async function createAdminPost(req: Request, res: Response, next: NextFunction) {
  try {
    const slugify = (await import('slugify')).default
    const slug = slugify(req.body.title, { lower: true, strict: true })

    const {
      title,
      author,
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
    const effectiveExcerpt = (excerpt && excerpt.trim()) || generateExcerpt(content, contentJson, 140)
    const newPostId = crypto.randomUUID()

    const fullPayload: any = {
      id: newPostId,
      slug,
      title,
      author: author || 'JHUB Editorial Team',
      excerpt: effectiveExcerpt || null,
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
    }

    let { data, error } = await supabaseAdmin
      .from('posts')
      .insert(fullPayload)
      .select()
      .single()

    // Schema fallback if content_json or status column is not present in remote database
    if (error && (error.code === 'PGRST204' || error.message?.includes('schema cache') || error.message?.includes('column'))) {
      console.warn('[createAdminPost fallback]: content_json/status column missing in DB, retrying with core columns:', error.message)
      const corePayload: any = {
        id: newPostId,
        slug,
        title,
        excerpt: effectiveExcerpt || null,
        content: content || '',
        category: category || 'news',
        is_published: effectiveIsPublished,
        is_featured: Boolean(isFeatured),
        published_at: publishedAt || (effectiveIsPublished ? new Date().toISOString() : null),
        cover_image_url: effectiveCoverImage,
        tags: tags || [],
      }
      const retry = await supabaseAdmin
        .from('posts')
        .insert(corePayload)
        .select()
        .single()

      if (retry.error) throw retry.error
      data = retry.data
    } else if (error) {
      throw error
    }

    // Insert associated images if table exists
    if (Array.isArray(images) && images.length > 0) {
      const imageRows = images.map((img: any, idx: number) => ({
        id: crypto.randomUUID(),
        post_id: newPostId,
        url: typeof img === 'string' ? img : img.url,
        order: typeof img === 'object' && typeof img.order === 'number' ? img.order : idx,
      })).filter((row) => Boolean(row.url))

      if (imageRows.length > 0) {
        try {
          const imgRes = await supabaseAdmin.from('post_images').insert(imageRows)
          if (imgRes.error) {
            console.warn('[createAdminPost] post_images insert warning:', imgRes.error.message)
          }
        } catch (imgErr: any) {
          console.warn('[createAdminPost] post_images insert skipped:', imgErr?.message)
        }
      }
    }

    // Evict Redis Cache
    if (redis) {
      await Promise.all([
        redis.del(CacheKey.news()),
        redis.del(CacheKey.news('featured')),
      ]).catch(() => {})
    }

    // Retrieve created post with images
    let fullPostRes = await supabaseAdmin
      .from('posts')
      .select(`*, post_images ( id, url, order )`)
      .eq('id', newPostId)
      .maybeSingle()

    if (fullPostRes.error) {
      fullPostRes = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('id', newPostId)
        .maybeSingle()
    }

    const fullPost = fullPostRes.data || data
    const mappedImages = Array.isArray(fullPost?.post_images)
      ? fullPost.post_images.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      : (effectiveCoverImage ? [{ url: effectiveCoverImage, order: 0 }] : [])

    res.status(201).json({
      data: {
        ...fullPost,
        images: mappedImages,
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
      author,
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
      .maybeSingle()

    const updates: any = {}
    if (title !== undefined) {
      updates.title = title
      const slugify = (await import('slugify')).default
      updates.slug = slugify(title, { lower: true, strict: true })
    }
    if (author !== undefined) {
      updates.author = author || 'JHUB Editorial Team'
    }
    if (excerpt !== undefined) {
      updates.excerpt = excerpt && excerpt.trim() ? excerpt.trim() : generateExcerpt(content, contentJson, 140)
    }
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

    let { data, error } = await supabaseAdmin
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error && (error.code === 'PGRST204' || error.message?.includes('schema cache') || error.message?.includes('column'))) {
      console.warn('[updateAdminPost fallback]: Retrying update without content_json/status:', error.message)
      delete updates.content_json
      delete updates.status
      delete updates.authorId
      const retry = await supabaseAdmin
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (retry.error) throw retry.error
      data = retry.data
    } else if (error || !data) {
      throw error || new NotFoundError('Article')
    }

    // Sync multi-images if provided
    if (Array.isArray(images)) {
      try {
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
      } catch (imgErr: any) {
        console.warn('[updateAdminPost] post_images sync skipped:', imgErr?.message)
      }
    }

    // Evict Redis Cache
    if (redis) {
      await Promise.all([
        redis.del(CacheKey.news()),
        redis.del(CacheKey.news('featured')),
        existing?.slug ? redis.del(CacheKey.news(existing.slug)) : Promise.resolve(),
        updates.slug && updates.slug !== existing?.slug ? redis.del(CacheKey.news(updates.slug)) : Promise.resolve(),
      ]).catch(() => {})
    }

    let fullPostRes = await supabaseAdmin
      .from('posts')
      .select(`*, post_images ( id, url, order )`)
      .eq('id', id)
      .maybeSingle()

    if (fullPostRes.error) {
      fullPostRes = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('id', id)
        .maybeSingle()
    }

    const fullPost = fullPostRes.data || data
    const mappedImages = Array.isArray(fullPost?.post_images)
      ? fullPost.post_images.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      : (fullPost?.cover_image_url ? [{ url: fullPost.cover_image_url, order: 0 }] : [])

    res.json({
      data: {
        ...fullPost,
        images: mappedImages,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteAdminPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params

    // 1. Retrieve existing post info safely
    let existing: any = null
    try {
      const { data } = await supabaseAdmin
        .from('posts')
        .select('slug, cover_image_url')
        .eq('id', id)
        .maybeSingle()
      existing = data
    } catch (fetchErr) {
      console.warn('[deleteAdminPost] fetch post warning:', fetchErr)
    }

    // 2. Fetch associated post_images if table exists
    let postImages: any[] = []
    try {
      const { data: imgData } = await supabaseAdmin
        .from('post_images')
        .select('url')
        .eq('post_id', id)
      if (Array.isArray(imgData)) postImages = imgData
    } catch {
      // Ignored if post_images relation does not exist
    }

    // 3. Delete from post_images first if table exists
    try {
      await supabaseAdmin.from('post_images').delete().eq('post_id', id)
    } catch (imgDelErr) {
      console.warn('[deleteAdminPost] post_images delete skipped:', imgDelErr)
    }

    // 4. Delete from posts table
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[deleteAdminPost error]:', error)
      throw error
    }

    // 5. Cleanup storage files if applicable
    const allImageUrls = [
      existing?.cover_image_url,
      ...postImages.map((img: any) => img.url),
    ].filter(Boolean)

    if (allImageUrls.length > 0) {
      try {
        const filePaths = allImageUrls
          .map((url: string) => {
            const parts = url.split('/post-images/')
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

    // 6. Evict Redis Cache
    if (redis) {
      const cacheKeys = [
        CacheKey.news(),
        CacheKey.news('featured'),
      ]
      if (existing?.slug) cacheKeys.push(CacheKey.news(existing.slug))

      const client = redis
      await Promise.all(cacheKeys.map((k) => client.del(k))).catch(() => {})
    }

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
