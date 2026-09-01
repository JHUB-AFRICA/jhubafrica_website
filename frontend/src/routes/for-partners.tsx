import { createFileRoute, Link } from "@tanstack/react-router";
import ApplyDialog from "../components/site/ApplyDialog";
import EditorialHero from "../components/site/EditorialHero";
import heroStyles from "../styles/EditorialHero.module.css";

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
  return (
    <>
      <EditorialHero
        themeVariant="navy"
        badges={[
          { label: "PARTNERSHIP & FUNDING", variant: "sector" },
          { label: "PORTFOLIO BRIEFS", variant: "stage" },
          { label: "TRANSPARENT REPORTING", variant: "verified" },
        ]}
        title={
          <>
            For Partners &amp;{" "}
            <span style={{ color: "#6ee7b7" }}>Funders</span>
          </>
        }
        description="Discover sponsor-ready projects with clear stages, impact areas, teams and support needs — backed by transparent reporting."
        actions={
          <>
            <Link to="/contact" className={heroStyles.btnPrimary}>
              Request portfolio brief
            </Link>
            <Link to="/innovation" className={heroStyles.btnOutline}>
              Browse fundable projects
            </Link>
          </>
        }
      />

      <section className="content-section">
        <div className="section-eyebrow">Partnership models</div>
        <h2 className="section-h2" style={{ marginBottom: "2.5rem" }}>Ways to engage</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
          {MODELS.map((m, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={m.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "2rem",
                  alignItems: "center",
                  padding: "2.25rem 2rem",
                  borderRadius: "18px",
                  background: isEven ? "var(--bg-soft, #f8fafc)" : "#ffffff",
                  border: "none",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--jhub-blue)", margin: "0 0 0.75rem 0" }}>
                    {m.name}
                  </h3>
                  <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                  <ApplyDialog
                    triggerText="Discuss Partnership →"
                    source={m.name}
                    triggerClassName="btn-primary"
                  />
                </div>
              </div>
            );
          })}
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

        <div
          style={{
            marginTop: "4.5rem",
            padding: "3.5rem 2rem",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #07152b 0%, #0d284f 55%, #064e3b 100%)",
            color: "#ffffff",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(7, 21, 43, 0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 2 }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "rgba(110, 231, 183, 0.15)",
                color: "#6ee7b7",
                marginBottom: "1rem",
              }}
            >
              CO-CREATE WITH JHUB AFRICA
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 900, color: "#ffffff", margin: "0 0 1rem 0", lineHeight: 1.2 }}>
              Ready to Accelerate African Innovation?
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.65, margin: "0 0 2rem 0" }}>
              Whether you are looking to sponsor a high-impact climate startup, fund a university hackathon, or co-design applied AI research, our partnerships team is ready to collaborate.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <ApplyDialog
                triggerText="Start the conversation"
                source="Partners Page Banner CTA"
                triggerClassName="btn-primary"
              />
              <Link
                to="/innovation"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.85rem 1.65rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Browse Active Projects →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}