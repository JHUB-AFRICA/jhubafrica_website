import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import image2 from "../assets/images/image2.jpeg";
import image4 from "../assets/images/image4.jpeg";
import image5 from "../assets/images/image5.jpeg";
import image6 from "../assets/images/images6.jpg";
import image7 from "../assets/images/images7.jpg";
import styles from "../styles/Home.module.css";

export const Route = createFileRoute("/for-innovators")({
  head: () => ({
    meta: [
      { title: "For Innovators — JHUB Africa" },
      {
        name: "description",
        content:
          "Submit your innovation to JHUB Africa. Incubation, mentorship, technical support and funding connections for African founders and researchers.",
      },
      { property: "og:title", content: "For Innovators — JHUB Africa" },
      {
        property: "og:description",
        content:
          "Submission pathway, incubation, mentorship, resources and FAQs.",
      },
    ],
  }),
  component: ForInnovatorsPage,
});

const SUPPORT_STEPS = [
  {
    title: "Incubation",
    description: "Build ideas with coaching, lab access and pilot support.",
    image: image7,
    overlay: "linear-gradient(135deg, rgba(15, 45, 89, 0.9), rgba(16, 185, 129, 0.4))",
  },
  {
    title: "Mentorship",
    description: "Connect with experts, investors and industry mentors.",
    image: image2,
    overlay: "linear-gradient(135deg, rgba(4, 120, 87, 0.92), rgba(59, 130, 246, 0.35))",
  },
  {
    title: "Training",
    description: "Develop tech and innovation skills through applied programs.",
    image: image6,
    overlay: "linear-gradient(135deg, rgba(30, 64, 175, 0.9), rgba(245, 158, 11, 0.35))",
  },
  {
    title: "Funding connections",
    description: "Access partner networks, grant opportunities and strategic support.",
    image: image4,
    overlay: "linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(14, 165, 233, 0.35))",
  },
  {
    title: "Commercialisation",
    description: "Validate market fit, scale solutions and reach customers.",
    image: image5,
    overlay: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(16, 185, 129, 0.4))",
  },
] as const;

const STEPS = [
  {
    n: "1",
    t: "Submit",
    d: "Complete the online submission with your problem statement, solution and team.",
  },
  {
    n: "2",
    t: "Screen",
    d: "Our team reviews for fit, feasibility and impact. Response within 10 working days.",
  },
  {
    n: "3",
    t: "Interview",
    d: "Shortlisted teams present to a selection panel and clarify support needs.",
  },
  {
    n: "4",
    t: "Onboard",
    d: "Accepted innovators join the current cohort with a tailored support plan.",
  },
];

const ELIGIBILITY = [
  "Individuals, student teams or early-stage startups",
  "A clearly defined problem and target user in Africa",
  "Willingness to commit to program milestones and reporting",
  "Open to JKUAT and non-JKUAT innovators",
];

const FAQ = [
  {
    q: "Does JHUB take equity?",
    a: "No. Our core incubation is non-dilutive. Any future equity engagement is optional and separately negotiated.",
  },
  {
    q: "Do I need to be a JKUAT student?",
    a: "No. We support innovators from any background, though JKUAT students receive priority for on-campus resources.",
  },
  {
    q: "How long is incubation?",
    a: "The core cycle is 12 weeks, with follow-on support for pilot and market-entry stage projects.",
  },
];

function ForInnovatorsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      <header className="page-header">
        <h1>
          For <span style={{ color: "var(--jhub-green)" }}>Innovators</span>
        </h1>
        <p>
          Get incubation, mentorship, technical support and funding connections
          to move your idea toward market readiness.
        </p>
        <div className="hero-btns" style={{ marginTop: "1.25rem" }}>
          <a
            href="https://innovation.jhubafrica.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Submit your innovation ↗
          </a>
          <Link to="/innovation" className="btn-outline">
            See current portfolio
          </Link>
        </div>
      </header>

      <section className="content-section">
        <div className="section-eyebrow">What you get</div>
        <h2 className="section-h2">Support offered</h2>
        <div className={styles['support-grid']} style={{ marginTop: "1.5rem" }}>
          {SUPPORT_STEPS.map((step) => (
            <article key={step.title} className={styles['support-card']}>
              <div
                className={styles['support-card-media']}
                style={{
                  backgroundImage: `${step.overlay}, url(${step.image})`,
                }}
              />
              <div className={styles['support-card-body']}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: "3.5rem" }}>
          <div className="section-eyebrow">Application process</div>
          <h2 className="section-h2 green">From idea to onboarding</h2>
          <ol className="flow-list">
            {STEPS.map((s) => (
              <li key={s.n}>
                <strong>{s.t}</strong> — {s.d}
              </li>
            ))}
          </ol>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">Eligibility</div>
          <h2 className="section-h2">Who can apply</h2>
          <ul className="flow-list">
            {ELIGIBILITY.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "3.5rem", maxWidth: "800px", margin: "3.5rem auto 0 auto" }}>
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-h2 red" style={{ marginBottom: "1.5rem" }}>Common questions</h2>
          <div className="faq-accordion">
            {FAQ.map((f, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={f.q}
                  className="faq-item"
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                    boxShadow: isOpen ? "0 4px 20px rgba(15, 45, 89, 0.04)" : "none",
                    borderColor: isOpen ? "rgba(16, 185, 129, 0.3)" : "var(--border-color)"
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    style={{
                      width: "100%",
                      padding: "1.25rem 1.5rem",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "var(--jhub-blue)",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      fontFamily: "inherit"
                    }}
                  >
                    <span>{f.q}</span>
                    <span style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      fontSize: "1.2rem",
                      color: "var(--jhub-green)",
                      fontWeight: "bold"
                    }}>
                      ▼
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? "200px" : "0px",
                      transition: "max-height 0.25s ease-in-out, padding 0.25s ease-in-out",
                      overflow: "hidden",
                      padding: isOpen ? "0 1.5rem 1.25rem 1.5rem" : "0 1.5rem",
                      color: "var(--text-main)",
                      fontSize: "0.95rem",
                      lineHeight: "1.6"
                    }}
                  >
                    <p style={{ margin: 0 }}>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <a
            href="https://innovation.jhubafrica.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Submit your innovation ↗
          </a>
        </div>
      </section>
    </>
  );
}
