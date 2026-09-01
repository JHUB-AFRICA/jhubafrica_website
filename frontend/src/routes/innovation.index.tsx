import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getInnovations } from "../../axios/api/innovations";
import { InnovationItem } from "../types/innovations";
import styles from "../styles/Innovations.module.css";
import SkeletonCards from "../components/site/SkeletonCards";
import ResourceFallback from "../components/site/ResourceFallback";
import EditorialHero from "../components/site/EditorialHero";
import heroStyles from "../styles/EditorialHero.module.css";

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
  errorComponent: ({ error, reset }) => (
    <>
      <EditorialHero
        themeVariant="default"
        badges={[
          { label: "VENTURE PORTFOLIO", variant: "sector" },
          { label: "SPONSOR-READY", variant: "stage" },
          { label: "JKUAT PIPELINE", variant: "verified" },
        ]}
        title={
          <>
            Innovations <span style={{ color: "#6ee7b7" }}>Portfolio</span>
          </>
        }
        description="A searchable portfolio of African innovations in our pipeline. Filter by sector, stage or support need — and sponsor a project that fits your priorities."
      />
      <section className="content-section">
        <ResourceFallback error={error} onRetry={reset} resourceName="Innovations Portfolio" />
      </section>
    </>
  ),
  pendingComponent: () => (
    <>
      <EditorialHero
        themeVariant="default"
        badges={[
          { label: "VENTURE PORTFOLIO", variant: "sector" },
          { label: "SPONSOR-READY", variant: "stage" },
          { label: "JKUAT PIPELINE", variant: "verified" },
        ]}
        title={
          <>
            Innovations <span style={{ color: "#6ee7b7" }}>Portfolio</span>
          </>
        }
        description="A searchable portfolio of African innovations in our pipeline. Filter by sector, stage or support need — and sponsor a project that fits your priorities."
      />

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

const INNOVATION_METRICS = [
  { n: 56, l: "Current Innovations", suffix: "" },
  { n: 25, l: "Prototypes Built", suffix: "+" },
  { n: 12, l: "Pilots Deployed", suffix: "" },
  { n: 8, l: "Market-Ready Solutions", suffix: "" },
];

function InnovationPage() {
  const innovations: InnovationItem[] = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("All");
  const [sector, setSector] = useState<string>("All");
  const [counts, setCounts] = useState<number[]>(INNOVATION_METRICS.map(() => 0));

  useEffect(() => {
    const duration = 1500; // ms
    const steps = 60;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts(
        INNOVATION_METRICS.map((m) => {
          return Math.floor(m.n * Math.min(progress, 1));
        })
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(INNOVATION_METRICS.map((m) => m.n));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

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
      <EditorialHero
        themeVariant="default"
        badges={[
          { label: "VENTURE PORTFOLIO", variant: "sector" },
          { label: "SPONSOR-READY", variant: "stage" },
          { label: "JKUAT PIPELINE", variant: "verified" },
        ]}
        title={
          <>
            Innovations <span style={{ color: "#6ee7b7" }}>Portfolio</span>
          </>
        }
        description="A searchable portfolio of African innovations in our pipeline. Filter by sector, stage or support need — and sponsor a project that fits your priorities."
        actions={
          <>
            <a
              href="https://innovation.jhubafrica.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={heroStyles.btnPrimary}
            >
              Submit your innovation ↗
            </a>
            <Link to="/support" className={heroStyles.btnOutline}>
              Sponsorship pathways
            </Link>
          </>
        }
        bottomSlot={
          <div className={styles['hero-stats-bar']}>
            {INNOVATION_METRICS.map((m, index) => (
              <div key={m.l} className={styles['hero-stat']}>
                <div className={styles['hero-stat-n']}>
                  {counts[index]}
                  {m.suffix}
                </div>
                <div className={styles['hero-stat-l']}>{m.l}</div>
              </div>
            ))}
          </div>
        }
      />

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

        <div className="cards-grid" style={{ gap: "2.5rem 2rem", marginTop: "1.5rem" }}>
          {filtered.map((p) => {
            return (
              <Link
                key={p.id}
                to="/innovation/$slug"
                params={{ slug: p.slug || "" }}
                className="innovation-card-borderless"
              >
                <div className="innovation-media-wrap">
                  {p.coverImageUrl ? (
                    <img
                      src={p.coverImageUrl}
                      alt={p.title}
                    />
                  ) : (
                    <div style={{ height: "100%", width: "100%", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0f2d59 0%, #1e1b4b 100%)" }}>
                      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`grid-portfolio-${p.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="#ffffff" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#grid-portfolio-${p.id})`} />
                      </svg>
                      <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)", filter: "blur(10px)" }} />
                      <div style={{ position: "absolute", bottom: "-30px", right: "-10px", width: "140px", height: "140px", borderRadius: "50%", background: "radial-gradient(circle, rgba(15, 45, 89, 0.6) 0%, rgba(15, 45, 89, 0) 70%)", filter: "blur(10px)" }} />
                      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <span style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(255, 255, 255, 0.08)", border: "none", borderRadius: "8px", padding: "6px 16px", backdropFilter: "blur(4px)" }}>JHUB</span>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "700", color: "var(--jhub-green)", marginBottom: "0.4rem" }}>
                  {p.sector} · {p.stage}
                </div>
                <div className="prog-title hover-underline-center" style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: "700", lineHeight: "1.3", marginBottom: "0.4rem" }}>
                  {p.title}
                </div>
                {p.description && (
                  <p className="prog-desc" style={{ flexGrow: 1, margin: "0 0 1.25rem 0", fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: "1.55" }}>
                    {p.description}
                  </p>
                )}
                <div style={{ marginTop: "auto", paddingTop: "0.25rem" }}>
                  <span className="prog-arrow" style={{ fontSize: "0.88rem" }}>
                    View Project →
                  </span>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div
              className="innovation-card-borderless"
              style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 1rem" }}
            >
              <p className="prog-desc" style={{ fontSize: "1.05rem", color: "var(--text-muted)" }}>
                No innovations match your filters. Try selecting a different sector or stage.
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
