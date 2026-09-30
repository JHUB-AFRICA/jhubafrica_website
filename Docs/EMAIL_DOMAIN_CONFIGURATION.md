# JHUB Africa Email Domain Authentication Guide

This document outlines the exact technical protocols, DNS records, and configuration required to transition the **JHUB Africa** transactional emailing system from **local development / sandbox mode** to **verified production deliverability**.

---

## 1. Architecture Overview

JHUB Africa utilizes [Resend](https://resend.com) as its transactional email provider.

- **Local Development / Sandbox Mode (Current State):**
  - Sender: `onboarding@resend.dev`
  - Restriction: Free Resend sandbox accounts allow sending live emails **only to the registered account owner** (`emmanuelwaweru222199@daystar.ac.ke`).
  - **Local Resilience:** The backend automatically catches sandbox restrictions in development (`NODE_ENV=development`), prevents application crashes, logs a clear warning, and writes a rendered HTML email preview to `backend/temp/emails/`.
- **Production Mode (Target State):**
  - Sender: `JHUB Africa <notifications@jhubafrica.com>`
  - Domain verified with SPF, DKIM, and DMARC.
  - Emails can be delivered worldwide to applicants, students, partners, and administrators with 99%+ deliverability directly into their primary inbox.

---

## 2. Required DNS Records (Ready to Provide to Domain Registrar)

When access to the domain registrar (e.g. **Cloudflare**, **cPanel**, **GoDaddy**, **Namecheap**, or **AWS Route 53**) is granted, add the following records:

### A. DKIM Records (Cryptographic Authenticity)
Resend generates two CNAME records for domain authentication:

| Record Type | Host / Name | Target / Value | TTL | Proxy Status |
|---|---|---|---|---|
| **CNAME** | `resend._domainkey.jhubafrica.com` | `dkim.resend.com` *(or Resend-assigned token)* | Auto / 3600 | **DNS only (Gray Cloud)** |
| **CNAME** | `resend2._domainkey.jhubafrica.com` | `dkim2.resend.com` *(or Resend-assigned token)* | Auto / 3600 | **DNS only (Gray Cloud)** |

> [!IMPORTANT]
> If using **Cloudflare DNS**, ensure the Proxy Status is set to **DNS Only** (gray cloud icon), NOT Proxied (orange cloud).

---

### B. SPF Record (Authorized Sending IP Ranges)
Authorize Resend to send emails on behalf of `jhubafrica.com`:

| Record Type | Host / Name | Value | TTL |
|---|---|---|---|
| **TXT** | `@` (or `jhubafrica.com`) | `v=spf1 include:resend.com ~all` | Auto / 3600 |

*Note: If an SPF record already exists (e.g., for Google Workspace or Microsoft 365), merge Resend into the existing record:*
```text
v=spf1 include:_spf.google.com include:resend.com ~all
```

---

### C. DMARC Policy (Phishing & Spoofing Protection)
Protects the domain against email spoofing and improves sender reputation:

| Record Type | Host / Name | Value | TTL |
|---|---|---|---|
| **TXT** | `_dmarc` (or `_dmarc.jhubafrica.com`) | `v=DMARC1; p=none; sp=none; rua=mailto:dmarc@jhubafrica.com; pct=100` | Auto / 3600 |

- `p=none`: Monitoring mode (safest for initial rollout; no legitimate mail is dropped).
- Once deliverability is confirmed, change to `p=quarantine` or `p=reject`.

---

### D. Return-Path / Mail-From (Custom Bounce Domain)

| Record Type | Host / Name | Priority | Value | TTL |
|---|---|---|---|---|
| **MX** | `bounces.jhubafrica.com` | `10` | `feedback-smtp.resend.com` | Auto / 3600 |
| **TXT** | `bounces.jhubafrica.com` | — | `v=spf1 include:resend.com ~all` | Auto / 3600 |

---

## 3. Step-by-Step Verification Procedure

1. **Log in to the Resend Dashboard:**
   - Navigate to [resend.com/domains](https://resend.com/domains).
   - Click **Add Domain** and enter `jhubafrica.com` (select region: **eu-west-1** or default).
2. **Copy Assigned Values:**
   - Copy the specific DKIM tokens and MX values displayed in the Resend dashboard.
3. **Add Records to Domain DNS:**
   - Open your domain management console (Cloudflare, cPanel, etc.).
   - Insert the CNAME, TXT, and MX records listed in Section 2.
4. **Trigger Verification:**
   - In Resend, click **Verify DNS Records**.
   - DNS propagation typically takes between **5 minutes and 2 hours**.
5. **Update Backend Environment:**
   Once verified in Resend, update `backend/.env`:
   ```env
   RESEND_API_KEY=re_your_live_production_key
   EMAIL_FROM=JHUB Africa <notifications@jhubafrica.com>
   EMAIL_REPLY_TO=inquiries@jhubafrica.com
   EMAIL_TO=inquiries@jhubafrica.com
   ```
6. **Execute Diagnostic Test:**
   - Log into the JHUB Admin Dashboard -> **Email Service Diagnostics**.
   - Send a test email to any external address (e.g. your personal email).
   - Check the headers in the received email to confirm `dkim=pass` and `spf=pass`.

---

## 4. Local Development Tools (No DNS Required)

While waiting for domain access, the development environment includes built-in tools:

1. **Interactive Admin Template Previewer:**
   - Open `/admin` -> **Email Diagnostics** -> **Preview Templates**.
   - Browse and visually inspect any of the 11 transactional templates with realistic mock data in your browser.
2. **Local Dev Mailbox (File Snapshot):**
   - Dispatched and simulated emails in development mode automatically write HTML files to `backend/temp/emails/`.
   - Open any file in your browser to verify layouts, CTA buttons, and styling.
3. **Direct HTML Preview API:**
   - `GET http://localhost:4000/api/v1/admin/email/preview/enrollment`
   - `GET http://localhost:4000/api/v1/admin/email/preview/rsvp`
   - `GET http://localhost:4000/api/v1/admin/email/preview/lead-innovation`
