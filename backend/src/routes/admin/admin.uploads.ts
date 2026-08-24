import { Router, Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { supabaseAdmin } from '../../config/supabase.js'

const ALLOWED_BUCKETS = ['post-images', 'innovation-images'] as const
type AllowedBucket = typeof ALLOWED_BUCKETS[number]

export const adminUploadsRouter = Router()

/**
 * POST /api/v1/admin/uploads/sign
 * Generates a signed upload URL for direct binary client-to-Supabase upload.
 */
adminUploadsRouter.post('/sign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bucket, filename } = req.body

    if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
      return res.status(400).json({
        error: `Invalid bucket. Allowed buckets: ${ALLOWED_BUCKETS.join(', ')}`,
      })
    }

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' })
    }

    // Sanitize filename and create unique path
    const sanitizedName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const uniqueId = crypto.randomUUID()
    const filePath = `${Date.now()}-${uniqueId}-${sanitizedName}`

    // Create signed upload URL from Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(filePath)

    if (error) {
      console.error('[Uploads] Error creating signed upload URL:', error)
      return res.status(500).json({ error: error.message || 'Failed to create signed upload URL' })
    }

    const { data: publicData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath)

    res.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicData.publicUrl,
    })
  } catch (err) {
    next(err)
  }
})

export default adminUploadsRouter
