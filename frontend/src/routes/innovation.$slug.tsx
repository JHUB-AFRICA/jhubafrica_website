import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { getInnovationBySlug, getFeaturedInnovations } from "../../axios/api/innovations";
import { InnovationItem } from "../types/innovations";
import ApplyDialog from "../components/site/ApplyDialog";
import EditorialHero from "../components/site/EditorialHero";
import smartNyukiBeeImg from "../assets/images/smart-nyuki-1.jpg";
import heroStyles from "../styles/EditorialHero.module.css";
import styles from "../styles/IndividualInnovation.module.css";
import { InnovationMediaPlaceholder } from "../components/site/InnovationMediaPlaceholder";
import { InnovationStageTimeline } from "../components/site/InnovationStageTimeline";
import { InnovationTeamSection } from "../components/site/InnovationTeamSection";
import { InnovationStickyNav } from "../components/site/InnovationStickyNav";

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
        getFeaturedInnovations().catch(() => []),
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
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const rawProjectUrl = (innovation.website || innovation.projectLinks || "").trim();
  const projectUrl = rawProjectUrl
    ? /^https?:\/\//i.test(rawProjectUrl)
      ? rawProjectUrl
      : `https://${rawProjectUrl}`
    : null;

  const isSmartNyuki =
    innovation.slug === "smart-nyuki" ||
    /smart[-_ ]?nyuki/i.test(innovation.title) ||
    /nyuki/i.test(innovation.slug);

  const heroImageSrc = isSmartNyuki
    ? (innovation.coverImageUrl &&
       !innovation.coverImageUrl.includes(".svg") &&
       !innovation.coverImageUrl.endsWith("smart-nyuki.jpg")
        ? innovation.coverImageUrl
        : smartNyukiBeeImg)
    : (innovation.coverImageUrl || smartNyukiBeeImg);

  return (
    <div className={styles['editorial-wrapper']}>
      {/* 1. REUSABLE IMMERSIVE HERO BANNER */}
      <EditorialHero
        layoutVariant="overlap"
        backLink={{
          to: "/innovation",
          label: "Back to Innovations Portfolio",
        }}
        media={
          <img
            src={heroImageSrc}
            srcSet={`${heroImageSrc} 540w`}
            sizes="(max-width: 900px) 100vw, (max-width: 1240px) 45vw, 558px"
            alt={innovation.title}
            className={heroStyles.heroOverlapImage}
            loading="eager"
            decoding="async"
            onError={(e) => {
              if (e.currentTarget.src !== smartNyukiBeeImg) {
                e.currentTarget.src = smartNyukiBeeImg;
              }
            }}
          />
        }
        mediaPosition="left"
        badges={[
          { label: innovation.sector, variant: "sector" },
          {
            label: `Stage: ${innovation.stage}`,
            variant: "stage",
            icon: <CheckCircle size={14} />,
          },
          {
            label: "Verified by JHUB Secretariat",
            variant: "verified",
            icon: <ShieldCheck size={14} color="#6ee7b7" />,
          },
        ]}
        title={innovation.title}
        tagline={innovation.tagline}
        description={innovation.description}
        actions={
          <>
            <ApplyDialog
              triggerText="Sponsor / Partner with this Venture"
              triggerClassName={heroStyles.btnPrimary}
              source={`Innovation: ${innovation.title}`}
            />

            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={heroStyles.btnOutline}
                title="Open Innovation Webpage in a new tab"
              >
                <span>Visit Webpage</span>
                <ExternalLink size={16} />
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className={heroStyles.btnOutline}
              title="Copy Link"
            >
              {copied ? <Check size={16} color="#6ee7b7" /> : <Copy size={16} />}
              <span>{copied ? "Link Copied!" : "Share Venture"}</span>
            </button>
          </>
        }
      />

      {/* 2. STICKY SUBHEADER ANCHOR BAR */}
      <InnovationStickyNav innovation={innovation} />

      {/* 3. EDITORIAL BODY CONTENT */}
      <main className={styles['editorial-container']}>
        {/* Venture Incubation Lifecycle (Overview Anchor) */}
        <InnovationStageTimeline id="overview" currentStage={innovation.stage} />

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
                .map((item) => (
                  <span key={item} className={styles['support-clean-pill']}>
                    {item}
                  </span>
                ))}
            </div>
          </section>
        )}

        {/* Innovators & Development Team */}
        <InnovationTeamSection teamMembers={innovation.teamMembers} />

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
              triggerClassName={styles['cta-btn-primary']}
              source={`Innovation: ${innovation.title}`}
            />

            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['cta-btn-outline']}
                title="Open Innovation Webpage in a new tab"
              >
                <ExternalLink size={16} />
                <span>Visit Webpage</span>
              </a>
            )}

            <Link to="/contact" className={styles['cta-btn-outline']}>
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
                      <InnovationMediaPlaceholder id={item.id} />
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
