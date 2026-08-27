import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IMPACT_METRICS, FOUNDED_YEAR } from "../data/impact";
import { getTeamMembers } from "../../axios/api/team";
import { TEAM_MEMBERS } from "../data/team";
import { JHubTeamMember } from "../types/team";
import styles from "../styles/About.module.css";

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
  loader: async () => {
    try {
      const apiTeam = await getTeamMembers();
      return { team: apiTeam.length > 0 ? apiTeam : TEAM_MEMBERS };
    } catch (e) {
      console.error("Failed to fetch team members:", e);
      return { team: TEAM_MEMBERS };
    }
  },
  component: AboutPage,
});

function AboutPage() {
  const { team: loaderTeam }: { team: JHubTeamMember[] } = Route.useLoaderData();
  const teamList = loaderTeam && loaderTeam.length > 0 ? loaderTeam : TEAM_MEMBERS;
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTeam = activeCategory === "ALL"
    ? teamList
    : teamList.filter((member) => member.category === activeCategory);

  return (
    <>
      <header className="page-header">
        <h1>
          About <span className={styles['about-header-span']}>JHUB Africa</span>
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

        <div className={styles['stats-bar']}>
          {IMPACT_METRICS.map((m) => (
            <div key={m.l} className={styles.stat}>
              <div className={styles['stat-n']}>{m.n}</div>
              <div className={styles['stat-l']}>{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-split">
        <div className="split-copy" style={{ maxWidth: "100%", flex: 1 }}>
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
      </section>

      {/* RESTRUCTURED MISSION, VISION AND CORE VALUES */}
      <section className="content-section" style={{ paddingTop: "2rem" }}>
        <div style={{ display: "grid", gap: "2rem", marginBottom: "3.5rem" }} className="diagonal-values-grid">
          {/* Cell 1: Top-Left (Vision) */}
          <div style={{ padding: "1.5rem 0", maxWidth: "480px" }} className="diagonal-vision-cell">
            <h3 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--jhub-blue)", lineHeight: "1.1", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span className="hover-underline-center" style={{ display: "inline-block", cursor: "pointer" }}>
                OUR<br />VISION
              </span>
            </h3>
            <div className="vision-mission-line" style={{ width: "80px", height: "4px", backgroundColor: "var(--jhub-green)", margin: "1.5rem 0", transition: "width 0.35s ease" }} />
            <p style={{ fontSize: "1.35rem", lineHeight: "1.6", color: "var(--text-main)", fontWeight: "500", margin: 0 }}>
              A one stop hub offering comprehensive array of digital solutions for societal needs.
            </p>
          </div>

          {/* Cell 2: Top-Right (Spacer on Desktop) */}
          <div className="diagonal-spacer-cell" />

          {/* Cell 3: Bottom-Left (Spacer on Desktop) */}
          <div className="diagonal-spacer-cell" />

          {/* Cell 4: Bottom-Right (Mission) */}
          <div style={{ padding: "1.5rem 0", maxWidth: "480px", marginLeft: "auto" }} className="diagonal-mission-cell">
            <h3 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--jhub-blue)", lineHeight: "1.1", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span className="hover-underline-center" style={{ display: "inline-block", cursor: "pointer" }}>
                OUR<br />MISSION
              </span>
            </h3>
            <div className="vision-mission-line" style={{ width: "80px", height: "4px", backgroundColor: "var(--jhub-green)", margin: "1.5rem 0", transition: "width 0.35s ease" }} />
            <p style={{ fontSize: "1.35rem", lineHeight: "1.6", color: "var(--text-main)", fontWeight: "500", margin: 0 }}>
              To drive sustainable digital transformation, providing accessible and impactful solutions for small and medium-scale farmers, traders and enterprises.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="section-eyebrow">Guiding Principles</div>
          <h2 className="section-h2" style={{ fontSize: "1.75rem" }}>Our Core Values</h2>
        </div>

        <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {[
            { title: "Adaptive Leadership", desc: "Leading with flexibility and foresight in a rapidly changing tech landscape." },
            { title: "Global Perspective", desc: "Cultivating solutions with international standards and local relevance." },
            { title: "Innovation & Entrepreneurship", desc: "Nurturing creative thinking and turning ideas into viable enterprises." },
            { title: "Customer Centricity", desc: "Placing end-user needs and societal impact at the heart of our tech." },
            { title: "Team Synergy", desc: "Harnessing the power of cross-disciplinary collaboration." },
            { title: "Transparency", desc: "Operating with openness, trust, and accountability." },
            { title: "Agility", desc: "Responding rapidly and efficiently to new challenges and learning cycles." },
            { title: "Responsibility", desc: "Exercising ethical stewardship over our innovations and community." },
            { title: "Sustainability", desc: "Designing long-term solutions that protect resources and build futures." }
          ].map((val) => (
            <div key={val.title} style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border-color)" }}>
              <h4 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--jhub-blue)", marginBottom: "0.5rem" }}>{val.title}</h4>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">The Faces Behind JHUB Africa</div>
        <h2 className="section-h2">Meet Our Team</h2>
        <p className="section-p">
          Our diverse team of experts, coordinators, developers, and advisors drive our mission to accelerate sustainable digital solutions across Africa.
        </p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem", marginTop: "1.5rem" }}>
          {[
            { key: "ALL", label: "All Team" },
            { key: "EXECUTIVE", label: "Executive" },
            { key: "ADVISORY_BOARD", label: "Advisory Board" },
            { key: "SECRETARIAT", label: "Secretariat" },
            { key: "DEV_TEAM", label: "Dev Team" },
            { key: "MENTORS", label: "Mentors" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className="btn-outline"
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.9rem",
                borderRadius: "30px",
                border: activeCategory === tab.key ? "2px solid var(--jhub-green)" : "1px solid var(--border-color)",
                backgroundColor: activeCategory === tab.key ? "var(--bg-soft)" : "transparent",
                color: activeCategory === tab.key ? "var(--jhub-blue)" : "var(--text-muted)",
                cursor: "pointer",
                fontWeight: activeCategory === tab.key ? "700" : "500",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "start" }}>
          {filteredTeam.map(member => {
            const isExpanded = expandedId === member.id;
            return (
              <article
                key={member.id}
                className={`${styles['team-card-borderless']} ${isExpanded ? styles['team-card-expanded'] : ''}`}
                onClick={() => setExpandedId(isExpanded ? null : member.id)}
              >
                <div className={styles['team-card-media']}>
                  <img
                    src={member.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"}
                    alt={member.name}
                    className={styles['team-card-img']}
                    loading="lazy"
                  />
                </div>
                <div className={styles['team-card-body']}>
                  <h3 className={styles['team-card-name']}>
                    <span className="hover-underline-center">{member.name}</span>
                  </h3>
                  <div className={styles['team-card-role']}>
                    {member.title}
                  </div>

                  {isExpanded && (
                    <div className={styles['team-card-bio-container']}>
                      <span className={styles['team-card-badge']}>
                        {member.category.replace(/_/g, " ")}
                      </span>
                      <p className={styles['team-card-bio-text']}>
                        {member.bio || "Team member at JHUB Africa driving sustainable digital innovation across Africa."}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    className={styles['team-card-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : member.id);
                    }}
                  >
                    {isExpanded ? (
                      <>Show Less <span style={{ fontSize: "1rem" }}>↑</span></>
                    ) : (
                      <>View Profile <span>→</span></>
                    )}
                  </button>
                </div>
              </article>
            );
          })}

          {filteredTeam.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-soft)", borderRadius: "12px", border: "1px dashed var(--border-color)", gridColumn: "1 / -1" }}>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>No team members found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Milestones</div>
        <h2 className="section-h2">Key moments in our journey</h2>
        <ul className={styles['flow-list']}>
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

      <section className="content-section" style={{ paddingTop: 0 }}>
        <div className={styles['cta-banner']}>
          <h2>Ready to Build the Future?</h2>
          <p>
            Whether you want to sponsor a project, volunteer your technical expertise,
            or establish a strategic partnership, our doors are open. Let's talk.
          </p>
          <Link
            to="/contact"
            className="btn-primary"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Contact the Team
          </Link>
        </div>
      </section>
    </>
  );
}