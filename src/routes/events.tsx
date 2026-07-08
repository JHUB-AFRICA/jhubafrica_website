import { createFileRoute, Link } from "@tanstack/react-router";
import { getEvents, type EventItem } from "@/lib/api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — JHUB Africa" },
      { name: "description", content: "Upcoming hackathons, demo days, workshops and meetups at JHUB Africa." },
      { property: "og:title", content: "Events — JHUB Africa" },
      { property: "og:description", content: "Hackathons, demo days, workshops and meetups." },
    ],
  }),
  loader: async () => {
    return getEvents();
  },
  component: EventsPage,
});

function EventsPage() {
  const events = Route.useLoaderData();

  return (
    <>
      <header className="page-header">
        <h1>Upcoming <span style={{ color: "var(--jhub-green)" }}>Events</span></h1>
        <p>Hands-on opportunities to learn, build and connect with Africa's tech ecosystem.</p>
      </header>

      <section className="content-section">
        <div className="cards-grid">
          {events.map((e: EventItem) => (
            <div key={e.id || e.title} className="prog-card">
              <div className="event-card">
                <div className="event-date">
                  <div className="event-day">{e.day}</div>
                  <div className="event-month">{e.month}</div>
                </div>
                <div>
                  <div className={`prog-title ${e.titleColor}`}>{e.title}</div>
                  <p className="prog-desc">{e.desc}</p>
                  <div style={{ marginTop: "0.75rem" }}>
                    <Link to="/contact" className="prog-arrow">Register →</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

