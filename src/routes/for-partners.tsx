import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ContactModal } from "../components/site/ContactModal";

export const Route = createFileRoute("/for-partners")({
  head: () => ({
    meta: [
      { title: "For Partners & Funders — JHUB Africa" },
      {
        name: "description",
        content:
          "Partnership models, funding pathways, portfolio briefs and transparent reporting for sponsors of JHUB Africa innovations.",
      },
      { property: "og:title", content: "For Partners & Funders — JHUB Africa" },
      {
        property: "og:description",
        content:
          "Sponsor credible African innovations with transparent reporting.",
      },
    ],
  }),
  component: ForPartnersPage,
});

const MODELS = [
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
    desc: "Back a portfolio theme (e.g. Climate Smart Agriculture). Funds are allocated to the most ready innovations in the theme.",
  },
  {
    name: "Strategic Partner",
    color: "red" as const,
    range: "Custom",
    desc: "Co-design challenge calls, hackathons or applied research with JHUB and JKUAT faculties. Multi-year engagement.",
  },
];

const PROCESS = [
  {
    t: "Discover",
    d: "Request a portfolio brief or pick a theme aligned with your priorities.",
  },
  {
    t: "Due diligence",
    d: "Review project one-pagers, teams, traction and evidence tiers before committing.",
  },
  {
    t: "Scope",
    d: "Agree goals, milestones, budget and reporting cadence in a partnership memo.",
  },
  {
    t: "Deploy",
    d: "JHUB allocates funds, provides technical oversight and manages delivery.",
  },
  {
    t: "Report",
    d: "Receive quarterly progress, impact and financial reports plus annual recognition.",
  },
];

function ForPartnersPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <header className="page-header">
        <h1>
          For Partners &amp;{" "}
          <span style={{ color: "var(--jhub-green)" }}>Funders</span>
        </h1>
        <p>
          Discover sponsor-ready projects with clear stages, impact areas, teams
          and support needs — backed by transparent reporting.
        </p>
        <div className="hero-btns" style={{ marginTop: "1.25rem" }}>
          <button
            className="btn-primary"
            onClick={() => setIsContactModalOpen(true)}
          >
            Request portfolio brief
          </button>
          <Link to="/innovation" className="btn-outline">
            Browse fundable projects
          </Link>
        </div>
      </header>

      <section className="content-section">
        <div className="section-eyebrow">Partnership models</div>
        <h2 className="section-h2">Ways to engage</h2>
        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {MODELS.map((m) => (
            <div key={m.name} className="prog-card">
              <div className={`prog-title ${m.color}`}>{m.name}</div>
              <p className="prog-desc">{m.desc}</p>
              <div className="prog-meta">
                <span className="prog-slots">{m.range}</span>
                <button
                  className="prog-arrow"
                  onClick={() => setIsContactModalOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                    color: "inherit",
                  }}
                >
                  Discuss →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">How funding works</div>
          <h2 className="section-h2 green">A transparent flow</h2>
          <ol className="flow-list">
            {PROCESS.map((p) => (
              <li key={p.t}>
                <strong>{p.t}</strong> — {p.d}
              </li>
            ))}
          </ol>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">Recognition</div>
          <h2 className="section-h2">How we credit partners</h2>
          <p className="section-p">
            Sponsors are credited on project pages, in annual reports and at
            JHUB events, in line with the recognition tier of the package.
          </p>
        </div>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <button
            className="btn-primary"
            onClick={() => setIsContactModalOpen(true)}
          >
            Start the conversation
          </button>
        </div>
      </section>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source="For Partners Page"
      />
    </>
  );
}
