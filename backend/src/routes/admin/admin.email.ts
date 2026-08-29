import { Router, Request, Response, NextFunction } from 'express'
import { sendEmail } from '../../services/email.service.js'
import { compileBaseLayout } from '../../templates/emails/base.layout.js'

export const adminEmailRouter = Router()

adminEmailRouter.post('/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to } = req.body

    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return res.status(400).json({ error: 'A valid recipient email address is required.' })
    }

    const testHtml = compileBaseLayout({
      title: 'JHUB Africa Email Service Test',
      preheader: 'This is a test email sent from the JHUB Africa admin panel.',
      contentHtml: `
        <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Email Service Test Successful!</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Your Resend email service configuration for <strong>JHUB Africa</strong> is working properly.
        </p>
        <div style="background-color: #f1f5f9; border-left: 4px solid #10b981; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
          <div style="font-size: 13px; color: #64748b;">Timestamp</div>
          <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 2px;">${new Date().toLocaleString()}</div>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
          All transactional notifications, automated receipts, and lead routing will use this connection.
        </p>
      `,
    })

    const result = await sendEmail({
      to,
      subject: '🧪 JHUB Africa Email Service Test',
      html: testHtml,
    })

    res.json({
      success: true,
      message: `Test email dispatched to ${to}`,
      data: result,
    })
  } catch (err: any) {
    console.error('Admin test email failed:', err)
    res.status(500).json({
      error: err?.message || 'Failed to send test email. Please check your RESEND_API_KEY.',
    })
  }
})
