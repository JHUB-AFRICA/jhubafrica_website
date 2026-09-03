import { compileBaseLayout } from './base.layout.js'

export interface ResetPasswordEmailOptions {
  recipientName: string
  resetUrl: string
  expiresInMinutes?: number
}

export function compileResetPasswordEmail(options: ResetPasswordEmailOptions): string {
  const { recipientName, resetUrl, expiresInMinutes = 15 } = options

  const contentHtml = `
    <h2 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
    <p style="margin-top: 0; margin-bottom: 20px; color: #64748b; font-size: 15px; line-height: 1.5;">Hello ${recipientName},</p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #334155; font-size: 15px; line-height: 1.6;">
      We received a request to reset your password for your <strong>JHUB Africa Administrator</strong> account.
    </p>

    <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px; text-align: center;">
      <p style="margin-top: 0; margin-bottom: 20px; color: #334155; font-size: 14px;">
        Click the button below to choose a new password. This link is valid for <strong>${expiresInMinutes} minutes</strong>.
      </p>
      <a href="${resetUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);">
        Reset My Password
      </a>
    </div>

    <p style="margin-top: 0; margin-bottom: 16px; color: #64748b; font-size: 13px; line-height: 1.6;">
      Or copy and paste this link into your browser:
      <br/>
      <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all; font-size: 13px;">${resetUrl}</a>
    </p>

    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
        <strong>Security Notice:</strong> If you did not request a password reset, please disregard this email. Your password will remain unchanged.
      </p>
    </div>
  `

  return compileBaseLayout({
    title: 'Reset Your Administrator Password — JHUB Africa',
    preheader: 'A password reset request was initiated for your JHUB Africa account.',
    contentHtml,
  })
}
