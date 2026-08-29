import { Resend } from 'resend'
import { RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, EMAIL_REPLY_TO } from '../config/env.js'
import { compileAcknowledgmentEmail } from '../templates/emails/acknowledgment.template.js'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

// Consolidated internal recipient from environment
const getInternalNotificationEmail = () => EMAIL_TO || EMAIL_FROM || 'team@jhubafrica.com'

/**
 * Core sendEmail utility using Resend.
 * In local dev without RESEND_API_KEY, logs the preview to the console so developers are never blocked.
 */
export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  const recipients = Array.isArray(to) ? to : [to]
  // Default to onboarding@resend.dev if not explicitly configured so unverified test accounts work
  const fromAddress = EMAIL_FROM || 'onboarding@resend.dev'
  const replyAddress = replyTo || EMAIL_REPLY_TO || undefined

  if (!resend) {
    console.info(`\n📧 [EMAIL SIMULATION] (Set RESEND_API_KEY to send live emails)`)
    console.info(`   To: ${recipients.join(', ')}`)
    console.info(`   From: ${fromAddress}`)
    console.info(`   Subject: ${subject}\n`)
    return { id: `sim-${Date.now()}`, simulated: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: recipients,
      reply_to: replyAddress,
      subject,
      html,
    })

    if (error) {
      console.error(`\n❌ [Resend API Error]:`, JSON.stringify(error, null, 2))
      throw error
    }

    console.info(`\n🚀 [Resend Email Sent]:`)
    console.info(`   ID: ${data?.id}`)
    console.info(`   To: ${recipients.join(', ')}`)
    console.info(`   From: ${fromAddress}`)
    console.info(`   Subject: ${subject}\n`)

    return data
  } catch (err: any) {
    console.error(`\n❌ [Email Dispatch Failed]:`, err?.message || err)
    throw err
  }
}

/**
 * Send an automated confirmation/receipt to the user who submitted a form or inquiry.
 */
export async function sendUserAcknowledgment(
  recipientEmail: string,
  recipientName: string,
  subjectTitle: string,
  confirmationMessage: string,
  referenceId?: string,
  details?: Array<{ label: string; value: string }>
) {
  if (!recipientEmail) return null
  const html = compileAcknowledgmentEmail({
    recipientName,
    subjectTitle,
    confirmationMessage,
    referenceId,
    details,
  })

  return sendEmail({
    to: recipientEmail,
    subject: `Received: ${subjectTitle} - JHUB Africa`,
    html,
  })
}

/**
 * Consolidated Staff Lead Notification Helpers
 * All internal alerts route to the single consolidated email configured in .env (EMAIL_TO)
 */
export async function sendAdminNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getInternalNotificationEmail(),
    subject: `[Admin Alert] ${subject}`,
    html: htmlContent,
  })
}

export async function sendInnovationLeadNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getInternalNotificationEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendFundingLeadNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getInternalNotificationEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendPartnershipsLeadNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getInternalNotificationEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendCoursesCoordinatorNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getInternalNotificationEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendEventsCoordinatorNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getInternalNotificationEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendSecretariatNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getInternalNotificationEmail(),
    subject,
    html: htmlContent,
  })
}
