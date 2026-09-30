import { Router, Request, Response, NextFunction } from 'express'
import {
  sendEmail,
  getInternalNotificationEmail,
  getInnovationsEmail,
  getCoursesEmail,
  getPartnershipsEmail,
  getEventsEmail,
} from '../../services/email.service.js'
import { compileBaseLayout } from '../../templates/emails/base.layout.js'
import { compileAcknowledgmentEmail } from '../../templates/emails/acknowledgment.template.js'
import { compileEnrollmentEmail } from '../../templates/emails/enrollment.template.js'
import { compileRsvpEmail } from '../../templates/emails/rsvp.template.js'
import { compileInquiryEmail } from '../../templates/emails/inquiry.template.js'
import { compileResetPasswordEmail } from '../../templates/emails/reset-password.template.js'
import {
  compileInnovationSubmissionLeadEmail,
  compileSponsorInquiryLeadEmail,
  compilePartnerInquiryLeadEmail,
  compileCourseInterestLeadEmail,
  compileEventRegistrationLeadEmail,
  compileGeneralContactLeadEmail,
} from '../../templates/emails/leads.templates.js'
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
} from '../../config/env.js'

export const adminEmailRouter = Router()

// Registry of all templates with realistic demonstration data for local previewing
const TEMPLATE_PREVIEWS: Record<
  string,
  {
    name: string
    category: 'User Receipt' | 'Internal Lead' | 'Authentication' | 'Diagnostic'
    description: string
    compile: () => string
  }
> = {
  acknowledgment: {
    name: 'User Acknowledgment Receipt',
    category: 'User Receipt',
    description: 'Automated receipt sent to users after submitting an inquiry or application.',
    compile: () =>
      compileAcknowledgmentEmail({
        recipientName: 'Jane Wanjiku',
        subjectTitle: 'Venture Incubation Inquiry',
        confirmationMessage:
          'Thank you for reaching out to JHUB Africa. We have received your inquiry and our incubation team will review your application.',
        referenceId: 'JHUB-INQ-2026-084',
        details: [
          { label: 'Category', value: 'Venture Acceleration' },
          { label: 'Role', value: 'Founder / Technical Lead' },
          { label: 'Organization', value: 'Kilimo Smart IoT' },
          { label: 'Phone', value: '+254 712 345 678' },
        ],
      }),
  },
  enrollment: {
    name: 'Course Enrollment Confirmation',
    category: 'User Receipt',
    description: 'Confirmation email dispatched to students when enrolled in a training cohort.',
    compile: () =>
      compileEnrollmentEmail({
        studentName: 'Alex Kimani',
        courseTitle: 'Full-Stack IoT Development & Smart Systems',
        deliveryMode: 'Hybrid (Online + Maker Space Lab)',
        durationWeeks: 12,
        startDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
        zoomLink: 'https://zoom.us/j/1234567890',
        location: 'JHUB Maker Space, Technology House, JKUAT',
      }),
  },
  rsvp: {
    name: 'Event RSVP Confirmation',
    category: 'User Receipt',
    description: 'Reservation confirmation dispatched to attendees registered for an event.',
    compile: () =>
      compileRsvpEmail({
        recipientName: 'Sarah Mwangi',
        eventTitle: 'Annual Africa Innovation & Climate Tech Summit 2026',
        eventType: 'Keynote & Exhibition',
        startDate: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString(),
        location: 'JKUAT Assembly Hall, Juja, Kenya',
        isOnline: false,
        meetingUrl: null,
      }),
  },
  'reset-password': {
    name: 'Admin Password Reset',
    category: 'Authentication',
    description: 'Time-sensitive secure reset link for administrator dashboard accounts.',
    compile: () =>
      compileResetPasswordEmail({
        recipientName: 'JHUB Administrator',
        resetUrl: 'http://localhost:5173/admin?resetToken=sample_demo_admin_token_2026',
        expiresInMinutes: 15,
      }),
  },
  inquiry: {
    name: 'General Contact Inquiry',
    category: 'Internal Lead',
    description: 'Inquiry notification forwarded to secretariat staff from the contact form.',
    compile: () =>
      compileInquiryEmail({
        name: 'David Otieno',
        email: 'david.otieno@example.com',
        phone: '+254 722 000 333',
        category: 'Partnership',
        subject: 'Collaboration on Clean Energy Microgrids',
        message:
          'We are developing solar-powered smart irrigation systems and would love to collaborate with JHUB researchers on field testing.',
      }),
  },
  'lead-innovation': {
    name: 'Innovation Proposal Alert',
    category: 'Internal Lead',
    description: 'Lead email forwarded to the Innovation Team upon project submission.',
    compile: () =>
      compileInnovationSubmissionLeadEmail({
        contactName: 'Brian Kiprop',
        contactEmail: 'brian@hydrosense.ke',
        phone: '+254 722 111 222',
        title: 'HydroSense IoT: Precision Soil & Moisture Sensing',
        sector: 'Climate-Smart Agriculture',
        stage: 'MVP / Prototype Tested',
        problem:
          'Over 65% of smallholder farmers suffer severe crop yield losses due to inaccurate manual irrigation estimation.',
        solution:
          'LoRaWAN solar-powered moisture sensors transmitting realtime soil data to automated irrigation valves.',
        supportRequired: 'Hardware prototyping support, investor networking, and agricultural field pilot partners.',
        teamInfo: '4 engineers from JKUAT and Daystar University with embedded systems and agronomy backgrounds.',
        projectLinks: 'https://github.com/hydrosense/firmware',
        attachmentUrl: 'https://jhubafrica.com/assets/sample-deck.pdf',
      }),
  },
  'lead-partner': {
    name: 'Strategic Partnership Proposal Alert',
    category: 'Internal Lead',
    description: 'Lead email forwarded to Strategic Partnerships coordinators.',
    compile: () =>
      compilePartnerInquiryLeadEmail({
        organizationName: 'Global Youth Innovation Fund',
        partnershipType: 'Grant & Technical Assistance',
        sector: 'Youth Tech Entrepreneurship',
        proposedCollaboration:
          'Joint accelerator cohort focusing on women-led agritech and climate startups across East Africa.',
        expectedTimeline: 'Q3 2026',
        contactName: 'Elena Rostova',
        contactEmail: 'elena.rostova@example.org',
        contactPhone: '+1 415 555 0199',
      }),
  },
  'lead-sponsor': {
    name: 'Sponsorship & Resource Mobilization Alert',
    category: 'Internal Lead',
    description: 'Lead email forwarded to the Funding & Partnerships office.',
    compile: () =>
      compileSponsorInquiryLeadEmail({
        sponsorName: 'Michael Chen',
        sponsorEmail: 'mchen@horizonventures.com',
        organization: 'Horizon Impact Capital',
        interestArea: 'AI & Machine Learning for Climate Resilience',
        projectTitle: 'Smart-Nyuki: Precision Beekeeping Telemetry',
        sponsorshipType: 'Seed Equity & Pilot Grant',
        budgetRange: '$25,000 - $50,000',
        expectedOutcome: 'Commercial deployment of 50 sensor hives in Eastern Kenya by Q4.',
        preferredContactMethod: 'Email & Zoom',
        message: 'We have reviewed your innovation catalog and are excited about the hardware telemetry.',
      }),
  },
  'lead-course': {
    name: 'Course Interest Registration Alert',
    category: 'Internal Lead',
    description: 'Alert sent to Training & Courses coordinator when interest is registered.',
    compile: () =>
      compileCourseInterestLeadEmail({
        courseTitle: 'Applied Generative AI & Cloud Architecture',
        preferredCohort: 'Weekend Cohort (In-Person)',
        preferredLearningMode: 'Blended',
        eligibilityDetails: 'BSc Computer Science graduate with 2 years TypeScript & Python experience.',
        name: 'Grace Wambui',
        email: 'grace.wambui@example.com',
        phone: '+254 733 999 888',
        paymentReadiness: true,
      }),
  },
  'lead-event': {
    name: 'Event Attendee Registration Alert',
    category: 'Internal Lead',
    description: 'Alert forwarded to the Events Coordinator for each RSVP.',
    compile: () =>
      compileEventRegistrationLeadEmail({
        eventTitle: 'Hack-for-Green: JKUAT Agri-Hacks 2026',
        guestName: 'Kevin Njoroge',
        guestEmail: 'kevin.njoroge@example.com',
        guestPhone: '+254 701 234 567',
        affiliation: 'JKUAT Software Engineering Student',
        dietaryRequirements: 'Vegetarian',
        accessibilityRequirements: 'None',
        marketingConsent: true,
      }),
  },
  'lead-general': {
    name: 'General Secretariat Inquiry',
    category: 'Internal Lead',
    description: 'Consolidated lead alert forwarded to the JHUB Secretariat.',
    compile: () =>
      compileGeneralContactLeadEmail({
        category: 'General Inquiry',
        subject: 'Visiting JHUB Africa Maker Space & Lab Facilities',
        message:
          'Hello, our delegation of engineering students would love to tour the Maker Space facility next Thursday afternoon.',
        name: 'Mercy Achieng',
        email: 'mercy.a@example.com',
        phone: '+254 700 111 222',
        preferredResponseChannel: 'email',
      }),
  },
}

/**
 * GET /api/v1/admin/email/config
 * Returns current emailing pipeline health, provider, sandbox status, and department routing.
 */
adminEmailRouter.get('/config', (_req: Request, res: Response) => {
  const isSandbox = Boolean(EMAIL_FROM?.includes('resend.dev') || !EMAIL_FROM)
  res.json({
    status: 'ok',
    environment: NODE_ENV || 'development',
    provider: 'Resend',
    isKeyConfigured: Boolean(RESEND_API_KEY),
    senderAddress: EMAIL_FROM || 'onboarding@resend.dev',
    replyToAddress: EMAIL_REPLY_TO || 'Not Configured',
    isSandboxMode: isSandbox,
    sandboxNotice: isSandbox
      ? 'In sandbox mode, Resend permits sending live emails only to the registered account owner. Other recipients automatically simulate locally in development mode.'
      : 'Live custom domain verified.',
    departmentRouting: {
      innovations: getInnovationsEmail(),
      courses: getCoursesEmail(),
      partnerships: getPartnershipsEmail(),
      events: getEventsEmail(),
      secretariat: getInternalNotificationEmail(),
    },
  })
})

/**
 * GET /api/v1/admin/email/templates
 * Lists all available email templates with metadata.
 */
adminEmailRouter.get('/templates', (_req: Request, res: Response) => {
  const templates = Object.entries(TEMPLATE_PREVIEWS).map(([id, item]) => ({
    id,
    name: item.name,
    category: item.category,
    description: item.description,
  }))
  res.json({ templates })
})

/**
 * GET /api/v1/admin/email/preview/:templateId
 * Renders any email template directly in the browser with demonstration data.
 */
adminEmailRouter.get('/preview/:templateId', (req: Request, res: Response) => {
  const { templateId } = req.params
  const template = TEMPLATE_PREVIEWS[templateId]

  if (!template) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Template Not Found</title></head>
      <body style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h2 style="color: #e11d48;">Template Not Found</h2>
        <p>Available templates: ${Object.keys(TEMPLATE_PREVIEWS).join(', ')}</p>
      </body>
      </html>
    `)
  }

  const renderedHtml = template.compile()

  // If requested as JSON, return raw HTML string
  if (req.query.format === 'json') {
    return res.json({
      id: templateId,
      name: template.name,
      html: renderedHtml,
    })
  }

  // Allow embedding preview in dashboard iframe
  res.removeHeader('X-Frame-Options')
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:* http://127.0.0.1:* https://*")
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(renderedHtml)
})

/**
 * POST /api/v1/admin/email/test
 * Diagnostic test email dispatcher to verify live or simulated connectivity.
 */
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
          All transactional notifications, automated receipts, and lead routing use this pipeline.
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
