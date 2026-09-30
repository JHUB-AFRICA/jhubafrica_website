import { Resend } from 'resend'
import {
  RESEND_API_KEY,
  EMAIL_FROM,
  EMAIL_TO,
  EMAIL_REPLY_TO,
  EMAIL_INNOVATIONS,
  EMAIL_COURSES,
  EMAIL_PARTNERSHIPS,
  EMAIL_EVENTS,
  NODE_ENV,
} from '../config/env.js'
import { compileAcknowledgmentEmail } from '../templates/emails/acknowledgment.template.js'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

// Departmental & Consolidated internal recipients with fallback to EMAIL_TO
export const getInternalNotificationEmail = () => EMAIL_TO || EMAIL_FROM || 'team@jhubafrica.com'
export const getInnovationsEmail = () => EMAIL_INNOVATIONS || getInternalNotificationEmail()
export const getCoursesEmail = () => EMAIL_COURSES || getInternalNotificationEmail()
export const getPartnershipsEmail = () => EMAIL_PARTNERSHIPS || getInternalNotificationEmail()
export const getEventsEmail = () => EMAIL_EVENTS || getInternalNotificationEmail()

/**
 * Fire-and-forget asynchronous email dispatcher.
 * Decouples email sending from the HTTP request-response cycle so responses return immediately (<100ms).
 * Catches and logs all errors, isolating them from client HTTP responses.
 */
export function dispatchAsyncEmail(taskName: string, task: () => Promise<unknown>): void {
  setImmediate(async () => {
    try {
      await task()
    } catch (err: any) {
      console.error(`❌ [Background Email Failed] [${taskName}]:`, err?.message || err)
    }
  })
}

/**
 * Core sendEmail utility using Resend.
 * In local dev without RESEND_API_KEY, logs the preview to the console.
 * In local dev with unverified sandbox accounts (onboarding@resend.dev), gracefully falls back
 * to simulation if sending to an unverified email address so developers are never blocked.
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
      const errMsg = (error as any)?.message || JSON.stringify(error)
      // Check for Resend testing sandbox restriction
      if (
        NODE_ENV !== 'production' &&
        (errMsg.includes('testing emails to your own email address') || (error as any)?.statusCode === 403)
      ) {
        console.warn(
          `\n⚠️ [Resend Sandbox Restriction]: Recipient (${recipients.join(', ')}) requires a verified custom domain. Running local dev simulation.`
        )
        console.info(`   Subject: ${subject}\n`)
        return { id: `sim-sandbox-${Date.now()}`, simulated: true, originalError: error }
      }

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
    const errMsg = err?.message || String(err)
    if (
      NODE_ENV !== 'production' &&
      (errMsg.includes('testing emails to your own email address') || err?.statusCode === 403)
    ) {
      console.warn(
        `\n⚠️ [Resend Sandbox Restriction]: ${errMsg}. Fallback to simulated delivery in local dev mode.`
      )
      return { id: `sim-sandbox-${Date.now()}`, simulated: true, originalError: err }
    }

    console.error(`\n❌ [Email Dispatch Failed]:`, errMsg)
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
 * Consolidated & Department-Specific Staff Lead Notification Helpers
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
    to: getInnovationsEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendFundingLeadNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getPartnershipsEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendPartnershipsLeadNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getPartnershipsEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendCoursesCoordinatorNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getCoursesEmail(),
    subject,
    html: htmlContent,
  })
}

export async function sendEventsCoordinatorNotification(subject: string, htmlContent: string) {
  return sendEmail({
    to: getEventsEmail(),
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
