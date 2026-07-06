import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — JHUB Africa" },
      { name: "description", content: "Toolkits, templates, application guidance, FAQs and downloadable briefs for JHUB Africa innovators and partners." },
      { property: "og:title", content: "Resources — JHUB Africa" },
      { property: "og:description", content: "Toolkits, templates and briefs from JHUB Africa." },
    ],
  }),
  component: ResourcesPage,
});

const ITEMS = [
  { t: "Innovation submission guide", d: "How to frame your problem, solution and team for the JHUB screening panel.", color: "green" as const },
  { t: "Pitch deck template", d: "A 10-slide template used by JHUB cohorts for demo days and sponsor meetings.", color: "" as const },
  { t: "Sponsor portfolio brief", d: "Overview of active themes and fundable projects for partners and funders.", color: "red" as const },
  { t: "Reporting template", d: "Quarterly progress and impact reporting template used by all funded projects.", color: "green" as const },
  { t: "Programs FAQ", d: "Answers to the most common questions about eligibility, timelines and costs.", color: "" as const },
  { t: "Media & brand kit", d: "Logos, colours and guidelines for partners and press using the JHUB brand.", color: "red" as const },
];

function ResourcesPage() {
  return (
    <>
      <header className="page-header">
        <h1><span style={{ color: "var(--jhub-green)" }}>Resources</span></h1>
        <p>Toolkits, templates and briefs to help innovators, students and partners work with JHUB Africa.</p>
      </header>

      <section className="content-section">
        <div className="cards-grid">
          {ITEMS.map((i) => (
            <div key={i.t} className="prog-card">
              <div className={`prog-title ${i.color}`}>{i.t}</div>
              <p className="prog-desc">{i.d}</p>
              <div className="prog-meta"><Link to="/contact" className="prog-arrow">Request →</Link></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}