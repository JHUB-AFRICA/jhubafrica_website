import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getInnovations } from "../../axios/api/innovations";
import { InnovationItem } from "../types/innovations";
import styles from "../styles/Innovations.module.css";
import SkeletonCards from "../components/site/SkeletonCards";

export const Route = createFileRoute("/innovation/")({
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
  loader: async () => {
    return getInnovations();
  },
  component: InnovationPage,
  pendingComponent: () => (
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
        <SkeletonCards count={4} hasImage={true} />
      </section>
    </>
  ),
});

const STAGES = [
  "All",
  "Concept",
  "Prototype",
  "Pilot",
  "Market entry",
  "Scale",
] as const;

const SECTORS = [
  "All",
  "Big AI Ideas",
  "Climate Smart Agriculture",
  "Digital Trade",
  "Digital Tranformation",
  "Digital Twin Models",
  "Gaming",
  "Green Digital Innovationt"
] as const;

function InnovationPage() {
  const innovations: InnovationItem[] = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("All");
  const [sector, setSector] = useState<string>("All");

  const filtered = innovations.filter((p) => {
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
        <div className={styles['filter-bar']}>
          <input
            type="search"
            placeholder="Search innovations..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={styles['filter-input']}
            aria-label="Search innovations"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as typeof stage)}
            className={styles['filter-select']}
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
            className={styles['filter-select']}
            aria-label="Filter by sector"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                Sector: {s}
              </option>
            ))}
          </select>
        </div>

        <div className={styles['filter-meta']}>
          Showing {filtered.length} of {innovations.length} innovations
        </div>

        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {filtered.map((p) => (
            <Link
              key={p.id}
              to="/innovation/$slug"
              params={{ slug: p.slug || "" }}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <article className="prog-card" style={{ height: "100%", cursor: "pointer", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                {p.coverImageUrl ? (
                  <div style={{ height: "180px", overflow: "hidden", borderBottom: "1px solid var(--border-color)" }}>
                    <img 
                      src={p.coverImageUrl} 
                      alt={p.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                ) : (
                  <div style={{ height: "180px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0f2d59 0%, #1e1b4b 100%)", borderBottom: "1px solid var(--border-color)" }}>
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid-portfolio" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="#ffffff" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-portfolio)" />
                    </svg>
                    <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)", filter: "blur(10px)" }} />
                    <div style={{ position: "absolute", bottom: "-30px", right: "-10px", width: "140px", height: "140px", borderRadius: "50%", background: "radial-gradient(circle, rgba(15, 45, 89, 0.6) 0%, rgba(15, 45, 89, 0) 70%)", filter: "blur(10px)" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <span style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "8px", padding: "6px 16px", backdropFilter: "blur(4px)" }}>JHUB</span>
                    </div>
                  </div>
                )}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <div className="prog-title" style={{ marginTop: 0, fontSize: "1.25rem" }}>{p.title}</div>
                  
                  {p.description && (
                    <p className="prog-desc" style={{ marginTop: "0.5rem", color: "#475569", fontSize: "0.95rem", flexGrow: 1 }}>
                      {p.description}
                    </p>
                  )}
                  
                  <div className="prog-meta" style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                    <span className="prog-arrow">
                      View project details →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
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
