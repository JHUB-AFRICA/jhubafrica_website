import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JHUB Africa" },
      {
        name: "description",
        content:
          "Reach JHUB Africa at JKUAT. Phone, email and partnership inquiries.",
      },
      { property: "og:title", content: "Contact — JHUB Africa" },
      {
        property: "og:description",
        content: "Get in touch with the JHUB Africa team.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <header className="contact-page-header">
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
            className="contact-form-container"
          >
            <div>
              <label className="contact-form-label contact-form-label-required">Your Name (Required) *</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="First and Last Name"
                className="contact-form-input"
              />
            </div>

            <div className="contact-form-row">
              <div>
                <label className="contact-form-label contact-form-label-required">Your Email Address (Required) *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="contact-form-input"
                />
              </div>
              <div>
                <label className="contact-form-label contact-form-label-optional">Your phone number (Optional)</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 720 000 000"
                  className="contact-form-input"
                />
              </div>
            </div>

            <div className="contact-form-row">
              <div>
                <label className="contact-form-label contact-form-label-required">Who are you?</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="contact-form-input"
                  title="Select your role"
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
                <label className="contact-form-label contact-form-label-optional">Where Are you from? (Optional)</label>
                <input
                  name="organisation"
                  value={formData.organisation}
                  onChange={handleChange}
                  placeholder="Organisation"
                  className="contact-form-input"
                />
              </div>
            </div>

            <div>
              <label className="contact-form-label contact-form-label-optional">Detailed Inquiry (Optional)</label>
              <textarea
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                placeholder="Type Inquiry"
                rows={4}
                className="contact-form-input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary contact-form-submit"
            >
              {sent ? "Message sent ✓" : "Send Message"}
            </button>
          </form>
        </div>

        <div className="split-panel contact-split-panel">
          <h3 className="contact-panel-h3">Our Details</h3>
          <p className="contact-panel-p">
            <strong>Jomo Kenyatta University of Agriculture and Technology</strong>
            <br />
            P.O. BOX: 62000-00200, Nairobi, Kenya.
            <br />
            <strong>Tel:</strong> +254 67 52181/4 LAN Ext 2814.
            <br />
            <strong>Email :</strong>{" "}
            <a href="mailto:info.jhub@jkuat.ac.ke" className="contact-panel-link">
              info.jhub@jkuat.ac.ke
            </a>
          </p>

          <p className="contact-panel-p-muted">
            <strong>Jomo Kenyatta University of Agriculture and Technology</strong>
          </p>
          <p className="contact-panel-map-link">
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              Open in Maps ↗
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.7rem 0.9rem",
  border: "1px solid var(--border-color)",
  borderRadius: "8px",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  background: "#fff",
  color: "var(--text-main)",
  outline: "none",
};
