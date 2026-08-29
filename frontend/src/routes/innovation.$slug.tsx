import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Share2,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  Layers,
  TrendingUp,
  ShieldCheck,
  Users,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { getInnovationBySlug, getInnovations } from "../../axios/api/innovations";
import { InnovationItem } from "../types/innovations";
import ApplyDialog from "../components/site/ApplyDialog";
import jhubSvg from "../assets/svgs/4.svg";
import styles from "../styles/IndividualInnovation.module.css";

const STAGES = ["Concept", "Prototype", "Pilot", "Market entry", "Scale"] as const;

export const Route = createFileRoute("/innovation/$slug")({
  head: () => ({
    meta: [
      { title: "Innovation Details — JHUB Africa" },
      {
        name: "description",
        content: "Detailed breakdown of the innovation venture at JHUB Africa, JKUAT.",
      },
    ],
  }),
  loader: async ({ params }) => {
    try {
      const [innovation, allInnovations] = await Promise.all([
        getInnovationBySlug(params.slug),
        getInnovations().catch(() => []),
      ]);
      return { innovation, allInnovations };
    } catch (err) {
      console.warn("Failed to load innovation details for slug:", params.slug, err);
      return { innovation: null, allInnovations: [] };
    }
  },
  component: InnovationDetailPage,
});

function InnovationDetailPage() {
  const { innovation, allInnovations } = Route.useLoaderData() as {
    innovation: InnovationItem | null;
    allInnovations: InnovationItem[];
  };

  const [copied, setCopied] = useState(false);

  // Filter 3 related innovations from the same sector or general portfolio (excluding current)
  const relatedInnovations = allInnovations
    .filter((item) => item.slug !== innovation?.slug)
    .sort((a, b) => (a.sector === innovation?.sector ? -1 : 1))
    .slice(0, 3);

  if (!innovation) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 1.5rem" }}>
        <h2 style={{ fontSize: "2.4rem", color: "var(--jhub-blue)", marginBottom: "1rem", fontWeight: 800 }}>
          Innovation Project Not Found
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "560px", margin: "0 auto 2.5rem auto", lineHeight: 1.6 }}>
          The innovation project you are trying to view does not exist, has been archived, or there was a connection error.
        </p>
        <Link to="/innovation" className={styles['hero-back-link']} style={{ fontSize: "1.1rem", color: "var(--jhub-green)" }}>
          <ArrowLeft size={18} />
          <span>Back to Innovations Portfolio</span>
        </Link>
      </div>
    );
  }

  // Determine active stage index
  const currentStageIndex = STAGES.findIndex(
    (s) => s.toLowerCase() === (innovation.stage || "").toLowerCase()
  );
  const activeStageIdx = currentStageIndex >= 0 ? currentStageIndex : 0;

  // Render initials for team member profile circles
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Explore "${innovation.title}" on the JHUB Africa Innovation Portfolio:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out "${innovation.title}" incubated at JHUB Africa: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const projectUrl = innovation.website || innovation.projectLinks;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles['editorial-wrapper']}>
      {/* 1. IMMERSIVE HERO BANNER WITH SVG ON THE LEFT (NO BACKGROUND, NO BORDERS) */}
      <section className={styles['hero-editorial']}>
        <div className={styles['hero-mesh-overlay']} />
        
        <div className={styles['hero-inner']}>
          <Link to="/innovation" className={styles['hero-back-link']}>
            <ArrowLeft size={16} />
            <span>Back to Innovations Portfolio</span>
          </Link>

          <div className={styles['hero-split-grid']}>
            {/* Left: 4.svg Vector Asset (Clean, Borderless, Transparent) */}
            <div className={styles['hero-left-col']}>
              <div className={styles['hero-svg-frame']}>
                <img
                  src={jhubSvg}
                  alt="JHUB Africa Venture SVG"
                  className={styles['hero-svg-media']}
                />
              </div>
            </div>

            {/* Right: Venture Meta, Title, Tagline & CTAs */}
            <div className={styles['hero-right-col']}>
              <div className={styles['hero-meta-row']}>
                <span className={styles['sector-pill']}>
                  {innovation.sector}
                </span>

                <span className={styles['stage-pill']}>
                  <CheckCircle size={14} />
                  <span>Stage: {innovation.stage}</span>
                </span>

                <span className={styles['verified-pill']}>
                  <ShieldCheck size={14} color="#6ee7b7" />
                  <span>Verified by JHUB Secretariat</span>
                </span>
              </div>

              <h1 className={styles['hero-heading']}>{innovation.title}</h1>

              {innovation.tagline && (
                <p className={styles['hero-summary']} style={{ fontWeight: 600, color: "#e2e8f0" }}>
                  {innovation.tagline}
                </p>
              )}

              {innovation.description && (
                <p className={styles['hero-summary']}>
                  {innovation.description}
                </p>
              )}

              <div className={styles['hero-actions-row']}>
                <ApplyDialog
                  triggerText="Sponsor / Partner with this Venture"
                  triggerClassName={styles['hero-btn-primary']}
                  source={`Innovation: ${innovation.title}`}
                />

                {projectUrl && (
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['hero-btn-outline']}
                  >
                    <span>Visit Live Project / Demo</span>
                    <ExternalLink size={16} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={styles['hero-btn-outline']}
                  title="Copy Link"
                >
                  {copied ? <Check size={16} color="#6ee7b7" /> : <Copy size={16} />}
                  <span>{copied ? "Link Copied!" : "Share Venture"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY SUBHEADER ANCHOR BAR */}
      <nav className={styles['sticky-nav-bar']}>
        <div className={styles['sticky-nav-inner']}>
          <div className={styles['sticky-nav-links']}>
            <button
              type="button"
              onClick={() => scrollToSection("overview")}
              className={styles['nav-anchor-link']}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("story")}
              className={styles['nav-anchor-link']}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Challenge & Solution
            </button>
            {(innovation.traction || innovation.beneficiaries || innovation.impactEvidence) && (
              <button
                type="button"
                onClick={() => scrollToSection("impact")}
                className={styles['nav-anchor-link']}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Traction & Impact
              </button>
            )}
            {innovation.need && (
              <button
                type="button"
                onClick={() => scrollToSection("support")}
                className={styles['nav-anchor-link']}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Support Needs
              </button>
            )}
            <button
              type="button"
              onClick={() => scrollToSection("team")}
              className={styles['nav-anchor-link']}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Innovator Team
            </button>
          </div>

          <div className={styles['sticky-nav-cta']}>
            <button
              type="button"
              onClick={handleShareTwitter}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              title="Share on X"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              onClick={handleShareLinkedIn}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              title="Share on LinkedIn"
            >
              <ExternalLink size={16} />
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              title="Share on WhatsApp"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 3. EDITORIAL BODY CONTENT */}
      <main className={styles['editorial-container']}>
        {/* Showcase Media Frame */}
        <div id="overview" className={styles['showcase-media-frame']}>
          {innovation.coverImageUrl ? (
            <img
              src={innovation.coverImageUrl}
              alt={innovation.title}
              className={styles['showcase-img']}
            />
          ) : (
            <div style={{ height: "100%", width: "100%", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #07152b 0%, #0f2d59 50%, #064e3b 100%)" }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-editorial-cover" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#ffffff" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-editorial-cover)" />
              </svg>
              <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)", filter: "blur(12px)" }} />
              <div style={{ position: "absolute", bottom: "-30px", right: "-10px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(15, 45, 89, 0.6) 0%, rgba(15, 45, 89, 0) 70%)", filter: "blur(12px)" }} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "2.5rem", textAlign: "center" }}>
                <span style={{ color: "#ffffff", fontSize: "1.4rem", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(255, 255, 255, 0.08)", border: "none", borderRadius: "8px", padding: "8px 20px", backdropFilter: "blur(4px)", marginBottom: "1rem" }}>JHUB AFRICA</span>
                <h2 style={{ color: "#ffffff", fontSize: "1.75rem", margin: "0 0 0.5rem 0", fontWeight: 800 }}>
                  {innovation.title}
                </h2>
                <span style={{ fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.85)" }}>
                  {innovation.sector} · {innovation.stage}
                </span>
              </div>
            </div>
          )}

          <div className={styles['showcase-watermark']}>
            <ShieldCheck size={16} color="var(--jhub-green, #10b981)" />
            <span>JHUB Africa Incubated Project · Technology House, JKUAT</span>
          </div>
        </div>

        {/* Lifecycle Stepper Strip */}
        <section className={styles['stepper-strip']}>
          <div className={styles['stepper-strip-header']}>
            <span>Venture Incubation Lifecycle</span>
            <span style={{ color: "var(--jhub-green, #10b981)", fontWeight: 700 }}>
              Current Milestone: {innovation.stage}
            </span>
          </div>

          <div className={styles['stepper-track']}>
            {STAGES.map((s, idx) => {
              const isCompleted = idx < activeStageIdx;
              const isActive = idx === activeStageIdx;
              return (
                <div
                  key={s}
                  className={`${styles['stepper-step']} ${
                    isActive
                      ? styles['step-active']
                      : isCompleted
                      ? styles['step-completed']
                      : ""
                  }`}
                >
                  <div className={styles['stepper-bar']} />
                  <span className={styles['step-title']}>{s}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Editorial Story Section: 2-Column Split */}
        <section id="story" className={styles['editorial-story-section']}>
          {/* Left: The Challenge */}
          <div className={styles['story-col']}>
            <div className={`${styles['story-tag']} ${styles['story-tag-challenge']}`}>
              <AlertTriangle size={16} />
              <span>The Challenge</span>
            </div>
            <h3 className={styles['story-title']}>What problem does this address?</h3>
            <p className={styles['story-body']}>{innovation.problem}</p>
          </div>

          {/* Right: The Innovation */}
          <div className={styles['story-col']}>
            <div className={`${styles['story-tag']} ${styles['story-tag-solution']}`}>
              <Lightbulb size={16} />
              <span>The Solution</span>
            </div>
            <h3 className={styles['story-title']}>How is this challenge solved?</h3>
            <p className={styles['story-body']}>{innovation.solution}</p>
          </div>
        </section>

        {/* Prominent Metrics & Traction Strip */}
        {(innovation.traction || innovation.beneficiaries || innovation.impactEvidence) && (
          <section id="impact" className={styles['metrics-strip-section']}>
            <h3 className={styles['metrics-section-title']}>Traction & Impact Evidence</h3>
            <div className={styles['metrics-grid']}>
              {innovation.beneficiaries && (
                <div className={styles['metric-box']}>
                  <span className={styles['metric-label']}>Target Beneficiaries</span>
                  <div className={styles['metric-value']}>{innovation.beneficiaries}</div>
                </div>
              )}

              {innovation.traction && (
                <div className={styles['metric-box']}>
                  <span className={styles['metric-label']}>Milestones & Progress</span>
                  <div className={styles['metric-value']}>{innovation.traction}</div>
                </div>
              )}

              {innovation.impactEvidence && (
                <div className={styles['metric-box']}>
                  <span className={styles['metric-label']}>Validation & Evidence</span>
                  <div className={styles['metric-value']}>{innovation.impactEvidence}</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Support & Resource Requirements Section */}
        {innovation.need && (
          <section id="support" className={styles['support-section']}>
            <span className={styles['section-eyebrow']}>
              Resource & Collaboration Needs
            </span>
            <h3 className={styles['support-title']}>Support Requirements</h3>
            <p style={{ margin: "0", color: "#475569", lineHeight: 1.7, fontSize: "1.05rem" }}>
              The team is actively seeking strategic partnerships, investment, and ecosystem resources to accelerate growth:
            </p>

            <div className={styles['support-pills-row']}>
              {innovation.need
                .split(/[,;\n]+/)
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item, idx) => (
                  <span key={idx} className={styles['support-clean-pill']}>
                    {item}
                  </span>
                ))}
            </div>
          </section>
        )}

        {/* Innovators & Development Team */}
        <section id="team" className={styles['team-editorial-section']}>
          <span className={styles['section-eyebrow']} style={{ color: "#7c3aed" }}>
            Ecosystem Attribution
          </span>
          <h3 className={styles['support-title']}>Innovators & Development Team</h3>

          {!innovation.teamMembers || innovation.teamMembers.length === 0 ? (
            <div className={styles['team-empty-box']}>
              💼 Team profiles and research attribution are maintained under the JHUB Africa Innovation Registry. For direct founder inquiries, connect via the JHUB desk.
            </div>
          ) : (
            <div className={styles['team-grid-editorial']}>
              {innovation.teamMembers.map((m, idx) => {
                const avatarColors = [
                  { bg: "#dbeafe", color: "#1e40af" },
                  { bg: "#dcfce7", color: "#166534" },
                  { bg: "#f3e8ff", color: "#6b21a8" },
                  { bg: "#ffedd5", color: "#c2410c" },
                ];
                const c = avatarColors[idx % avatarColors.length];

                return (
                  <div key={idx} className={styles['team-card-editorial']}>
                    <div
                      className={styles['team-avatar-editorial']}
                      style={{ backgroundColor: c.bg, color: c.color }}
                    >
                      {getInitials(m.name)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0 }}>
                      <strong className={styles['team-name-editorial']}>{m.name}</strong>
                      <span className={styles['team-role-editorial']}>{m.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Editorial Partnership CTA Banner */}
        <section className={styles['editorial-cta-banner']}>
          <h3 className={styles['editorial-cta-title']}>
            Partner With or Sponsor {innovation.title}
          </h3>
          <p className={styles['editorial-cta-desc']}>
            Connect directly with this venture through JHUB Africa to provide pilot testbeds, grant capital, technical mentorship, or market access.
          </p>

          <div className={styles['editorial-cta-actions']}>
            <ApplyDialog
              triggerText="Sponsor this Innovation"
              triggerClassName={styles['hero-btn-primary']}
              source={`Innovation: ${innovation.title}`}
            />

            <Link to="/contact" className={styles['hero-btn-outline']}>
              <MessageSquare size={16} />
              <span>Contact Innovation Desk</span>
            </Link>
          </div>
        </section>

        {/* Related Innovations Section */}
        {relatedInnovations.length > 0 && (
          <section className={styles['related-editorial-section']}>
            <h2 className={styles['related-editorial-heading']}>
              More Innovations to Explore
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: "0 0 2rem 0" }}>
              Discover other high-impact ventures incubated at JHUB Africa.
            </p>

            <div className="cards-grid" style={{ gap: "2.5rem 2rem" }}>
              {relatedInnovations.map((item) => (
                <Link
                  key={item.id}
                  to={`/innovation/${item.slug}`}
                  className="innovation-card-borderless"
                >
                  <div className="innovation-media-wrap">
                    {item.coverImageUrl ? (
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                      />
                    ) : (
                      <div style={{ height: "100%", width: "100%", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #07152b 0%, #0f2d59 50%, #064e3b 100%)" }}>
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`grid-related-${item.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                              <circle cx="2" cy="2" r="1" fill="#ffffff" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#grid-related-${item.id})`} />
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
                    {item.sector} · {item.stage}
                  </div>
                  <div className="prog-title hover-underline-center" style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: "700", lineHeight: "1.3", marginBottom: "0.4rem" }}>
                    {item.title}
                  </div>
                  <p className="prog-desc" style={{ flexGrow: 1, margin: "0 0 1.25rem 0", fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: "1.55" }}>
                    {item.description || item.solution || item.problem}
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "0.25rem" }}>
                    <span className="prog-arrow" style={{ fontSize: "0.88rem" }}>
                      View Project →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
