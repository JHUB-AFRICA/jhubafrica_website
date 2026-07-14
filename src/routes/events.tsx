import { useEffect, useRef, useState } from "react";
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
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = events.find((e: EventItem) => e.id === selectedEventId);
  const detailRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedEvent || !detailRef.current) return;
    detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedEvent]);

  return (
    <>
      <header className="page-header">
        <h1>Upcoming <span style={{ color: "var(--jhub-green)" }}>Events</span></h1>
        <p>Hands-on opportunities to learn, build and connect with Africa's tech ecosystem.</p>
      </header>

      <section className="content-section">
        <div className="cards-grid">
          {events.map((e: EventItem) => (
            <div key={e.id || e.title} className="prog-card news-card-compact">
              {e.image && (
                <div style={{ marginBottom: "1rem", borderRadius: "0.5rem", overflow: "hidden", height: "200px" }}>
                  <img
                    src={e.image}
                    alt={e.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="event-card">
                <div className="event-date">
                  <div className="event-day">{e.day}</div>
                  <div className="event-month">{e.month}</div>
                </div>
                <div>
                  <div className={`prog-title ${e.titleColor}`}>{e.title}</div>
                  <p className="prog-desc">{e.desc}</p>
                  <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem" }}>
                    <button
                      type="button"
                      className="prog-link-button"
                      onClick={() => setSelectedEventId(e.id)}
                    >
                      Read →
                    </button>
                    <Link to="/contact" className="prog-arrow">Register →</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedEvent && (
          <article ref={detailRef} className="prog-card news-full-detail">
            {selectedEvent.image && (
              <div style={{ marginBottom: "1rem", borderRadius: "0.5rem", overflow: "hidden", height: "270px" }}>
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <div className="event-date" style={{ width: "70px", padding: "0.4rem" }}>
                <div className="event-day" style={{ fontSize: "1.2rem" }}>{selectedEvent.day}</div>
                <div className="event-month" style={{ fontSize: "0.6rem" }}>{selectedEvent.month}</div>
              </div>
              <div className={`prog-title ${selectedEvent.titleColor}`} style={{ fontSize: "1.5rem", marginBottom: 0 }}>
                {selectedEvent.title}
              </div>
            </div>
            {selectedEvent.desc.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="news-full-paragraph">
                {paragraph}
              </p>
            ))}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <Link to="/contact" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
                Register for Event
              </Link>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setSelectedEventId(null)}
              >
                Close full details
              </button>
            </div>
          </article>
        )}
      </section>
    </>
  );
}

