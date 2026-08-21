import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getEvents } from "../../axios/api/events";
import { EventItem } from "../types/events";
import SkeletonCards from "../components/site/SkeletonCards";
import { MapPin } from "lucide-react";

interface EventsSearch {
  selectedId?: string;
}

export const Route = createFileRoute("/events")({
  validateSearch: (search: Record<string, unknown>): EventsSearch => {
    return {
      selectedId: search.selectedId as string | undefined,
    };
  },
  head: (ctx: { loaderData?: EventItem[] }) => {
    const events = ctx.loaderData || [];
    const validEvents = events.filter(e => e && e.title && e.day && e.month);

    const eventsSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "numberOfItems": validEvents.length,
      "itemListElement": validEvents.map((e: EventItem, idx: number) => {
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "Event",
            "name": e.title,
            "description": e.desc || "JHUB Africa upcoming event details.",
            "startDate": e.startDateISO,
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": e.location || "JHUB Africa, JKUAT",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Juja Campus",
                "addressLocality": "Nairobi",
                "addressCountry": "KE"
              }
            },
            "organizer": {
              "@type": "Organization",
              "name": "JHUB Africa",
              "url": "https://jhubafrica.com"
            },
            ...(e.image ? { "image": e.image } : {})
          }
        };
      })
    };

    return {
      meta: [
        { title: "Events — JHUB Africa" },
        { name: "description", content: "Upcoming hackathons, demo days, workshops and meetups at JHUB Africa." },
        { property: "og:title", content: "Events — JHUB Africa" },
        { property: "og:description", content: "Hackathons, demo days, workshops and meetups." },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(eventsSchema)
        }
      ]
    };
  },
  loader: async () => {
    return getEvents();
  },
  component: EventsPage,
  pendingComponent: () => (
    <>
      <header className="page-header">
        <h1>Upcoming <span style={{ color: "var(--jhub-green)" }}>Events</span></h1>
        <p>Hands-on opportunities to learn, build and connect with Africa's tech ecosystem.</p>
      </header>

      <section className="content-section">
        <SkeletonCards count={3} hasImage={true} />
      </section>
    </>
  ),
});

function EventsPage() {
  const events = Route.useLoaderData();
  const search = Route.useSearch();
  const selectedEventId = search.selectedId;
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
        {events.length === 0 ? (
          <div className="empty-state-card" style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", background: "var(--bg-soft)" }}>
            <span style={{ fontSize: "2.2rem" }}>📅</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--jhub-blue)", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
              No Events Scheduled
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
              There are currently no scheduled public events, hackathons, or workshops in the pipeline. Please check back later or subscribe to stay informed.
            </p>
            <Link to="/contact" className="btn-primary" style={{ display: "inline-block", fontSize: "0.85rem", padding: "10px 24px" }}>
              Get in Touch
            </Link>
          </div>
        ) : (
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
                    <div className={`prog-title ${e.titleColor}`} style={{ textAlign: "left" }}>{e.title}</div>
                    <p className="prog-desc" style={{ textAlign: "left" }}>{e.desc}</p>
                    
                    {e.location && (
                      <div className="event-venue-line" style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem", textAlign: "left" }}>
                        <MapPin size={14} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
                        <span>{e.location}</span>
                      </div>
                    )}

                    <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", justifyContent: "flex-start" }}>
                      <Link
                        to="/events"
                        search={{ selectedId: e.id }}
                        className="prog-link-button"
                      >
                        Read →
                      </Link>
                      <Link to="/contact" className="prog-arrow">Register →</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            
            {selectedEvent.location && (
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "1rem" }}>
                <MapPin size={16} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
                <span><strong>Venue:</strong> {selectedEvent.location}</span>
              </div>
            )}

            {selectedEvent.desc.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="news-full-paragraph">
                {paragraph}
              </p>
            ))}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <Link to="/contact" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
                Register for Event
              </Link>
              <Link
                to="/events"
                search={{ selectedId: undefined }}
                className="btn-outline"
                style={{ textDecoration: "none" }}
              >
                Close full details
              </Link>
            </div>
          </article>
        )}
      </section>
    </>
  );
}
