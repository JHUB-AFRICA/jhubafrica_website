import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Globe, Linkedin, Facebook, Instagram, Loader2 } from "lucide-react";
import { submitContactInquiry } from "../../axios/api/contact";
import styles from "../styles/Contact.module.css";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JHUB Africa" },
      {
        name: "description",
        content:
          "Reach JHUB Africa at Technology House, JKUAT. Phone, email and partnership inquiries.",
      },
      { property: "og:title", content: "Contact — JHUB Africa" },
      {
        property: "og:description",
        content: "Get in touch with the JHUB Africa team at Technology House, JKUAT.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Student",
    organisation: "",
    inquiry: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const roleToCategoryMap: Record<string, "GENERAL" | "INNOVATION_SUBMISSION" | "INCUBATION" | "PARTNERSHIP" | "FUNDING" | "COURSES" | "EVENTS" | "MEDIA" | "OTHER"> = {
        Student: "COURSES",
        Innovator: "INNOVATION_SUBMISSION",
        Partner: "PARTNERSHIP",
        Sponsor: "FUNDING",
        Volunteer: "OTHER",
        "Media / Press": "MEDIA",
      };

      const category = roleToCategoryMap[formData.role] || "GENERAL";
      const subject = formData.role ? `Inquiry from ${formData.role} (${formData.name.trim()})` : `Inquiry from ${formData.name.trim()}`;
      const message = formData.inquiry.trim() || `Inquiry submission from ${formData.name.trim()} (${formData.role}).`;

      await submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        category,
        subject,
        message,
        preferredResponseChannel: "email",
        role: formData.role,
        organisation: formData.organisation.trim() || undefined,
      } as any);

      setSent(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Student",
        organisation: "",
        inquiry: "",
      });
    } catch (err: any) {
      console.error("Failed to submit contact inquiry:", err);
      const details = err?.response?.data?.details;
      const detailsMsg = details ? Object.entries(details).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join("; ") : "";
      setErrorMessage(
        detailsMsg ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not send your message at this time. Please try again later or email us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={styles['contact-page-header']}>
        <h1>
          Contact <span>Us</span>
        </h1>
        <p>
          LET'S BUILD THE FUTURE TOGETHER
        </p>
      </header>

      <section className="feature-split">
        <div className="split-copy">
          <h2>Your Details</h2>
          <p>
            Are you looking to partner, sponsor, volunteer, or just to talk with us? Feel free to leave your details in the form below and we will get back to you as soon as possible.
          </p>
          <form
            onSubmit={handleSubmit}
            className={styles['contact-form-container']}
          >
            <div>
              <label className={`${styles['contact-form-label']} ${styles['contact-form-label-required']}`}>Your Name (Required) *</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="First and Last Name"
                className={styles['contact-form-input']}
                disabled={loading}
              />
            </div>

            <div className={styles['contact-form-row']}>
              <div>
                <label className={`${styles['contact-form-label']} ${styles['contact-form-label-required']}`}>Your Email Address (Required) *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={styles['contact-form-input']}
                  disabled={loading}
                />
              </div>
              <div>
                <label className={`${styles['contact-form-label']} ${styles['contact-form-label-optional']}`}>Your phone number (Optional)</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 720 000 000"
                  className={styles['contact-form-input']}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles['contact-form-row']}>
              <div>
                <label className={`${styles['contact-form-label']} ${styles['contact-form-label-required']}`}>Who are you?</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={styles['contact-form-input']}
                  title="Select your role"
                  disabled={loading}
                >
                  <option>Student</option>
                  <option>Innovator</option>
                  <option>Partner</option>
                  <option>Sponsor</option>
                  <option>Volunteer</option>
                  <option>Media / Press</option>
                </select>
              </div>
              <div>
                <label className={`${styles['contact-form-label']} ${styles['contact-form-label-optional']}`}>Where Are you from? (Optional)</label>
                <input
                  name="organisation"
                  value={formData.organisation}
                  onChange={handleChange}
                  placeholder="Organisation"
                  className={styles['contact-form-input']}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className={`${styles['contact-form-label']} ${styles['contact-form-label-optional']}`}>Detailed Inquiry (Optional)</label>
              <textarea
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                placeholder="Type Inquiry"
                rows={4}
                className={styles['contact-form-input']}
                disabled={loading}
              />
            </div>

            {errorMessage && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  color: "#991b1b",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid #ef4444",
                }}
              >
                {errorMessage}
              </div>
            )}

            {sent && (
              <div
                style={{
                  padding: "0.85rem 1.15rem",
                  borderRadius: "8px",
                  fontSize: "0.92rem",
                  color: "#065f46",
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid var(--jhub-green)",
                  fontWeight: 600,
                }}
              >
                ✓ Thank you! Your message has been sent successfully. A confirmation email has been dispatched to your inbox.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary ${styles['contact-form-submit']}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              <span>{loading ? "Sending Message..." : sent ? "Send Another Message" : "Send Message"}</span>
            </button>
          </form>
        </div>

        <div className={`split-panel ${styles['contact-split-panel']}`}>
          <h3 className={styles['contact-panel-h3']}>
            <span className="hover-underline-center">Our Details</span>
          </h3>

          <div className={styles['contact-details-list']}>
            {/* Location Card */}
            <div className={styles['contact-detail-card']}>
              <div className={styles['contact-detail-icon']}>
                <MapPin size={20} />
              </div>
              <div className={styles['contact-detail-content']}>
                <div className={styles['contact-detail-label']}>Office Location</div>
                <div className={styles['contact-detail-val']}>
                  <span className="hover-underline-center">Technology House, JKUAT Main Campus</span>
                </div>
                <div className={styles['contact-detail-sub']}>
                  Juja, Kenya · P.O. BOX 62000-00200, Nairobi
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className={styles['contact-detail-card']}>
              <div className={styles['contact-detail-icon']}>
                <Mail size={20} />
              </div>
              <div className={styles['contact-detail-content']}>
                <div className={styles['contact-detail-label']}>Direct Email</div>
                <a href="mailto:info.jhub@jkuat.ac.ke" className={styles['contact-detail-val']}>
                  <span className="hover-underline-center">info.jhub@jkuat.ac.ke</span>
                </a>
                <div className={styles['contact-detail-sub']}>
                  Replies within 24-48 business hours
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className={styles['contact-detail-card']}>
              <div className={styles['contact-detail-icon']}>
                <Phone size={20} />
              </div>
              <div className={styles['contact-detail-content']}>
                <div className={styles['contact-detail-label']}>Telephone</div>
                <a href="tel:+254720268182" className={styles['contact-detail-val']}>
                  <span className="hover-underline-center">+254 720 268182</span>
                </a>
                <div className={styles['contact-detail-sub']}>
                  General Inquiries & Hub Operations
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className={styles['contact-detail-card']}>
              <div className={styles['contact-detail-icon']}>
                <Clock size={20} />
              </div>
              <div className={styles['contact-detail-content']}>
                <div className={styles['contact-detail-label']}>Working Hours</div>
                <div className={styles['contact-detail-val']} style={{ color: "var(--text-main)" }}>
                  <span className="hover-underline-center">Mon – Fri: 8:00 AM – 5:00 PM EAT</span>
                </div>
                <div className={styles['contact-detail-sub']}>
                  Closed on Weekends & Public Holidays
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Preview for Technology House */}
          <div className={styles['contact-map-wrapper']}>
            <div className={styles['contact-map-header']}>
              <div className={styles['contact-map-title']}>
                <MapPin size={16} style={{ color: "#0f2d59" }} />
                <span>Technology House — JKUAT</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Technology+House+JKUAT+Juja+Kenya"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--jhub-green)", textDecoration: "none" }}
              >
                <span className="hover-underline-center">Open Maps ↗</span>
              </a>
            </div>
            <iframe
              title="Technology House JKUAT Map Location"
              src="https://maps.google.com/maps?q=Technology%20House,%20JKUAT,%20Juja,%20Kenya&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="200"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Social Links Row */}
          <div className={styles['contact-social-section']}>
            <div className={styles['contact-social-title']}>Connect with us</div>
            <div className={styles['contact-social-row']}>
              <a
                href="https://jhubafrica.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['contact-social-btn']}
                aria-label="JHUB Website"
                title="Website"
              >
                <Globe size={18} />
              </a>
              <a
                href="https://linkedin.com/company/jhub-africa"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['contact-social-btn']}
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://x.com/jhubafrica"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['contact-social-btn']}
                aria-label="X (Twitter)"
                title="X"
              >
                <svg style={{ width: "15px", height: "15px", fill: "currentColor" }} viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['contact-social-btn']}
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['contact-social-btn']}
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles['contact-social-btn']}
                aria-label="TikTok"
                title="TikTok"
              >
                <svg style={{ width: "15px", height: "15px", fill: "currentColor" }} viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.11-.83 6.35 6.35 0 0 0-6.35 6.35 6.35 0 0 0 10.66 4.77 6.18 6.18 0 0 0 4.32-6V6.69a8.43 8.43 0 0 0 3.8 1.16V4.4a4.86 4.86 0 0 1-3.8-1.71z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
