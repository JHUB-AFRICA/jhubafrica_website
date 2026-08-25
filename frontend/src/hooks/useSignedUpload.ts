import { useState, useCallback } from 'react'
import { adminApi } from '../../axios/axios'

export interface UploadResult {
  url: string
  path: string
}

export type StorageBucket = 'post-images' | 'innovation-images'

export function useSignedUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(
    async (file: File, bucket: StorageBucket = 'post-images'): Promise<UploadResult> => {
      setUploading(true)
      setError(null)
      setProgress(10)

      try {
        // Strategy A: Request signed URL for direct binary client-to-Supabase upload
        try {
          const signResponse = await adminApi.post<{
            signedUrl: string
            publicUrl: string
            path: string
            token: string
          }>('/api/v1/admin/uploads/sign', {
            bucket,
            filename: file.name,
            contentType: file.type,
          })

          const { signedUrl, publicUrl, path } = signResponse.data
          setProgress(40)

          const uploadRes = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: file,
          })

          if (uploadRes.ok) {
            setProgress(100)
            return {
              url: publicUrl,
              path,
            }
          }
        } catch (signedErr) {
          console.warn('[useSignedUpload] Signed URL upload failed, attempting direct backend fallback...', signedErr)
        }

        // Strategy B: Direct fallback upload via backend service role
        setProgress(50)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', bucket)

        const directRes = await adminApi.post<{ url: string; path: string }>(
          '/api/v1/admin/uploads/direct',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size))
              setProgress(percent)
            },
          }
        )

        setProgress(100)
        return directRes.data
      } catch (err: any) {
        console.error('[useSignedUpload Error]:', err)
        const msg = err?.response?.data?.error || err?.message || 'Failed to upload image'
        setError(msg)
        throw new Error(msg)
      } finally {
        setUploading(false)
        setTimeout(() => setProgress(0), 1000)
      }
    },
    []
  )

  const uploadMultipleFiles = useCallback(
    async (files: File[], bucket: StorageBucket = 'post-images'): Promise<UploadResult[]> => {
      setUploading(true)
      setError(null)
      try {
        const uploadPromises = files.map((file) => uploadFile(file, bucket))
        const results = await Promise.all(uploadPromises)
        return results
      } catch (err: any) {
        console.error('[useSignedUpload Multiple Error]:', err)
        throw err
      } finally {
        setUploading(false)
      }
    },
    [uploadFile]
  )

  return {
    uploadFile,
    uploadMultipleFiles,
    uploading,
    progress,
    error,
  }
}
