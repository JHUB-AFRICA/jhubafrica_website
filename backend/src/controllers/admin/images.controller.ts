import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../../config/supabase.js'
import { redis, CacheKey } from '../../config/redis.js'
import { NotFoundError } from '../../middleware/error.middleware.js'

function getResourceConfig(resource: string) {
  if (resource === 'posts' || resource === 'news') {
    return {
      table: 'post_images',
      foreignKey: 'post_id',
      parentTable: 'posts',
      bucket: 'post-images',
      cachePrefix: (slug?: string) => [CacheKey.news(), CacheKey.news('featured'), ...(slug ? [CacheKey.news(slug)] : [])],
    }
  }
  if (resource === 'innovations') {
    return {
      table: 'innovation_images',
      foreignKey: 'innovation_id',
      parentTable: 'innovations',
      bucket: 'innovation-images',
      cachePrefix: (slug?: string) => [CacheKey.innovations(), ...(slug ? [CacheKey.innovations(slug)] : [])],
    }
  }
  return null
}

async function evictParentCache(config: ReturnType<typeof getResourceConfig>, parentId: string) {
  if (!redis || !config) return
  try {
    const { data: parent } = await supabaseAdmin
      .from(config.parentTable)
      .select('slug')
      .eq('id', parentId)
      .single()

    const keys = config.cachePrefix(parent?.slug)
    await Promise.all(keys.map(k => redis!.del(k)))
  } catch (err) {
    console.warn('[Cache Eviction Warning]:', err)
  }
}

export async function addImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { resource, id } = req.params
    const { url, order } = req.body

    const config = getResourceConfig(resource)
    if (!config) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` })
    }

    if (!url) {
      return res.status(400).json({ error: 'Image url is required' })
    }

    let nextOrder = typeof order === 'number' ? order : 0
    if (typeof order !== 'number') {
      const { data: existing } = await supabaseAdmin
        .from(config.table)
        .select('order')
        .eq(config.foreignKey, id)
        .order('order', { ascending: false })
        .limit(1)

      if (existing && existing.length > 0) {
        nextOrder = (existing[0].order ?? 0) + 1
      }
    }

    const newImageId = crypto.randomUUID()
    const { data, error } = await supabaseAdmin
      .from(config.table)
      .insert({
        id: newImageId,
        [config.foreignKey]: id,
        url,
        order: nextOrder,
      })
      .select()
      .single()

    if (error) throw error

    await evictParentCache(config, id)

    res.status(201).json({ data })
  } catch (err) {
    next(err)
  }
}

export async function reorderImages(req: Request, res: Response, next: NextFunction) {
  try {
    const { resource, id } = req.params
    const { images } = req.body as { images: Array<{ id: string; order: number }> }

    const config = getResourceConfig(resource)
    if (!config) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` })
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' })
    }

    // Update order for each image
    const updatePromises = images.map((img) =>
      supabaseAdmin
        .from(config.table)
        .update({ order: img.order })
        .eq('id', img.id)
        .eq(config.foreignKey, id)
    )

    await Promise.all(updatePromises)

    await evictParentCache(config, id)

    // Return updated images list
    const { data: updatedImages, error } = await supabaseAdmin
      .from(config.table)
      .select('*')
      .eq(config.foreignKey, id)
      .order('order', { ascending: true })

    if (error) throw error

    res.json({ data: updatedImages })
  } catch (err) {
    next(err)
  }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { resource, imageId } = req.params

    const config = getResourceConfig(resource)
    if (!config) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` })
    }

    // Retrieve image to find url and parent id
    const { data: img, error: findError } = await supabaseAdmin
      .from(config.table)
      .select('*')
      .eq('id', imageId)
      .single()

    if (findError || !img) {
      throw new NotFoundError('Image')
    }

    const parentId = img[config.foreignKey]

    // Delete DB record
    const { error: deleteError } = await supabaseAdmin
      .from(config.table)
      .delete()
      .eq('id', imageId)

    if (deleteError) throw deleteError

    // Attempt to remove file from Supabase Storage
    if (img.url) {
      try {
        const urlParts = img.url.split(`/${config.bucket}/`)
        if (urlParts.length > 1) {
          const storagePath = decodeURIComponent(urlParts[1].split('?')[0])
          await supabaseAdmin.storage.from(config.bucket).remove([storagePath])
        }
      } catch (storageErr) {
        console.warn('[Storage Cleanup Warning]:', storageErr)
      }
    }

    if (parentId) {
      await evictParentCache(config, parentId)
    }

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
