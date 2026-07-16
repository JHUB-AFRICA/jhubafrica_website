import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/innovation")({
  head: () => ({
    meta: [
      { title: "Innovations Portfolio — JHUB Africa" },
      {
        name: "description",
        content:
          "Browse JHUB Africa's innovation portfolio. Filter by sector, stage and support need — and sponsor a project.",
      },
      { property: "og:title", content: "Innovations Portfolio — JHUB Africa" },
      {
        property: "og:description",
        content: "A searchable portfolio of fundable African innovations.",
      },
    ],
  }),
  component: InnovationPage,
});

type Project = {
  title: string;
  sector: string;
  stage: "Concept" | "Prototype" | "Pilot" | "Market entry" | "Scale";
  need: string;
  problem: string;
  solution: string;
};

const PROJECTS: Project[] = [
  {
    title: "Smart Irrigation for Smallholders",
    sector: "Climate Smart Agriculture",
    stage: "Pilot",
    need: "Pilot funding",
    problem: "Smallholder farms lose yields to inconsistent water supply.",
    solution: "Low-cost IoT controllers cutting water use by up to 35%.",
  },
  {
    title: "Swahili Voice Assistant",
    sector: "Big AI Ideas",
    stage: "Prototype",
    need: "Compute & data",
    problem: "Voice tools exclude Swahili and code-switching speakers.",
    solution:
      "Speech models tuned for Kenyan Swahili and mixed-language input.",
  },
  {
    title: "Cross-border SME Marketplace",
    sector: "Digital Trade",
    stage: "Market entry",
    need: "Mentorship",
    problem: "SMEs lack compliant pathways to regional buyers.",
    solution: "B2B marketplace with AfCFTA-aware compliance tooling.",
  },
  {
    title: "Solar Cold-Chain Box",
    sector: "Green Digital Innovation",
    stage: "Prototype",
    need: "Pilot partners",
    problem: "Post-harvest losses for dairy and horticulture exceed 30%.",
    solution: "Solar-powered cold storage with remote monitoring.",
  },
  {
    title: "Digital Twin for Campus Energy",
    sector: "Digital Twin Models",
    stage: "Pilot",
    need: "Technical mentorship",
    problem: "Campuses lack visibility into energy waste.",
    solution: "Real-time digital twin modelling consumption and savings.",
  },
  {
    title: "EduGame: STEM Learning",
    sector: "Gaming",
    stage: "Concept",
    need: "Seed funding",
    problem: "Low STEM engagement in upper-primary classrooms.",
    solution: "Mobile-first educational games tied to the CBC curriculum.",
  },
  {
    title: "AgriCredit Scoring",
    sector: "Big AI Ideas",
    stage: "Pilot",
    need: "Data partners",
    problem: "Smallholder farmers lack credit history for loans.",
    solution: "Alternative-data credit scoring using farm and mobile signals.",
  },
  {
    title: "Plastic-to-Pavement",
    sector: "Green Digital Innovation",
    stage: "Scale",
    need: "Market access",
    problem: "Plastic waste accumulates in urban areas.",
    solution: "Recycled plastic pavement blocks for low-traffic streets.",
  },
];

const STAGES = [
  "All",
  "Concept",
  "Prototype",
  "Pilot",
  "Market entry",
  "Scale",
] as const;

function InnovationPage() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("All");
  const [sector, setSector] = useState<string>("All");

  const sectors = useMemo(
    () => ["All", ...Array.from(new Set(PROJECTS.map((p) => p.sector)))],
    [],
  );

  const filtered = PROJECTS.filter((p) => {
    const matchQ =
      q.trim() === "" ||
      `${p.title} ${p.problem} ${p.solution}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const matchStage = stage === "All" || p.stage === stage;
    const matchSector = sector === "All" || p.sector === sector;
    return matchQ && matchStage && matchSector;
  });

  return (
    <>
      <header className="page-header">
        <h1>
          Innovations{" "}
          <span style={{ color: "var(--jhub-green)" }}>Portfolio</span>
        </h1>
        <p>
          A searchable portfolio of African innovations in our pipeline. Filter
          by sector, stage or support need — and sponsor a project that fits
          your priorities.
        </p>
      </header>

      <section className="content-section">
        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search innovations..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="filter-input"
            aria-label="Search innovations"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as typeof stage)}
            className="filter-select"
            aria-label="Filter by stage"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                Stage: {s}
              </option>
            ))}
          </select>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="filter-select"
            aria-label="Filter by sector"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                Sector: {s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-meta">
          Showing {filtered.length} of {PROJECTS.length} innovations
        </div>

        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {filtered.map((p) => (
            <article key={p.title} className="prog-card">
              <div className="prog-title">{p.title}</div>
              <p className="prog-desc">
                <strong style={{ color: "var(--jhub-blue)" }}>Problem:</strong>{" "}
                {p.problem}
              </p>
              <p className="prog-desc" style={{ marginTop: "0.4rem" }}>
                <strong style={{ color: "var(--jhub-green)" }}>
                  Solution:
                </strong>{" "}
                {p.solution}
              </p>
              <div className="quick-facts">
                <span className="qf-pill">
                  <strong>Stage</strong> {p.stage}
                </span>
                <span className="qf-pill">
                  <strong>Needs</strong> {p.need}
                </span>
              </div>
              <div className="prog-meta">
                <Link to="/support" className="prog-arrow">
                  Sponsor this project →
                </Link>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div
              className="prog-card"
              style={{ gridColumn: "1 / -1", textAlign: "center" }}
            >
              <p className="prog-desc">
                No innovations match your filters. Try clearing them.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="feature-split">
        <div className="split-copy">
          <h2>From idea to scale</h2>
          <p>
            Every project moves through a transparent pipeline. We support
            innovators with the right resources for their stage.
          </p>
          <ul>
            <li>
              <strong>Concept</strong> — problem framing, user research, concept
              notes
            </li>
            <li>
              <strong>Prototype</strong> — technical mentorship, lab access,
              design sprints
            </li>
            <li>
              <strong>Pilot</strong> — pilot funding, data partners, real-user
              testing
            </li>
            <li>
              <strong>Market entry</strong> — go-to-market coaching, compliance,
              partnerships
            </li>
            <li>
              <strong>Scale</strong> — investor introductions, regional
              partners, growth support
            </li>
          </ul>
          <div style={{ marginTop: "1.5rem" }}>
            <Link to="/contact" className="btn-primary">
              Talk to the JHUB team
            </Link>
          </div>
        </div>
        <div className="split-panel">
          <div className="info-card no-accent">
            <h3 className="green">Evidence tiers</h3>
            <p>
              Every project page lists concept notes, prototype demos, pilot
              data and users reached — no vague claims.
            </p>
          </div>
          <div className="info-card no-accent">
            <h3>Transparent selection</h3>
            <p>
              Innovations are reviewed against published criteria for impact,
              feasibility and team capacity.
            </p>
          </div>
          <div className="info-card no-accent">
            <h3 className="red">Reporting promise</h3>
            <p>
              Funded projects publish quarterly progress updates so sponsors see
              how their support is used.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
