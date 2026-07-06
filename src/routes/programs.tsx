import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Events — JHUB Africa" },
      { name: "description", content: "Innovation programs, upcoming events, past events, calendar and event proposals at JHUB Africa." },
      { property: "og:title", content: "Programs & Events — JHUB Africa" },
      { property: "og:description", content: "Programs, events and calendar for the JHUB community." },
    ],
  }),
  component: ProgramsPage,
});

const PROGRAMS = [
  { t: "Startup Incubator", d: "12-week structured incubation for early-stage founders.", color: "green" as const },
  { t: "Applied Research", d: "Collaborative R&D with JKUAT faculties and industry sponsors.", color: "" as const },
  { t: "Innovation Challenges", d: "Themed sprints backed by partners in agri, health and finance.", color: "red" as const },
];

const UPCOMING = [
  { day: "12", month: "Jul", title: "Innovation Demo Day", desc: "Cohort showcase of student-led startups pitching to investors and partners." },
  { day: "24", month: "Jul", title: "AI for Africa Hackathon", desc: "48-hour hackathon focused on applied AI solutions for local industries." },
  { day: "09", month: "Aug", title: "Founders Fireside", desc: "Conversations with African founders on building and scaling ventures." },
];

function ProgramsPage() {
  return (
    <>
      <header className="page-header">
        <h1>Programs &amp; <span style={{ color: "var(--jhub-green)" }}>Events</span></h1>
        <p>Innovation programs and hands-on events that bring the JHUB community together — with partners, investors and mentors.</p>
      </header>

      <section className="content-section">
        <div className="section-eyebrow">Programs</div>
        <h2 className="section-h2">Signature programs</h2>
        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {PROGRAMS.map((p) => (
            <div key={p.t} className="prog-card">
              <div className={`prog-title ${p.color}`}>{p.t}</div>
              <p className="prog-desc">{p.d}</p>
              <div className="prog-meta"><Link to="/contact" className="prog-arrow">Enquire →</Link></div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">Calendar</div>
          <h2 className="section-h2 green">Upcoming events</h2>
          <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
            {UPCOMING.map((e) => (
              <div key={e.title} className="prog-card">
                <div className="event-card">
                  <div className="event-date">
                    <div className="event-day">{e.day}</div>
                    <div className="event-month">{e.month}</div>
                  </div>
                  <div>
                    <div className="prog-title">{e.title}</div>
                    <p className="prog-desc">{e.desc}</p>
                    <div style={{ marginTop: "0.75rem" }}>
                      <Link to="/contact" className="prog-arrow">Register →</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <Link to="/contact" className="btn-outline">Propose an event</Link>
        </div>
      </section>
    </>
  );
}