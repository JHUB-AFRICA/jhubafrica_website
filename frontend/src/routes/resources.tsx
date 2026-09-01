import { createFileRoute, Link } from "@tanstack/react-router";
import EditorialHero from "../components/site/EditorialHero";
import heroStyles from "../styles/EditorialHero.module.css";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — JHUB Africa" },
      {
        name: "description",
        content:
          "Toolkits, templates, application guidance, FAQs and downloadable briefs for JHUB Africa innovators and partners.",
      },
      { property: "og:title", content: "Resources — JHUB Africa" },
      {
        property: "og:description",
        content: "Toolkits, templates and briefs from JHUB Africa.",
      },
    ],
  }),
  component: ResourcesPage,
});

const ITEMS = [
  {
    t: "Innovation submission guide",
    d: "How to frame your problem, solution and team for the JHUB screening panel.",
    color: "green" as const,
  },
  {
    t: "Pitch deck template",
    d: "A 10-slide template used by JHUB cohorts for demo days and sponsor meetings.",
    color: "" as const,
  },
  {
    t: "Sponsor portfolio brief",
    d: "Overview of active themes and fundable projects for partners and funders.",
    color: "red" as const,
  },
  {
    t: "Reporting template",
    d: "Quarterly progress and impact reporting template used by all funded projects.",
    color: "green" as const,
  },
  {
    t: "Programs FAQ",
    d: "Answers to the most common questions about eligibility, timelines and costs.",
    color: "" as const,
  },
  {
    t: "Media & brand kit",
    d: "Logos, colours and guidelines for partners and press using the JHUB brand.",
    color: "red" as const,
  },
];

function ResourcesPage() {
  return (
    <>
      <EditorialHero
        themeVariant="default"
        badges={[
          { label: "TOOLKITS & TEMPLATES", variant: "sector" },
          { label: "BRAND & MEDIA KIT", variant: "stage" },
          { label: "GUIDANCE BRIEFS", variant: "verified" },
        ]}
        title={
          <>
            Innovator &amp; Partner <span style={{ color: "#6ee7b7" }}>Resources</span>
          </>
        }
        description="Toolkits, templates and briefs to help innovators, students and partners collaborate and build with JHUB Africa."
        actions={
          <>
            <Link to="/contact" className={heroStyles.btnPrimary}>
              Request custom toolkit
            </Link>
            <Link to="/innovation" className={heroStyles.btnOutline}>
              Browse portfolio
            </Link>
          </>
        }
      />

      <section className="content-section">
        <div className="cards-grid">
          {ITEMS.map((i) => (
            <div key={i.t} className="prog-card">
              <div className={`prog-title ${i.color}`}>{i.t}</div>
              <p className="prog-desc">{i.d}</p>
              <div className="prog-meta">
                <Link to="/contact" className="prog-arrow">
                  Request →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
