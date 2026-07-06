import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/for-innovators")({
  head: () => ({
    meta: [
      { title: "For Innovators — JHUB Africa" },
      { name: "description", content: "Submit your innovation to JHUB Africa. Incubation, mentorship, technical support and funding connections for African founders and researchers." },
      { property: "og:title", content: "For Innovators — JHUB Africa" },
      { property: "og:description", content: "Submission pathway, incubation, mentorship, resources and FAQs." },
    ],
  }),
  component: ForInnovatorsPage,
});

const SUPPORT = [
  { title: "Incubation", desc: "Structured 12-week programs with workspace, mentors and milestone reviews.", color: "green" as const },
  { title: "Mentorship", desc: "Matched mentors from industry, JKUAT faculty and the JHUB alumni network.", color: "" as const },
  { title: "Technical support", desc: "Access to labs, cloud credits and engineering reviews with our tech team.", color: "red" as const },
  { title: "Funding connections", desc: "Warm introductions to sponsors, grant programs and pre-seed investors.", color: "green" as const },
];

const STEPS = [
  { n: "1", t: "Submit", d: "Complete the online submission with your problem statement, solution and team." },
  { n: "2", t: "Screen", d: "Our team reviews for fit, feasibility and impact. Response within 10 working days." },
  { n: "3", t: "Interview", d: "Shortlisted teams present to a selection panel and clarify support needs." },
  { n: "4", t: "Onboard", d: "Accepted innovators join the current cohort with a tailored support plan." },
];

const ELIGIBILITY = [
  "Individuals, student teams or early-stage startups",
  "A clearly defined problem and target user in Africa",
  "Willingness to commit to program milestones and reporting",
  "Open to JKUAT and non-JKUAT innovators",
];

const FAQ = [
  { q: "Does JHUB take equity?", a: "No. Our core incubation is non-dilutive. Any future equity engagement is optional and separately negotiated." },
  { q: "Do I need to be a JKUAT student?", a: "No. We support innovators from any background, though JKUAT students receive priority for on-campus resources." },
  { q: "How long is incubation?", a: "The core cycle is 12 weeks, with follow-on support for pilot and market-entry stage projects." },
];

function ForInnovatorsPage() {
  return (
    <>
      <header className="page-header">
        <h1>For <span style={{ color: "var(--jhub-green)" }}>Innovators</span></h1>
        <p>Get incubation, mentorship, technical support and funding connections to move your idea toward market readiness.</p>
        <div className="hero-btns" style={{ marginTop: "1.25rem" }}>
          <Link to="/contact" className="btn-primary">Submit your innovation</Link>
          <Link to="/innovation" className="btn-outline">See current portfolio</Link>
        </div>
      </header>

      <section className="content-section">
        <div className="section-eyebrow">What you get</div>
        <h2 className="section-h2">Support offered</h2>
        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {SUPPORT.map((s) => (
            <div key={s.title} className="prog-card">
              <div className={`prog-title ${s.color}`}>{s.title}</div>
              <p className="prog-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">Application process</div>
          <h2 className="section-h2 green">From idea to onboarding</h2>
          <ol className="flow-list">
            {STEPS.map((s) => (
              <li key={s.n}><strong>{s.t}</strong> — {s.d}</li>
            ))}
          </ol>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">Eligibility</div>
          <h2 className="section-h2">Who can apply</h2>
          <ul className="flow-list">
            {ELIGIBILITY.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-h2 red">Common questions</h2>
          <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
            {FAQ.map((f) => (
              <div key={f.q} className="prog-card">
                <div className="prog-title">{f.q}</div>
                <p className="prog-desc">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <Link to="/contact" className="btn-primary">Start your application</Link>
        </div>
      </section>
    </>
  );
}