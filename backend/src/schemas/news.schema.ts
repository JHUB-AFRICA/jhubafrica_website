import { z } from 'zod'

export const newsQuerySchema = z.object({
  page:     z.coerce.number().min(1).default(1),
  limit:    z.coerce.number().min(1).max(50).default(10),
  category: z.enum(['news','impact-story','partner-story','project-update','announcement']).optional(),
  featured: z.coerce.boolean().optional(),
  search:   z.string().optional(),
  tag:      z.string().optional(),
})

export const createNewsSchema = z.object({
  title:         z.string().min(3),
  author:        z.string().optional().or(z.literal('')),
  excerpt:       z.string().optional().or(z.literal('')),
  content:       z.string().min(10),
  contentJson:   z.any().optional(),
  category:      z.enum(['news','impact-story','partner-story','project-update','announcement']).optional(),
  status:        z.enum(['DRAFT','PUBLISHED','ARCHIVED']).optional(),
  isPublished:   z.coerce.boolean().default(false),
  isFeatured:    z.coerce.boolean().default(false),
  publishedAt:   z.string().optional().nullable().or(z.literal('')),
  coverImageUrl: z.string().optional().or(z.literal('')),
  images:        z.array(z.any()).optional(),
  tags:          z.array(z.string()).default([]),
  authorId:      z.string().optional().or(z.literal('')),
}).passthrough()

export const updateNewsSchema = createNewsSchema.partial().passthrough()

