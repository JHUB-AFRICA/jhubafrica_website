import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../config/supabase.js'

export async function submitInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, category, subject, message, preferredResponseChannel, role, organisation } = req.body

    const structuredMessage = [
      role ? `Role: ${role}` : '',
      organisation ? `Organization: ${organisation}` : '',
      preferredResponseChannel ? `Preferred Response: ${preferredResponseChannel}` : '',
      `Message:\n${message}`,
    ].filter(Boolean).join('\n\n')

    let inquiryId = crypto.randomUUID()

    // Try saving to database if table exists
    try {
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('contact_inquiries')
          .insert({
            id: inquiryId,
            name,
            email,
            phone: phone || null,
            category: category || 'GENERAL',
            subject: subject || (role ? `Inquiry from ${role}` : 'General Inquiry'),
            message: structuredMessage,
            preferred_response_channel: preferredResponseChannel || 'email',
          })
          .select('id')
          .single()

        if (!error && data?.id) {
          inquiryId = data.id
        }
      }
    } catch (dbErr) {
      console.warn('[Contact Controller] Database save skipped or failed, proceeding with emails:', dbErr)
    }

    // Send email notifications
    try {
      const { compileGeneralContactLeadEmail } = await import('../templates/emails/leads.templates.js')
      const { sendSecretariatNotification, sendUserAcknowledgment } = await import('../services/email.service.js')

      const inquirySubject = subject || (role ? `Inquiry from ${role} (${name})` : `Inquiry from ${name}`)

      // 1. Send confirmation acknowledgment to the user
      await sendUserAcknowledgment(
        email,
        name,
        inquirySubject,
        'Thank you for reaching out to JHUB Africa. We have received your message and our team will get back to you shortly.',
        inquiryId,
        [
          { label: 'Name', value: name },
          { label: 'Role / Category', value: role || category || 'General' },
          { label: 'Organization', value: organisation || 'Not Specified' },
          { label: 'Phone', value: phone || 'Not Provided' },
        ]
      )

      // 2. Notify internal team (consolidated to EMAIL_TO in .env)
      const leadHtml = compileGeneralContactLeadEmail({
        category: category || role || 'General',
        subject: inquirySubject,
        message: structuredMessage,
        name,
        email,
        phone: phone || 'Not Provided',
        preferredResponseChannel: preferredResponseChannel || 'email',
      })

      await sendSecretariatNotification(inquirySubject, leadHtml)
    } catch (emailErr) {
      console.error('[Email Notification Error]:', emailErr)
    }

    res.status(201).json({
      message: 'Message received. We aim to respond within 2 business days.',
      inquiryId,
    })
  } catch (err) {
    next(err)
  }
}

export async function getInfo(_req: Request, res: Response) {
  res.json({
    data: {
      email:    'inquiries@jhubafrica.com',
      phone:    '+254 700 000 000',
      location: 'Technology House, JKUAT, Juja, Kiambu County, Kenya',
      officeHours: 'Monday – Friday, 8:00 AM – 5:00 PM EAT',
      social: {
        twitter:   'https://twitter.com/jhubafrica',
        linkedin:  'https://linkedin.com/company/jhubafrica',
        instagram: 'https://instagram.com/jhubafrica',
        youtube:   'https://youtube.com/@jhubafrica',
      },
    },
  })
}
