import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { addInnovation, getInnovations, type InnovationItem } from "@/lib/api";
import { ContactModal } from "../components/site/ContactModal";

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
  loader: async () => ({ innovations: await getInnovations() }),
  component: InnovationPage,
});

const STAGES = [
  "All",
  "Concept",
  "Prototype",
  "Pilot",
  "Market entry",
  "Scale",
] as const;

function getEmptyInnovation(): Omit<InnovationItem, "id"> {
  return {
    title: "",
    sector: "",
    stage: "Concept",
    need: "",
    problem: "",
    solution: "",
  };
}

function InnovationPage() {
  const router = useRouter();
  const { innovations: initialInnovations } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("All");
  const [sector, setSector] = useState<string>("All");
  const [projects, setProjects] = useState(initialInnovations);
  const [draft, setDraft] = useState<Omit<InnovationItem, "id">>(getEmptyInnovation());
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    setProjects(initialInnovations);
  }, [initialInnovations]);

  const sectors = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.sector)))],
    [projects],
  );

  const filtered = projects.filter((p) => {
    const matchQ =
      q.trim() === "" ||
      `${p.title} ${p.problem} ${p.solution}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const matchStage = stage === "All" || p.stage === stage;
    const matchSector = sector === "All" || p.sector === sector;
    return matchQ && matchStage && matchSector;
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.sector.trim() || !draft.problem.trim() || !draft.solution.trim()) return;

    setSubmitting(true);
    setMsg("Saving...");

    try {
      const created = await addInnovation(draft);
      setProjects((current) => [created, ...current]);
      setDraft(getEmptyInnovation());
      await router.invalidate();
      setMsg("Thanks! Your innovation has been added.");
      setTimeout(() => setMsg(""), 1800);
    } catch (error) {
      console.error(error);
      setMsg("Unable to save this innovation right now.");
    } finally {
      setSubmitting(false);
    }
  }

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
        <h2 style={{ marginBottom: "0.75rem" }}>Submit an innovation</h2>
        <p className="prog-desc" style={{ marginBottom: "1rem" }}>
          Share a new innovation idea with the JHUB team. It will be added to the portfolio for review.
        </p>
        <form onSubmit={submit} style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "1.5rem" }}>
          <input required placeholder="Innovation title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={{ padding: "0.7rem 0.9rem", border: "1px solid var(--border-color)", borderRadius: 8, fontSize: "0.95rem", fontFamily: "inherit", background: "#fff", color: "var(--text-main)" }} />
          <input required placeholder="Sector" value={draft.sector} onChange={(e) => setDraft({ ...draft, sector: e.target.value })} style={{ padding: "0.7rem 0.9rem", border: "1px solid var(--border-color)", borderRadius: 8, fontSize: "0.95rem", fontFamily: "inherit", background: "#fff", color: "var(--text-main)" }} />
          <select value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value as InnovationItem["stage"] })} style={{ padding: "0.7rem 0.9rem", border: "1px solid var(--border-color)", borderRadius: 8, fontSize: "0.95rem", fontFamily: "inherit", background: "#fff", color: "var(--text-main)" }}>
            <option value="Concept">Concept</option>
            <option value="Prototype">Prototype</option>
            <option value="Pilot">Pilot</option>
            <option value="Market entry">Market entry</option>
            <option value="Scale">Scale</option>
          </select>
          <input required placeholder="Support needed" value={draft.need} onChange={(e) => setDraft({ ...draft, need: e.target.value })} style={{ padding: "0.7rem 0.9rem", border: "1px solid var(--border-color)", borderRadius: 8, fontSize: "0.95rem", fontFamily: "inherit", background: "#fff", color: "var(--text-main)" }} />
          <textarea required rows={3} placeholder="Problem" value={draft.problem} onChange={(e) => setDraft({ ...draft, problem: e.target.value })} style={{ padding: "0.7rem 0.9rem", border: "1px solid var(--border-color)", borderRadius: 8, fontSize: "0.95rem", fontFamily: "inherit", background: "#fff", color: "var(--text-main)", gridColumn: "1 / -1", resize: "vertical" }} />
          <textarea required rows={3} placeholder="Solution" value={draft.solution} onChange={(e) => setDraft({ ...draft, solution: e.target.value })} style={{ padding: "0.7rem 0.9rem", border: "1px solid var(--border-color)", borderRadius: 8, fontSize: "0.95rem", fontFamily: "inherit", background: "#fff", color: "var(--text-main)", gridColumn: "1 / -1", resize: "vertical" }} />
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", gridColumn: "1 / -1" }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Add innovation"}
            </button>
            {msg && <span style={{ color: "var(--jhub-green)", fontSize: "0.9rem" }}>{msg}</span>}
          </div>
        </form>

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
          Showing {filtered.length} of {projects.length} innovations
        </div>

        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {filtered.map((p) => (
            <article key={p.id} className="prog-card">
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
            <button
              className="btn-primary"
              onClick={() => setIsContactModalOpen(true)}
            >
              Talk to the JHUB team
            </button>
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

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source="Innovation Page - Talk to JHUB Team"
      />
    </>
  );
}
