import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ContactModal } from "../components/site/ContactModal";
import EditorialHero from "../components/site/EditorialHero";
import heroStyles from "../styles/EditorialHero.module.css";
import { Users, Zap, BookOpen, UserCheck, Award, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/for-students")({
  head: () => ({
    meta: [
      { title: "For Students — JHUB Africa" },
      {
        name: "description",
        content:
          "Innovation club, courses, hackathons, workshops and volunteering for students at JHUB Africa.",
      },
      { property: "og:title", content: "For Students — JHUB Africa" },
      {
        property: "og:description",
        content: "Join a community of builders at JHUB Africa.",
      },
    ],
  }),
  component: ForStudentsPage,
});

interface StudentTrack {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accentColor: string;
  badge: string;
  highlights: string[];
  ctaText: string;
  ctaType: "modal" | "link";
  ctaTo?: string;
}

const STUDENT_TRACKS: StudentTrack[] = [
  {
    id: "innovation-club",
    eyebrow: "WEEKLY SPRINT & CO-WORKING",
    title: "Campus Innovation Club",
    desc: "Weekly build sessions, peer code reviews, maker space hardware access, and rapid prototyping sprints right on campus. Collaborate with cross-disciplinary students from engineering, computing, business, and agriculture.",
    icon: <Users size={24} color="#10b981" />,
    accentColor: "#10b981",
    badge: "WEEKLY MEETUPS",
    highlights: [
      "Weekly Maker Sprints & Code Sessions",
      "Hardware & Embedded IoT Lab Access",
      "Peer Feedback Circles & Product Teardowns",
      "Interdisciplinary Team Formation",
    ],
    ctaText: "Join the Club",
    ctaType: "modal",
  },
  {
    id: "hackathons",
    eyebrow: "INTENSIVE SPRINT & GRANTS",
    title: "Applied Hackathons & Challenges",
    desc: "Short, high-intensity sprints tackling real-world problem statements submitted by industry partners and NGOs. Win seed prototyping grants, fast-track incubator slots, and regional ecosystem recognition.",
    icon: <Zap size={24} color="#3b82f6" />,
    accentColor: "#3b82f6",
    badge: "GRANTS & PRIZES",
    highlights: [
      "Industry-Sponsored Challenge Statements",
      "Prototype Grants & Seed Funding",
      "Demo Day Showcases with Evaluators",
      "Direct Fast-Track to JHUB Incubation",
    ],
    ctaText: "View Upcoming Hackathons →",
    ctaType: "link",
    ctaTo: "/events",
  },
  {
    id: "workshops",
    eyebrow: "PRACTICAL UPSKILLING",
    title: "Technical Workshops & Bootcamps",
    desc: "Deep-dive masterclasses in Artificial Intelligence, Cloud Architecture, Embedded Systems, Product Design, and Venture Building led by experienced industry practitioners and university faculty.",
    icon: <BookOpen size={24} color="#8b5cf6" />,
    accentColor: "#8b5cf6",
    badge: "HANDS-ON LABS",
    highlights: [
      "Practical Hands-on Code & Hardware Labs",
      "Industry Best-Practice Toolkits & Frameworks",
      "Cohort Learning & Guided Mentorship",
      "Certificate of Completion Endorsed by JKUAT",
    ],
    ctaText: "Explore Courses & Modules →",
    ctaType: "link",
    ctaTo: "/courses",
  },
  {
    id: "mentorship",
    eyebrow: "1:1 GUIDANCE",
    title: "Founder & Engineering Mentorship",
    desc: "Get paired 1:1 with alumni founders, senior software engineers, patent attorneys, and venture mentors who help you navigate technical hurdles, intellectual property, and product-market validation.",
    icon: <UserCheck size={24} color="#f59e0b" />,
    accentColor: "#f59e0b",
    badge: "1:1 COACHING",
    highlights: [
      "Bi-Weekly 1:1 Technical & Venture Coaching",
      "Architecture & Tech Stack Review",
      "Intellectual Property & Patent Guidance",
      "Pitch Deck & Demo Preparation",
    ],
    ctaText: "Request Mentorship",
    ctaType: "modal",
  },
  {
    id: "volunteering",
    eyebrow: "COMMUNITY LEADERSHIP",
    title: "Campus Ambassadors & Volunteering",
    desc: "Take on leadership roles organizing hackathons, managing club chapters, leading peer workshops, and supporting ecosystem demo days. Earn accredited leadership certificates and ecosystem credits.",
    icon: <Award size={24} color="#06b6d4" />,
    accentColor: "#06b6d4",
    badge: "LEADERSHIP PATHWAY",
    highlights: [
      "Hands-on Tech Event Operations Experience",
      "JKUAT-Endorsed Leadership Credentials",
      "Direct Networking with Tech Executives & Speakers",
      "Ambassador Community Perks & Recognition",
    ],
    ctaText: "Apply as Ambassador",
    ctaType: "modal",
  },
  {
    id: "student-stories",
    eyebrow: "VENTURE PATHWAYS",
    title: "From Dorm Idea to Deployed Pilot",
    desc: "Discover how JHUB student teams transformed classroom projects and dorm ideas into funded prototypes and live commercial pilots across Kenya and East Africa.",
    icon: <Sparkles size={24} color="#ec4899" />,
    accentColor: "#ec4899",
    badge: "VENTURE PIPELINE",
    highlights: [
      "50+ Student Prototypes Built to Date",
      "12 Live Commercial Deployments",
      "Investor & Partner Introduction Support",
      "Continuous Incubation & Advisory Support",
    ],
    ctaText: "Explore Innovations Portfolio →",
    ctaType: "link",
    ctaTo: "/innovation",
  },
];

function ForStudentsPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <EditorialHero
        themeVariant="default"
        badges={[
          { label: "BUILDERS COMMUNITY", variant: "sector" },
          { label: "CAMPUS CLUBS", variant: "stage" },
          { label: "APPLIED HACKATHONS", variant: "verified" },
        ]}
        title={
          <>
            For <span style={{ color: "#6ee7b7" }}>Students</span>
          </>
        }
        description="Join a thriving community of builders, attend hands-on workshops, access technical courses, and build real-world innovations from campus."
        actions={
          <>
            <Link to="/courses" className={heroStyles.btnPrimary}>
              Explore courses
            </Link>
            <button
              className={heroStyles.btnOutline}
              onClick={() => setIsContactModalOpen(true)}
            >
              Join the club
            </button>
          </>
        }
      />

      <section className="content-section" style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "5rem" }}>
        {STUDENT_TRACKS.map((track, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={track.id}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2.5rem",
                alignItems: "center",
                padding: "2.5rem 2rem",
                borderRadius: "18px",
                background: isEven ? "var(--bg-soft, #f8fafc)" : "#ffffff",
                border: "none",
              }}
            >
              {/* Left Column: Narrative Details */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: isEven ? "#ffffff" : "var(--bg-soft, #f8fafc)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                    }}
                  >
                    {track.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: track.accentColor,
                      background: `${track.accentColor}18`,
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                    }}
                  >
                    {track.badge}
                  </span>
                </div>

                <div className="section-eyebrow" style={{ color: track.accentColor, marginBottom: "0.35rem" }}>
                  {track.eyebrow}
                </div>

                <h2 style={{ fontSize: "1.65rem", fontWeight: 800, color: "var(--jhub-blue, #07152b)", margin: "0 0 1rem 0", lineHeight: 1.25 }}>
                  {track.title}
                </h2>

                <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-muted, #475569)", margin: "0 0 1.75rem 0" }}>
                  {track.desc}
                </p>

                {track.ctaType === "modal" ? (
                  <button
                    className="btn-primary"
                    onClick={() => setIsContactModalOpen(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      background: track.accentColor,
                      borderColor: track.accentColor,
                      cursor: "pointer",
                    }}
                  >
                    {track.ctaText}
                  </button>
                ) : (
                  <Link
                    to={track.ctaTo || "/"}
                    className="btn-outline"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      borderColor: track.accentColor,
                      color: "var(--jhub-blue, #07152b)",
                      textDecoration: "none",
                    }}
                  >
                    {track.ctaText}
                  </Link>
                )}
              </div>

              {/* Right Column: Highlights Card */}
              <div
                style={{
                  background: isEven ? "#ffffff" : "var(--bg-soft, #f8fafc)",
                  borderRadius: "14px",
                  padding: "1.75rem",
                  border: "none",
                }}
              >
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--jhub-blue, #07152b)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
                  Key Program Highlights
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {track.highlights.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <CheckCircle2 size={18} color={track.accentColor} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "0.92rem", color: "var(--text-main, #1e293b)", fontWeight: 500, lineHeight: 1.5 }}>
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source="For Students Page"
      />
    </>
  );
}
