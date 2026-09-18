import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitContactInquiry } from "../../../axios/api/contact";
import styles from "../../styles/Contact.module.css";

export function ContactForm() {
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
      toast.success("Thank you! Your inquiry has been submitted successfully.");
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
      const errorMsg = detailsMsg ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not send your message at this time. Please try again later or email us directly.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-copy">
      <h2>Your Details</h2>
      <p>
        Are you looking to partner, sponsor, volunteer, or just to talk with us? Feel free to leave your details in the form below and we will get back to you as soon as possible.
      </p>
      <form
        onSubmit={handleSubmit}
        className={styles['contact-form-container']}
      >
        <div className={styles['contact-form-field']}>
          <label htmlFor="contact-name" className={`${styles['contact-form-label']} ${styles['contact-form-label-required']}`}>
            Your Name *
          </label>
          <input
            required
            id="contact-name"
            name="name"
            aria-label="Your Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="First and Last Name"
            className={styles['contact-form-input']}
            disabled={loading}
          />
        </div>

        <div className={styles['contact-form-row']}>
          <div className={styles['contact-form-field']}>
            <label htmlFor="contact-email" className={`${styles['contact-form-label']} ${styles['contact-form-label-required']}`}>
              Email Address *
            </label>
            <input
              required
              id="contact-email"
              type="email"
              name="email"
              aria-label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={styles['contact-form-input']}
              disabled={loading}
            />
          </div>
          <div className={styles['contact-form-field']}>
            <label htmlFor="contact-phone" className={`${styles['contact-form-label']} ${styles['contact-form-label-optional']}`}>
              Phone Number (Optional)
            </label>
            <input
              id="contact-phone"
              name="phone"
              aria-label="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+254 720 000 000"
              className={styles['contact-form-input']}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles['contact-form-row']}>
          <div className={styles['contact-form-field']}>
            <label htmlFor="contact-role" className={`${styles['contact-form-label']} ${styles['contact-form-label-required']}`}>
              Who are you? *
            </label>
            <select
              id="contact-role"
              name="role"
              aria-label="Who are you?"
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
          <div className={styles['contact-form-field']}>
            <label htmlFor="contact-organisation" className={`${styles['contact-form-label']} ${styles['contact-form-label-optional']}`}>
              Organization (Optional)
            </label>
            <input
              id="contact-organisation"
              name="organisation"
              aria-label="Organization (Optional)"
              value={formData.organisation}
              onChange={handleChange}
              placeholder="Company or Institution"
              className={styles['contact-form-input']}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles['contact-form-field']}>
          <label htmlFor="contact-inquiry" className={`${styles['contact-form-label']} ${styles['contact-form-label-optional']}`}>
            Detailed Inquiry (Optional)
          </label>
          <textarea
            id="contact-inquiry"
            name="inquiry"
            aria-label="Detailed Inquiry (Optional)"
            value={formData.inquiry}
            onChange={handleChange}
            placeholder="How can we assist you?"
            rows={4}
            className={styles['contact-form-input']}
            disabled={loading}
          />
        </div>

        {errorMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              fontSize: "0.88rem",
              color: "#991b1b",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {errorMessage}
          </div>
        )}

        {sent && (
          <div
            style={{
              padding: "0.85rem 1.15rem",
              borderRadius: "10px",
              fontSize: "0.92rem",
              color: "#065f46",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1.5px solid rgba(16, 185, 129, 0.4)",
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
  );
}
