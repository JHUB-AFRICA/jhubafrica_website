import { Router, Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import multer from 'multer'
import { supabaseAdmin } from '../../config/supabase.js'

const ALLOWED_BUCKETS = ['post-images', 'innovation-images', 'images', 'uploads', 'media'] as const
type AllowedBucket = typeof ALLOWED_BUCKETS[number]

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
})

export const adminUploadsRouter = Router()

/**
 * Ensures bucket exists and is public in Supabase Storage
 */
async function ensureBucket(bucketName: string) {
  try {
    const { data: bucket, error } = await supabaseAdmin.storage.getBucket(bucketName)
    if (error || !bucket) {
      console.log(`[Uploads] Bucket '${bucketName}' not found. Creating public bucket...`)
      const { error: createErr } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 15728640, // 15MB
      })
      if (createErr && !createErr.message.includes('already exists')) {
        console.warn(`[Uploads] createBucket warning for '${bucketName}':`, createErr.message)
      }
    }
  } catch (e: any) {
    console.warn(`[Uploads] ensureBucket caught error:`, e?.message)
  }
}

/**
 * POST /api/v1/admin/uploads/sign
 * Generates a signed upload URL for direct binary client-to-Supabase upload.
 */
adminUploadsRouter.post('/sign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bucket, filename, folder } = req.body
    const targetBucket = (bucket || 'post-images') as AllowedBucket

    if (!ALLOWED_BUCKETS.includes(targetBucket)) {
      return res.status(400).json({
        error: `Invalid bucket. Allowed buckets: ${ALLOWED_BUCKETS.join(', ')}`,
      })
    }

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' })
    }

    // Auto-ensure bucket exists
    await ensureBucket(targetBucket)

    // Sanitize folder & filename
    const cleanFolder = typeof folder === 'string' && folder.trim()
      ? folder.trim().replace(/[^a-zA-Z0-9_\-\/]/g, '_').replace(/^\/+|\/+$/g, '')
      : ''
    const sanitizedName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const uniqueId = crypto.randomUUID()
    const fileNameWithPrefix = `${Date.now()}-${uniqueId}-${sanitizedName}`
    const filePath = cleanFolder ? `${cleanFolder}/${fileNameWithPrefix}` : fileNameWithPrefix

    // Create signed upload URL from Supabase Storage
    let { data, error } = await supabaseAdmin.storage
      .from(targetBucket)
      .createSignedUploadUrl(filePath)

    if (error) {
      console.warn('[Uploads] Error creating signed upload URL, re-attempting bucket creation:', error.message)
      await supabaseAdmin.storage.createBucket(targetBucket, { public: true }).catch(() => {})
      const retry = await supabaseAdmin.storage.from(targetBucket).createSignedUploadUrl(filePath)
      if (retry.error) {
        console.error('[Uploads] Retry failed:', retry.error)
        return res.status(500).json({ error: retry.error.message || 'Failed to create signed upload URL' })
      }
      data = retry.data
    }

    const { data: publicData } = supabaseAdmin.storage
      .from(targetBucket)
      .getPublicUrl(filePath)

    res.json({
      signedUrl: data?.signedUrl,
      token: data?.token,
      path: data?.path || filePath,
      publicUrl: publicData.publicUrl,
      folder: cleanFolder || null,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/v1/admin/uploads/direct
 * Direct fallback upload endpoint through Express server using service role
 */
adminUploadsRouter.post(
  '/direct',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file
      const bucket = (req.body.bucket || 'post-images') as AllowedBucket
      const folder = req.body.folder

      if (!file) {
        return res.status(400).json({ error: 'File is required' })
      }

      if (!ALLOWED_BUCKETS.includes(bucket)) {
        return res.status(400).json({ error: 'Invalid bucket' })
      }

      await ensureBucket(bucket)

      const cleanFolder = typeof folder === 'string' && folder.trim()
        ? folder.trim().replace(/[^a-zA-Z0-9_\-\/]/g, '_').replace(/^\/+|\/+$/g, '')
        : ''
      const sanitizedName = (file.originalname || 'image.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')
      const uniqueId = crypto.randomUUID()
      const fileNameWithPrefix = `${Date.now()}-${uniqueId}-${sanitizedName}`
      const filePath = cleanFolder ? `${cleanFolder}/${fileNameWithPrefix}` : fileNameWithPrefix

      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype || 'image/jpeg',
          upsert: true,
        })

      if (uploadError) {
        console.error('[Uploads Direct] Supabase upload failed:', uploadError)
        return res.status(500).json({ error: uploadError.message || 'Upload failed' })
      }

      const { data: publicData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath)

      res.json({
        url: publicData.publicUrl,
        path: filePath,
        folder: cleanFolder || null,
      })
    } catch (err) {
      next(err)
    }
  }
)

/**
 * GET /api/v1/admin/uploads/folders
 * Lists all existing folders within a storage bucket
 */
adminUploadsRouter.get('/folders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bucket = (req.query.bucket || 'post-images') as AllowedBucket
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return res.status(400).json({ error: 'Invalid bucket' })
    }

    await ensureBucket(bucket)

    const { data, error } = await supabaseAdmin.storage.from(bucket).list('', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) {
      console.warn('[Uploads] Error listing folders:', error.message)
      return res.json({ folders: ['news', 'events', 'innovations', 'gallery', 'general'] })
    }

    // Folders in Supabase Storage have id === null or are objects with no metadata
    const discoveredFolders = (data || [])
      .filter((item: any) => !item.id || item.metadata === null || !item.name.includes('.'))
      .map((item: any) => item.name)

    const defaultFolders = ['news', 'events', 'innovations', 'gallery', 'general']
    const combined = Array.from(new Set([...defaultFolders, ...discoveredFolders]))

    res.json({ folders: combined })
  } catch (err) {
    next(err)
  }
})

export default adminUploadsRouter

