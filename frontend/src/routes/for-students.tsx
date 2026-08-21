import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ContactModal } from "../components/site/ContactModal";

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

const OPPS = [
  {
    t: "Innovation Club",
    d: "Weekly build sessions, peer feedback and project sprints on campus.",
    color: "green" as const,
  },
  {
    t: "Hackathons",
    d: "Short intensive sprints tackling real challenges from JHUB partners.",
    color: "" as const,
  },
  {
    t: "Workshops",
    d: "Hands-on sessions in AI, product design, entrepreneurship and cloud.",
    color: "red" as const,
  },
  {
    t: "Volunteering",
    d: "Support events and outreach; earn certificates and mentorship credits.",
    color: "green" as const,
  },
  {
    t: "Mentorship",
    d: "1:1 pairing with alumni founders, engineers and researchers.",
    color: "" as const,
  },
  {
    t: "Student Stories",
    d: "Read how JHUB student teams have moved from idea to pilot.",
    color: "red" as const,
  },
];

function ForStudentsPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <header className="page-header">
        <h1>
          For <span style={{ color: "var(--jhub-green)" }}>Students</span>
        </h1>
        <p>
          Join a community of builders, attend workshops, access courses and
          work on real-world innovation challenges.
        </p>
        <div className="hero-btns" style={{ marginTop: "1.25rem" }}>
          <Link to="/courses" className="btn-primary">
            Explore courses
          </Link>
          <button
            className="btn-outline"
            onClick={() => setIsContactModalOpen(true)}
          >
            Join the club
          </button>
        </div>
      </header>

      <section className="content-section">
        <div className="cards-grid">
          {OPPS.map((o) => (
            <div key={o.t} className="prog-card">
              <div className={`prog-title ${o.color}`}>{o.t}</div>
              <p className="prog-desc">{o.d}</p>
              <div className="prog-meta">
                <button
                  className="prog-arrow"
                  onClick={() => setIsContactModalOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                    color: "inherit",
                  }}
                >
                  Get involved →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source="For Students Page"
      />
    </>
  );
}
