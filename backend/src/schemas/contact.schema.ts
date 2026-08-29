import { z } from 'zod'

export const contactSchema = z.object({
  name:                     z.string().min(1, 'Name is required'),
  email:                    z.string().email('A valid email is required'),
  phone:                    z.string().optional().nullable().or(z.literal('')),
  category:                 z.enum([
    'GENERAL',
    'INNOVATION_SUBMISSION',
    'INCUBATION',
    'PARTNERSHIP',
    'FUNDING',
    'COURSES',
    'EVENTS',
    'MEDIA',
    'OTHER'
  ]).default('GENERAL'),
  subject:                  z.string().min(1).max(300).default('General Inquiry'),
  message:                  z.string().min(1, 'Message is required').max(5000),
  preferredResponseChannel: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  role:                     z.string().optional().nullable(),
  organisation:             z.string().optional().nullable(),
})
