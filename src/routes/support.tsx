import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Fund a Project — JHUB Africa" },
      {
        name: "description",
        content:
          "Sponsor JHUB Africa innovations. Sponsor packages, fundable themes, reporting promise and FAQs.",
      },
      { property: "og:title", content: "Fund a Project — JHUB Africa" },
      {
        property: "og:description",
        content:
          "Sponsor credible African innovations with transparent reporting.",
      },
    ],
  }),
  component: SupportPage,
});

const FAQ = [
  {
    q: "How is my sponsorship used?",
    a: "Funds are ring-fenced to the project or theme you select. We publish quarterly progress and impact reports for every funded initiative.",
  },
  {
    q: "Can I sponsor a theme instead of one project?",
    a: "Yes. Thematic sponsorship (e.g. Climate Smart Agriculture, AI for inclusion) lets us back the most promising innovations in that area.",
  },
  {
    q: "What happens after I submit interest?",
    a: "A JHUB partnerships lead reaches out within five working days to scope your priorities, share a portfolio brief and propose next steps.",
  },
  {
    q: "Do I get recognition?",
    a: "Sponsors are credited on project pages, in annual reports and at JHUB events, in line with the recognition tier of your package.",
  },
];

const PACKAGES = [
  {
    name: "Project Sponsor",
    color: "green" as const,
    range: "From USD 5,000",
    desc: "Sponsor a single innovation through a defined stage — prototype, pilot or market entry — with quarterly reporting.",
  },
  {
    name: "Theme Sponsor",
    color: "" as const,
    range: "From USD 25,000",
    desc: "Back a portfolio theme (e.g. Climate Smart Agriculture). Funds are allocated to the most ready innovations within the theme.",
  },
  {
    name: "Strategic Partner",
    color: "red" as const,
    range: "Custom",
    desc: "Co-design challenge calls, hackathons or applied research with JHUB and JKUAT faculties. Multi-year engagement.",
  },
];

const THEMES = [
  "Climate Smart Agriculture",
  "Big AI Ideas",
  "Digital Trade",
  "Green Digital Innovation",
  "Digital Twin Models",
  "Gaming for Learning",
];

function SupportPage() {
  return (
    <>
      <header className="page-header">
        <h1>
          Fund a <span style={{ color: "var(--jhub-green)" }}>Project</span>
        </h1>
        <p>
          Back credible African innovations with transparent reporting. Choose a
          project, a theme or a strategic partnership — and see your sponsorship
          turn into measurable impact.
        </p>
        <div className="hero-btns" style={{ marginTop: "1.25rem" }}>
          <Link to="/contact" className="btn-primary">
            Request a funding conversation
          </Link>
          <Link to="/innovation" className="btn-outline">
            View fundable innovations
          </Link>
        </div>
      </header>

      <section className="content-section">
        <div className="section-eyebrow">Sponsor packages</div>
        <h2 className="section-h2">Ways to fund</h2>
        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {PACKAGES.map((p) => (
            <div key={p.name} className="prog-card">
              <div className={`prog-title ${p.color}`}>{p.name}</div>
              <p className="prog-desc">{p.desc}</p>
              <div className="prog-meta">
                <span className="prog-slots">{p.range}</span>
                <Link to="/contact" className="prog-arrow">
                  Discuss →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">Fundable themes</div>
          <h2 className="section-h2 green">Where your support goes</h2>
          <div className="theme-grid">
            {THEMES.map((t) => (
              <span key={t} className="theme-pill">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">How funding works</div>
          <h2 className="section-h2">A transparent flow</h2>
          <ol className="flow-list">
            <li>
              <strong>Discover</strong> — request a portfolio brief or pick a
              theme.
            </li>
            <li>
              <strong>Scope</strong> — agree on goals, milestones and reporting
              cadence.
            </li>
            <li>
              <strong>Deploy</strong> — JHUB allocates funds and provides
              technical oversight.
            </li>
            <li>
              <strong>Report</strong> — receive quarterly progress, impact and
              financial reports.
            </li>
          </ol>
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
          <Link to="/contact" className="btn-primary">
            Start the conversation
          </Link>
        </div>
      </section>
    </>
  );
}
