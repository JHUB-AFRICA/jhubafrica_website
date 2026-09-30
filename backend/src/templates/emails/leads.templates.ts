import { compileBaseLayout } from './base.layout.js'
import { escapeHtml, formatMultilineHtml } from './utils.js'

// Helper to compile details tables in leads emails
function compileDetailsTable(rows: { label: string; value: string }[]): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
      ${rows.map(row => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #475569; width: 180px; vertical-align: top;">${row.label}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; vertical-align: top;">${row.value}</td>
        </tr>
      `).join('')}
    </table>
  `
}

export function compileInnovationSubmissionLeadEmail(data: {
  contactName: string
  contactEmail: string
  phone: string
  title: string
  sector: string
  stage: string
  problem: string
  solution: string
  supportRequired: string
  teamInfo: string
  projectLinks?: string
  attachmentUrl?: string
}): string {
  const safeName = escapeHtml(data.contactName)
  const safeEmail = escapeHtml(data.contactEmail)
  const safePhone = escapeHtml(data.phone)
  const safeTitle = escapeHtml(data.title)
  const safeSector = escapeHtml(data.sector)
  const safeStage = escapeHtml(data.stage)
  const safeTeam = escapeHtml(data.teamInfo)
  const safeProblem = formatMultilineHtml(data.problem)
  const safeSolution = formatMultilineHtml(data.solution)
  const safeSupport = formatMultilineHtml(data.supportRequired)
  const safeProjectLinks = data.projectLinks ? escapeHtml(data.projectLinks) : null
  const safeAttachmentUrl = data.attachmentUrl ? escapeHtml(data.attachmentUrl) : null

  const table = compileDetailsTable([
    { label: 'Innovator Name', value: safeName },
    { label: 'Email Address', value: `<a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>` },
    { label: 'Phone Number', value: safePhone },
    { label: 'Project Name', value: safeTitle },
    { label: 'Sector', value: safeSector },
    { label: 'Development Stage', value: `<span style="background-color: #eff6ff; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${safeStage}</span>` },
    { label: 'Team Info', value: safeTeam },
    { label: 'Project Links', value: safeProjectLinks ? `<a href="${safeProjectLinks}" style="color: #3b82f6; text-decoration: none;">${safeProjectLinks}</a>` : 'N/A' },
    { label: 'Attachment Link', value: safeAttachmentUrl ? `<a href="${safeAttachmentUrl}" style="color: #3b82f6; text-decoration: none;">View File</a>` : 'N/A' }
  ])

  const contentHtml = `
    <h2 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 20px; font-weight: 700;">New Innovation Submission</h2>
    <p style="margin-top: 0; margin-bottom: 24px; color: #64748b; font-size: 15px; line-height: 1.5;">Dear Innovation Program Lead,</p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #334155; font-size: 14px; line-height: 1.6;">A new innovative project has been submitted for consideration. Below are the details:</p>
    
    ${table}

    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Problem Being Addressed</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeProblem}</div>
    </div>

    <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Proposed Solution</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeSolution}</div>
    </div>

    <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-bottom: 30px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Support Requested</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeSupport}</div>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <a href="mailto:${safeEmail}?subject=RE: Innovation Submission - ${encodeURIComponent(data.title)}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
            Contact Innovator
          </a>
        </td>
      </tr>
    </table>
  `

  return compileBaseLayout({
    title: `Innovation Submission: ${safeTitle}`,
    preheader: `New innovation submission under stage ${safeStage} from ${safeName}`,
    contentHtml
  })
}

export function compileSponsorInquiryLeadEmail(data: {
  sponsorName: string
  sponsorEmail: string
  organization: string
  interestArea: string
  projectTitle?: string
  sponsorshipType: string
  budgetRange?: string
  expectedOutcome: string
  preferredContactMethod: string
  message?: string
}): string {
  const safeName = escapeHtml(data.sponsorName)
  const safeEmail = escapeHtml(data.sponsorEmail)
  const safeOrg = escapeHtml(data.organization)
  const safeInterest = escapeHtml(data.interestArea)
  const safeProj = data.projectTitle ? escapeHtml(data.projectTitle) : 'General/Undetermined'
  const safeType = escapeHtml(data.sponsorshipType)
  const safeBudget = data.budgetRange ? escapeHtml(data.budgetRange) : 'N/A'
  const safeContact = escapeHtml(data.preferredContactMethod)
  const safeOutcome = formatMultilineHtml(data.expectedOutcome)
  const safeMessage = data.message ? formatMultilineHtml(data.message) : null

  const table = compileDetailsTable([
    { label: 'Sponsor Name', value: safeName },
    { label: 'Email Address', value: `<a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>` },
    { label: 'Organization', value: safeOrg },
    { label: 'Interest Area', value: safeInterest },
    { label: 'Project of Interest', value: safeProj },
    { label: 'Sponsorship Type', value: safeType },
    { label: 'Budget Range', value: safeBudget },
    { label: 'Preferred Contact Method', value: `<span style="text-transform: capitalize;">${safeContact}</span>` }
  ])

  const contentHtml = `
    <h2 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 20px; font-weight: 700;">New Sponsor Inquiry</h2>
    <p style="margin-top: 0; margin-bottom: 24px; color: #64748b; font-size: 15px; line-height: 1.5;">Dear Partnership & Funding Lead,</p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #334155; font-size: 14px; line-height: 1.6;">An investor/funder has expressed interest in supporting our hub projects. Below are the details:</p>
    
    ${table}

    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Expected Outcome</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeOutcome}</div>
    </div>

    ${safeMessage ? `
    <div style="background-color: #f8fafc; border-left: 4px solid #64748b; padding: 16px; border-radius: 4px; margin-bottom: 30px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Additional Message</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeMessage}</div>
    </div>
    ` : ''}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <a href="mailto:${safeEmail}?subject=RE: Sponsor Inquiry - ${encodeURIComponent(data.organization)}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
            Contact Sponsor
          </a>
        </td>
      </tr>
    </table>
  `

  return compileBaseLayout({
    title: `Sponsor Inquiry: ${safeOrg}`,
    preheader: `New sponsorship interest from ${safeName} (${safeOrg})`,
    contentHtml
  })
}

export function compilePartnerInquiryLeadEmail(data: {
  organizationName: string
  partnershipType: string
  sector: string
  proposedCollaboration: string
  expectedTimeline: string
  contactName: string
  contactEmail: string
  contactPhone: string
}): string {
  const safeOrg = escapeHtml(data.organizationName)
  const safeType = escapeHtml(data.partnershipType)
  const safeSector = escapeHtml(data.sector)
  const safeTimeline = escapeHtml(data.expectedTimeline)
  const safeName = escapeHtml(data.contactName)
  const safeEmail = escapeHtml(data.contactEmail)
  const safePhone = escapeHtml(data.contactPhone)
  const safeCollaboration = formatMultilineHtml(data.proposedCollaboration)

  const table = compileDetailsTable([
    { label: 'Organization Name', value: safeOrg },
    { label: 'Partnership Type', value: safeType },
    { label: 'Sector', value: safeSector },
    { label: 'Expected Timeline', value: safeTimeline },
    { label: 'Contact Name', value: safeName },
    { label: 'Email Address', value: `<a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>` },
    { label: 'Phone Number', value: safePhone }
  ])

  const contentHtml = `
    <h2 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 20px; font-weight: 700;">New Strategic Partnership Proposal</h2>
    <p style="margin-top: 0; margin-bottom: 24px; color: #64748b; font-size: 15px; line-height: 1.5;">Dear Strategic Partnerships Lead,</p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #334155; font-size: 14px; line-height: 1.6;">An institution has submitted a strategic partnership inquiry. Below are the details:</p>
    
    ${table}

    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 30px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Proposed Collaboration details</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeCollaboration}</div>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <a href="mailto:${safeEmail}?subject=RE: Partnership Proposal - ${encodeURIComponent(data.organizationName)}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
            Contact Partner Representative
          </a>
        </td>
      </tr>
    </table>
  `

  return compileBaseLayout({
    title: `Partnership Inquiry: ${safeOrg}`,
    preheader: `New partnership proposal from ${safeOrg} (${safeType})`,
    contentHtml
  })
}

export function compileCourseInterestLeadEmail(data: {
  courseTitle: string
  preferredCohort: string
  preferredLearningMode: string
  eligibilityDetails: string
  name: string
  email: string
  phone: string
  paymentReadiness: boolean
}): string {
  const safeTitle = escapeHtml(data.courseTitle)
  const safeCohort = escapeHtml(data.preferredCohort)
  const safeMode = escapeHtml(data.preferredLearningMode)
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safePhone = escapeHtml(data.phone)
  const safeEligibility = formatMultilineHtml(data.eligibilityDetails)

  const table = compileDetailsTable([
    { label: 'Student Name', value: safeName },
    { label: 'Email Address', value: `<a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>` },
    { label: 'Phone Number', value: safePhone },
    { label: 'Course of Interest', value: safeTitle },
    { label: 'Preferred Cohort', value: safeCohort },
    { label: 'Learning Mode', value: safeMode },
    { label: 'Payment Readiness', value: data.paymentReadiness ? `<span style="color: #059669; font-weight: 600;">Yes (Ready to pay on cohort confirmation)</span>` : `<span style="color: #dc2626;">No / Seeking Scholarship</span>` }
  ])

  const contentHtml = `
    <h2 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 20px; font-weight: 700;">New Course Interest Registration</h2>
    <p style="margin-top: 0; margin-bottom: 24px; color: #64748b; font-size: 15px; line-height: 1.5;">Dear Training & Courses Coordinator,</p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #334155; font-size: 14px; line-height: 1.6;">A user has registered interest for an upcoming cohort/course. Below are the details:</p>
    
    ${table}

    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 30px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Eligibility details</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeEligibility}</div>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <a href="mailto:${safeEmail}?subject=RE: Course Interest - ${encodeURIComponent(data.courseTitle)}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
            Contact Student
          </a>
        </td>
      </tr>
    </table>
  `

  return compileBaseLayout({
    title: `Course Interest: ${safeTitle}`,
    preheader: `Course interest from ${safeName} for ${safeTitle}`,
    contentHtml
  })
}

export function compileEventRegistrationLeadEmail(data: {
  eventTitle: string
  guestName: string
  guestEmail: string
  guestPhone: string
  affiliation: string
  dietaryRequirements?: string
  accessibilityRequirements?: string
  marketingConsent: boolean
}): string {
  const safeTitle = escapeHtml(data.eventTitle)
  const safeName = escapeHtml(data.guestName)
  const safeEmail = escapeHtml(data.guestEmail)
  const safePhone = escapeHtml(data.guestPhone)
  const safeAffiliation = escapeHtml(data.affiliation)
  const safeDietary = data.dietaryRequirements ? escapeHtml(data.dietaryRequirements) : 'None'
  const safeAccessibility = data.accessibilityRequirements ? escapeHtml(data.accessibilityRequirements) : 'None'

  const table = compileDetailsTable([
    { label: 'Attendee Name', value: safeName },
    { label: 'Email Address', value: `<a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>` },
    { label: 'Phone Number', value: safePhone },
    { label: 'Event Name', value: safeTitle },
    { label: 'Affiliation / Role', value: safeAffiliation },
    { label: 'Dietary Requirements', value: safeDietary },
    { label: 'Accessibility Accommodations', value: safeAccessibility },
    { label: 'Future Updates Consent', value: data.marketingConsent ? `<span style="color: #059669; font-weight: 600;">Consented</span>` : `<span style="color: #64748b;">Not Consented</span>` }
  ])

  const contentHtml = `
    <h2 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 20px; font-weight: 700;">New Event Registration</h2>
    <p style="margin-top: 0; margin-bottom: 24px; color: #64748b; font-size: 15px; line-height: 1.5;">Dear Events Coordinator,</p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #334155; font-size: 14px; line-height: 1.6;">An attendee has registered for your event. Below are the registration details:</p>
    
    ${table}

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
      <tr>
        <td align="center">
          <a href="mailto:${safeEmail}?subject=RE: Event Registration - ${encodeURIComponent(data.eventTitle)}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
            Email Attendee
          </a>
        </td>
      </tr>
    </table>
  `

  return compileBaseLayout({
    title: `Event RSVP: ${safeTitle}`,
    preheader: `New RSVP from ${safeName} for ${safeTitle}`,
    contentHtml
  })
}

export function compileGeneralContactLeadEmail(data: {
  category: string
  subject: string
  message: string
  name: string
  email: string
  phone: string
  preferredResponseChannel: string
}): string {
  const safeCategory = escapeHtml(data.category)
  const safeSubject = escapeHtml(data.subject)
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safePhone = escapeHtml(data.phone)
  const safeChannel = escapeHtml(data.preferredResponseChannel)
  const safeMessage = formatMultilineHtml(data.message)

  const table = compileDetailsTable([
    { label: 'Sender Name', value: safeName },
    { label: 'Email Address', value: `<a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>` },
    { label: 'Phone Number', value: safePhone },
    { label: 'Inquiry Category', value: `<span style="background-color: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${safeCategory}</span>` },
    { label: 'Subject', value: safeSubject },
    { label: 'Preferred Contact Channel', value: `<span style="text-transform: capitalize;">${safeChannel}</span>` }
  ])

  const contentHtml = `
    <h2 style="margin-top: 0; margin-bottom: 8px; color: #0f172a; font-size: 20px; font-weight: 700;">General Inquiry Submitted</h2>
    <p style="margin-top: 0; margin-bottom: 24px; color: #64748b; font-size: 15px; line-height: 1.5;">Dear Secretariat,</p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #334155; font-size: 14px; line-height: 1.6;">A user has submitted a general inquiry. Below are the details:</p>
    
    ${table}

    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 30px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700; margin-bottom: 8px;">Inquiry Message</div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${safeMessage}</div>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <a href="mailto:${safeEmail}?subject=RE: [Secretariat Inquiry] ${encodeURIComponent(data.subject)}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
            Respond to Sender
          </a>
        </td>
      </tr>
    </table>
  `

  return compileBaseLayout({
    title: `Inquiry: ${safeSubject}`,
    preheader: `New general contact inquiry category ${safeCategory} from ${safeName}`,
    contentHtml
  })
}
