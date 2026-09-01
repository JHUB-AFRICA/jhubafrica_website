import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import ApplyDialog from "../components/site/ApplyDialog";
import { getPublicCourses } from "../../axios/api/courses";
import { CourseItem } from "../types/courses";
import SkeletonCards from "../components/site/SkeletonCards";
import ResourceFallback from "../components/site/ResourceFallback";
import EditorialHero from "../components/site/EditorialHero";
import heroStyles from "../styles/EditorialHero.module.css";
import {
  CreditCard,
  Users2,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  Network,
  Cpu,
  Rocket,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import inukaImg from "../assets/inuka-hero-image.png";
import samsungImg from "../assets/samsung.png";

export const Route = createFileRoute("/courses")({
  head: (ctx: { loaderData?: CourseItem[] }) => {
    const courses = ctx.loaderData || [];
    const validCourses = courses.filter(c => c && c.title && c.desc);

    const coursesSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "numberOfItems": validCourses.length,
      "itemListElement": validCourses.map((c: CourseItem, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Course",
          "name": c.title,
          "description": c.desc,
          "provider": {
            "@type": "Organization",
            "name": "JHUB Africa",
            "url": "https://jhubafrica.com"
          },
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": c.deliveryMode === "ONLINE" ? "Online" : c.deliveryMode === "IN_PERSON" ? "In-Person" : "Hybrid",
            "duration": c.durationWeeks ? `P${c.durationWeeks}W` : "P6W",
            "courseWorkload": "Part-Time"
          }
        }
      }))
    };

    return {
      meta: [
        { title: "Courses — JHUB Africa" },
        {
          name: "description",
          content:
            "Industry-aligned short courses in software, data, design and emerging technologies.",
        },
        { property: "og:title", content: "Courses — JHUB Africa" },
        {
          property: "og:description",
          content: "Skills programs designed for the African job market.",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(coursesSchema)
        }
      ]
    };
  },
  loader: () => getPublicCourses(),
  component: CoursesPage,
  errorComponent: ({ error, reset }) => (
    <>
      <EditorialHero
        themeVariant="emerald"
        badges={[
          { label: "INSTRUCTOR-LED", variant: "sector" },
          { label: "INDUSTRY-ALIGNED", variant: "stage" },
          { label: "COHORT-BASED", variant: "verified" },
        ]}
        title={
          <>
            Our <span style={{ color: "#6ee7b7" }}>Courses</span>
          </>
        }
        description="Practical, instructor-led programs designed with industry partners. Cohort-based, with no upfront payment for accepted learners on subsidised tracks."
      />
      <section className="content-section">
        <ResourceFallback error={error} onRetry={reset} resourceName="Courses" />
      </section>
    </>
  ),
  pendingComponent: () => (
    <>
      <EditorialHero
        themeVariant="emerald"
        badges={[
          { label: "INSTRUCTOR-LED", variant: "sector" },
          { label: "INDUSTRY-ALIGNED", variant: "stage" },
          { label: "COHORT-BASED", variant: "verified" },
        ]}
        title={
          <>
            Our <span style={{ color: "#6ee7b7" }}>Courses</span>
          </>
        }
        description="Practical, instructor-led programs designed with industry partners. Cohort-based, with no upfront payment for accepted learners on subsidised tracks."
      />

      <section className="content-section">
        <SkeletonCards count={3} />
      </section>
    </>
  ),
});

const CATEGORIES = ["All", "Software", "Data", "Emerging Tech"] as const;

const FLAGSHIP_PROGRAMS = [
  {
    id: "inuka",
    title: "Inuka Digital Leap",
    eyebrow: "DIGITAL INFRASTRUCTURE TALENT",
    tagline: "Building Kenya's Digital Infrastructure Talent Pipeline",
    description:
      "A transformative partnership between JKUAT, Kenya Pipeline Company (KPC) Foundation, and JHUB Africa bridging Kenya's broadband skills gap through intensive hands-on fibre optics, network infrastructure, broadband deployment, and direct employment pathways.",
    url: "https://inukadigitalleap.jhubafrica.com/",
    image: inukaImg,
    accentColor: "var(--jhub-green, #10b981)",
    tagBg: "rgba(16, 185, 129, 0.12)",
    highlights: [
      "Fibre Optics Splicing & Optical Network Testing",
      "Enterprise Routing, Switching & Network Engineering",
      "Broadband Infrastructure & Last-Mile Deployment",
      "Direct Industry Apprenticeships & Job Placement",
    ],
    partner: "JKUAT & Kenya Pipeline Company (KPC) Foundation",
    ctaText: "Explore Inuka Portal",
    icon: <Network size={26} color="#10b981" />,
  },
  {
    id: "sic",
    title: "Samsung Innovation Campus (SIC)",
    eyebrow: "GLOBAL 4IR TECH ACADEMY",
    tagline: "AI, IoT & Coding Skills for Future Innovators",
    description:
      "Empowering young Africans with core Fourth Industrial Revolution competencies including Artificial Intelligence (AI), Internet of Things (IoT), Big Data analytics, and Python programming with direct industry mentorship and globally accredited Samsung certificates.",
    url: "https://sic.jhubafrica.com/",
    image: samsungImg,
    accentColor: "#3b82f6",
    tagBg: "rgba(59, 130, 246, 0.12)",
    highlights: [
      "Applied Artificial Intelligence (AI) & Machine Learning",
      "Internet of Things (IoT) Microcontrollers & Sensors",
      "Big Data Analysis & Python Programming",
      "Globally Endorsed Samsung Professional Certificate",
    ],
    partner: "Samsung Electronics & JKUAT",
    ctaText: "Explore Samsung Campus",
    icon: <Cpu size={26} color="#3b82f6" />,
  },
];

function CoursesPage() {
  const courses = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return courses.filter((c: CourseItem) => {
      const matchQ =
        q.trim() === "" ||
        `${c.title} ${c.desc}`.toLowerCase().includes(q.toLowerCase());
      const matchCategory = category === "All" || c.tag === category;
      return matchQ && matchCategory;
    });
  }, [courses, q, category]);

  return (
    <>
      <EditorialHero
        themeVariant="emerald"
        badges={[
          { label: "INSTRUCTOR-LED", variant: "sector" },
          { label: "INDUSTRY-ALIGNED", variant: "stage" },
          { label: "COHORT-BASED", variant: "verified" },
        ]}
        title={
          <>
            Our <span style={{ color: "#6ee7b7" }}>Courses</span>
          </>
        }
        description="Practical, instructor-led programs designed with industry partners. Cohort-based, with no upfront payment for accepted learners on subsidised tracks."
      />

      {/* Flagship Programs & Specialized Academies */}
      <section className="content-section" style={{ paddingBottom: "1.5rem" }}>
        <div className="section-eyebrow">Featured Academies &amp; Programs</div>
        <h2 className="section-h2" style={{ marginBottom: "0.75rem" }}>
          Flagship Programs &amp; Specialized Academies
        </h2>
        <p className="section-p" style={{ marginBottom: "2.5rem" }}>
          Explore our specialized industry-partnered academies and digital infrastructure talent pipelines with dedicated portals, hands-on labs, and global credentials.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {FLAGSHIP_PROGRAMS.map((prog, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={prog.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "22px",
                  background: isEven ? "var(--bg-soft, #f8fafc)" : "#ffffff",
                  border: "none",
                  overflow: "hidden",
                }}
              >
                {/* Media Image Banner */}
                <div
                  style={{
                    width: "100%",
                    height: "230px",
                    overflow: "hidden",
                    backgroundColor: "#0f172a",
                    position: "relative",
                  }}
                >
                  <img
                    src={prog.image}
                    alt={prog.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Card Content */}
                <div style={{ padding: "2.25rem 2rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  {/* Header Icon + Eyebrow */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "12px",
                        background: isEven ? "#ffffff" : "var(--bg-soft, #f8fafc)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {prog.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: prog.accentColor,
                        background: prog.tagBg,
                        padding: "0.35rem 0.85rem",
                        borderRadius: "999px",
                      }}
                    >
                      {prog.eyebrow}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 style={{ fontSize: "1.55rem", fontWeight: 800, color: "var(--jhub-blue, #07152b)", margin: "0 0 0.5rem 0", lineHeight: 1.25 }}>
                    {prog.title}
                  </h3>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: prog.accentColor, marginBottom: "1.1rem", lineHeight: 1.4 }}>
                    {prog.tagline}
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: "0.98rem", lineHeight: 1.7, color: "var(--text-muted, #475569)", margin: "0 0 1.75rem 0" }}>
                    {prog.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.75rem", marginTop: "auto" }}>
                    {prog.highlights.map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                        <CheckCircle2 size={17} color={prog.accentColor} style={{ flexShrink: 0, marginTop: "3px" }} />
                        <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500, lineHeight: 1.4 }}>
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Partner Attribution */}
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted, #64748b)",
                      borderTop: isEven ? "1px solid rgba(0,0,0,0.06)" : "1px solid var(--border-color, #e2e8f0)",
                      paddingTop: "1.1rem",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span>Partner:</span>
                    <strong style={{ color: "var(--jhub-blue, #07152b)" }}>{prog.partner}</strong>
                  </div>

                  {/* Action Button */}
                  <a
                    href={prog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.9rem 1.4rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      background: prog.accentColor,
                      borderColor: prog.accentColor,
                    }}
                  >
                    <span>{prog.ctaText}</span>
                    <ExternalLink size={17} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider to Short Courses Catalog */}
        <div style={{ borderTop: "1px solid var(--border-color, #e2e8f0)", paddingTop: "3rem", marginTop: "1rem" }}>
          <div className="section-eyebrow">Skills Catalog</div>
          <h2 className="section-h2" style={{ marginBottom: "1.25rem" }}>
            Short Courses &amp; Modules
          </h2>
        </div>
      </section>

      <section className="content-section" style={{ paddingTop: "0.5rem" }}>
        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search courses..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="filter-input"
            aria-label="Search courses"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-meta">
          Showing {filtered.length} of {courses.length} courses
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state-card" style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", background: "var(--bg-soft)" }}>
            <span style={{ fontSize: "2.2rem" }}>🎓</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--jhub-blue)", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
              No Courses Found
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
              We couldn't find any courses matching your search criteria. Try modifying your search keywords or choosing a different category.
            </p>
            <button
              onClick={() => {
                setQ("");
                setCategory("All");
              }}
              className="btn-outline"
              style={{ fontSize: "0.85rem", padding: "10px 24px" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.map((c: CourseItem) => (
              <div key={c.id} className="prog-card">
                <span className={`prog-tag prog-tag-${c.color}`}>
                  {c.tag}
                </span>
                <div className={`prog-title ${c.titleColor ?? ""}`} style={{ marginTop: "0.5rem" }}>
                  {c.title}
                </div>
                <p className="prog-desc">{c.desc}</p>
                <div className="quick-facts">
                  <span className="qf-pill">
                    <strong>Duration</strong> {c.duration}
                  </span>
                  <span className="qf-pill">
                    <strong>Mode</strong> {c.mode}
                  </span>
                  <span className="qf-pill">
                    <strong>Level</strong> {c.level}
                  </span>
                  <span
                    className={`qf-pill ${c.cohort === "Open" ? "qf-open" : "qf-wait"}`}
                  >
                    <strong>Cohort</strong> {c.cohort}
                  </span>
                </div>
                <div className="prog-meta">
                  <span className="prog-slots">{c.cert}</span>
                  <ApplyDialog
                    triggerText="Join waitlist →"
                    triggerVariant="ghost"
                    triggerClassName="prog-arrow"
                    source={c.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "4.5rem" }}>
          <div className="section-eyebrow">Course Guidelines &amp; FAQs</div>
          <h2 className="section-h2" style={{ marginBottom: "2.5rem" }}>Before You Apply</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
            {/* Section 1: Upfront Cost & Subsidies */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                alignItems: "center",
                padding: "2.25rem 2rem",
                borderRadius: "18px",
                background: "var(--bg-soft, #f8fafc)",
                border: "none",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CreditCard size={22} color="#10b981" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#10b981",
                      background: "rgba(16, 185, 129, 0.1)",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                    }}
                  >
                    TUITION &amp; SUBSIDY
                  </span>
                </div>
                <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--jhub-blue, #07152b)", margin: "0 0 0.75rem 0" }}>
                  Is there an upfront cost?
                </h3>
                <p style={{ fontSize: "0.98rem", lineHeight: 1.7, color: "var(--text-muted, #475569)", margin: 0 }}>
                  Subsidised technical tracks have zero upfront payment for accepted learners thanks to donor and partner sponsorships. Some specialized advanced certifications require tuition fees, which are clearly disclosed prior to admission.
                </p>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    100% Subsidised seats for eligible student builders
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Transparent fee breakdown on premium professional tracks
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Flexible installment schedules for certified cohorts
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Minimum Cohort Sizes */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                alignItems: "center",
                padding: "2.25rem 2rem",
                borderRadius: "18px",
                background: "#ffffff",
                border: "none",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "rgba(59, 130, 246, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Users2 size={22} color="#3b82f6" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#3b82f6",
                      background: "rgba(59, 130, 246, 0.1)",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                    }}
                  >
                    COHORT SIZING
                  </span>
                </div>
                <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--jhub-blue, #07152b)", margin: "0 0 0.75rem 0" }}>
                  Is there a minimum cohort size?
                </h3>
                <p style={{ fontSize: "0.98rem", lineHeight: 1.7, color: "var(--text-muted, #475569)", margin: 0 }}>
                  Each course runs once a minimum cohort threshold is met to ensure engaging discussions, peer reviews, and hands-on lab collaboration. Once accepted, we confirm your seat immediately or offer priority rolling placement in the next intake.
                </p>
              </div>
              <div
                style={{
                  background: "var(--bg-soft, #f8fafc)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Small, collaborative squads with high mentor access
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Automated waitlist notifications on cohort confirmation
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Flexible transfer options across related technical modules
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Certification & Recognition */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                alignItems: "center",
                padding: "2.25rem 2rem",
                borderRadius: "18px",
                background: "var(--bg-soft, #f8fafc)",
                border: "none",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: "rgba(239, 68, 68, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GraduationCap size={22} color="#ef4444" />
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#ef4444",
                      background: "rgba(239, 68, 68, 0.1)",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                    }}
                  >
                    CREDENTIALS
                  </span>
                </div>
                <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--jhub-blue, #07152b)", margin: "0 0 0.75rem 0" }}>
                  What certification do I get?
                </h3>
                <p style={{ fontSize: "0.98rem", lineHeight: 1.7, color: "var(--text-muted, #475569)", margin: 0 }}>
                  Learners who complete practical assessments, capstone projects, and attendance milestones receive an official JHUB Africa Certificate of Completion endorsed by JKUAT, verifiable online by employers and academic institutions.
                </p>
              </div>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Official Certificate of Completion endorsed by JKUAT
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Digital credential shareable on LinkedIn and portfolios
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <CheckCircle2 size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500 }}>
                    Portfolio-ready capstone code repository and demo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}