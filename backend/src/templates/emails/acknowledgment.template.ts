import { compileBaseLayout } from './base.layout.js'

export interface AcknowledgmentEmailOptions {
  recipientName: string
  subjectTitle: string
  confirmationMessage: string
  referenceId?: string
  details?: Array<{ label: string; value: string }>
}

export function compileAcknowledgmentEmail({
  recipientName,
  subjectTitle,
  confirmationMessage,
  referenceId,
  details = [],
}: AcknowledgmentEmailOptions): string {
  const detailsHtml = details.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; font-size: 14px;">
      <tbody>
        ${details.map((item, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
            <td style="padding: 10px 16px; font-weight: 600; color: #475569; width: 35%; border-bottom: 1px solid #e2e8f0;">${item.label}</td>
            <td style="padding: 10px 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${item.value}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''

  const contentHtml = `
    <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700; line-height: 1.3;">
      Hello ${recipientName || 'there'},
    </h2>
    <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
      ${confirmationMessage}
    </p>
    
    ${referenceId ? `
      <div style="background-color: #f1f5f9; border-left: 4px solid #10b981; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <span style="font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Reference ID</span>
        <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 2px;">${referenceId}</div>
      </div>
    ` : ''}

    ${detailsHtml}

    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-top: 24px; margin-bottom: 0;">
      Our team typically reviews all submissions within <strong>2 business days</strong>. If you have any urgent inquiries, feel free to reply directly to this email.
    </p>

    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #475569;">
      Warm regards,<br />
      <strong style="color: #0f172a;">The JHUB Africa Team</strong>
    </div>
  `

  return compileBaseLayout({
    title: subjectTitle,
    preheader: `Thank you for reaching out to JHUB Africa regarding ${subjectTitle}.`,
    contentHtml,
  })
}
