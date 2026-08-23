import { z } from 'zod'

export const teamQuerySchema = z.object({
  category: z.enum(['ADVISORY_BOARD', 'DEV_TEAM', 'EXECUTIVE', 'MENTORS', 'SECRETARIAT']).optional(),
})

export const createTeamMemberSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  bio: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().optional().or(z.literal('')),
  category: z.enum(['ADVISORY_BOARD', 'DEV_TEAM', 'EXECUTIVE', 'MENTORS', 'SECRETARIAT']),
})

export const updateTeamMemberSchema = createTeamMemberSchema.partial()
