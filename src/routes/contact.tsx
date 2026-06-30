import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
    head: () => ({
        meta: [
            { title: "Contact — JHUB Africa" },
            { name: "description", content: "Reach JHUB Africa at JKUAT. Phone, email and partnership inquiries." },
            { property: "og:title", content: "Contact — JHUB Africa" },
            { property: "og:description", content: "Get in touch with the JHUB Africa team." },
        ],
    }),
    component: ContactPage,
});

function ContactPage() {
    const [sent, setSent] = useState(false);
    const [role, setRole] = useState("General inquiry");
    return (
        <>
            <header className="page-header">
                <h1>Contact <span style={{ color: "var(--jhub-green)" }}>Us</span></h1>
                <p>Tell us who you are and we'll route your message to the right team. We usually respond within five working days.</p>
            </header>

            <section className="feature-split">
                <div className="split-copy">
                    <h2>Reach out</h2>
                    <p>Pick the option that best describes you — your message will reach the right JHUB team.</p>
                    <form
                        onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                        style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}
                    >
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle} aria-label="Inquiry type">
                            <option>General inquiry</option>
                            <option>Submit an innovation</option>
                            <option>Sponsor a project</option>
                            <option>Partner with JHUB</option>
                            <option>Course / cohort interest</option>
                            <option>Event registration</option>
                            <option>Media / press</option>
                        </select>
                        <input required placeholder="Your name" style={inputStyle} />
                        <input required type="email" placeholder="Email address" style={inputStyle} />
                        <input placeholder="Organisation (optional)" style={inputStyle} />
                        <textarea required placeholder="Your message" rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                        <button type="submit" className="btn-primary" style={{ justifySelf: "start" }}>
                            {sent ? "Message sent ✓ — we'll be in touch" : "Send message"}
                        </button>
                    </form>
                </div>
                <div className="split-panel">
                    <div className="info-card blue">
                        <h3>Jomo Kenyatta University of Agriculture and Technology</h3>
                        <p>JKUAT Main Campus, Juja, Kenya</p>
                    </div>
                    <div className="info-card green">
                        <h3 className="green">Phone</h3>
                        <p>Tel: +254 67 52181/4 — LAN Ext: 2814</p>
                    </div>
                    <div className="info-card">
                        <h3 className="red">Email</h3>
                        <p><a href="mailto:info.jhub@jkuat.ac.ke">info.jhub@jkuat.ac.ke</a></p>
                    </div>
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