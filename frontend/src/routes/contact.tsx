import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import styles from "../styles/Contact.module.css";

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
              />
            </div>

            <button
              type="submit"
              className={`btn-primary ${styles['contact-form-submit']}`}
            >
              {sent ? "Message sent ✓" : "Send Message"}
            </button>
          </form>
        </div>

        <div className={`split-panel ${styles['contact-split-panel']}`}>
          <h3 className={styles['contact-panel-h3']}>Our Details</h3>
          <p className={styles['contact-panel-p']}>
            <strong>Jomo Kenyatta University of Agriculture and Technology</strong>
            <br />
            P.O. BOX: 62000-00200, Nairobi, Kenya.
            <br />
            <strong>Tel:</strong> +254 67 52181/4 LAN Ext 2814.
            <br />
            <strong>Email :</strong>{" "}
            <a href="mailto:info.jhub@jkuat.ac.ke" className={styles['contact-panel-link']}>
              info.jhub@jkuat.ac.ke
            </a>
          </p>

          <p className={`${styles['contact-panel-p']} ${styles['contact-panel-p-muted']}`}>
            <strong>Jomo Kenyatta University of Agriculture and Technology</strong>
          </p>
          <p className={styles['contact-panel-map-link']}>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              Open in Maps ↗
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
