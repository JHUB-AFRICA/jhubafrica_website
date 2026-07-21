import { createFileRoute } from "@tanstack/react-router";
import ApplyDialog from "../components/site/ApplyDialog";
import { IMPACT_METRICS, FOUNDED_YEAR } from "../data/impact";
import ContactStrip from "../components/site/ContactStrip";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — JHUB Africa" },
      {
        name: "description",
        content:
          "JHUB Africa is JKUAT's innovation hub — our mission, vision and the team building Africa's tech ecosystem.",
      },
      { property: "og:title", content: "About — JHUB Africa" },
      {
        property: "og:description",
        content: "Our mission, vision and impact story.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <header className="page-header">
        <h1>
          About <span className="about-header-span">JHUB Africa</span>
        </h1>
        <p>
          Founded in {FOUNDED_YEAR} at Jomo Kenyatta University of Agriculture
          and Technology, JHUB Africa is a place where ideas become products
          that serve Africa. Since our founding, we have supported over 400
          innovators, nurtured 150+ innovations and now engage 1,000+ students
          in cutting-edge projects.
        </p>
      </header>

      <section className="content-section">
        <div className="section-eyebrow">Impact at a glance</div>
        <h2 className="section-h2">Our numbers tell the story</h2>
        <p className="section-p">
          Since founding in 2023, JHUB Africa has grown rapidly — from a single
          hub idea to an ecosystem powering hundreds of innovations across the
          continent.
        </p>

        <div className="stats-bar">
          {IMPACT_METRICS.map((m) => (
            <div key={m.l} className="stat">
              <div className="stat-n">{m.n}</div>
              <div className="stat-l">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-split">
        <div className="split-copy">
          <h2>Our story</h2>
          <p>
            We work at the intersection of technology, business and community —
            with a special focus on AIoT (Artificial Intelligence + Internet of
            Things) — to ensure innovation translates to economic and social
            impact.
          </p>
          <ul>
            <li>Founded within JKUAT to commercialise research</li>
            <li>
              Multi-disciplinary teams across engineering, design and business
            </li>
            <li>Open to JKUAT and non-JKUAT innovators alike</li>
            <li>
              Structured 6-stage framework: from activation to market scale-up
            </li>
            <li>Over 1,000 students engaged across 30+ active projects</li>
          </ul>
        </div>
        <div className="split-panel">
          <div className="info-card no-accent">
            <h3>Mission</h3>
            <p>
              To nurture an innovation-driven ecosystem that creates jobs and
              solves African challenges.
            </p>
          </div>
          <div className="info-card no-accent">
            <h3>Vision</h3>
            <p>To be Africa's leading university-anchored innovation hub.</p>
          </div>
          <div className="info-card no-accent">
            <h3>Values</h3>
            <p>Integrity, collaboration, excellence and impact.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Milestones</div>
        <h2 className="section-h2">Key moments in our journey</h2>
        <ul className="flow-list">
          <li>
            <strong>2023 JHUB Africa Founded</strong> — Established at JKUAT as
            a digital innovation hub to bridge academia and industry.
          </li>
          <li>
            <strong>2024 Rapid Growth</strong> — Scaled to 400+ innovators
            supported with partnerships across industry and government.
          </li>
          <li>
            <strong>2025 SKIES Program Launch</strong> — Launched Rapid Tech
            Skills Training under the World Bank-funded SKIES program, training
            students in cybersecurity, software engineering and data science.
          </li>
          <li>
            <strong>2025 AMREF Partnership</strong> — Partnered with AMREF
            Health Africa to co-develop AI-powered healthcare solutions for
            underserved communities.
          </li>
          <li>
            <strong>2025 1,000+ Students Engaged</strong> — Over 1,000 students
            actively participating in 30+ projects across the digital
            transformation stream.
          </li>
        </ul>
      </section>

      <section className="content-section about-section-center">
        <ApplyDialog triggerText="Contact the team" source="About page" />
      </section>

      <ContactStrip />
    </>
  );
}
