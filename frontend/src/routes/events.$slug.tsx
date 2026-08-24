import { createFileRoute, Link } from "@tanstack/react-router";
import { getEventBySlug } from "../../axios/api/events";
import { EventItem } from "../types/events";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/events/$slug")({
  head: (ctx: { loaderData?: EventItem }) => {
    const event = ctx.loaderData;
    return {
      meta: [
        { title: event ? `${event.title} — JHub Africa Events` : "Event — JHub Africa" },
        {
          name: "description",
          content: event ? event.desc : "Explore JHub Africa workshops, hackathons and meetups.",
        },
        { property: "og:title", content: event ? event.title : "Event — JHub Africa" },
        {
          property: "og:description",
          content: event ? event.desc : "Announcements, events and workshops.",
        },
      ],
    };
  },
  loader: async ({ params }) => {
    return getEventBySlug(params.slug);
  },
  component: EventDetailPage,
});

function EventDetailPage() {
  const event: EventItem = Route.useLoaderData();

  return (
    <>
      <header className="page-header" style={{ position: "relative" }}>
        <Link
          to="/events"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--jhub-green)",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          ← Back to Events
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
          <div className="event-date" style={{ width: "70px", padding: "0.4rem" }}>
            <div className="event-day" style={{ fontSize: "1.5rem", lineHeight: 1 }}>{event.day}</div>
            <div className="event-month" style={{ fontSize: "0.75rem" }}>{event.month}</div>
          </div>
          <div>
            <h1 style={{ marginTop: 0, fontSize: "2.5rem", color: "var(--jhub-blue)", lineHeight: 1.2, marginBottom: 0 }}>
              {event.title}
            </h1>
          </div>
        </div>

        {event.location && (
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontSize: "1.05rem", color: "var(--text-main)", marginTop: "1rem" }}>
            <MapPin size={18} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
            <span><strong>Venue:</strong> {event.location}</span>
          </div>
        )}
      </header>

      <section className="content-section" style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }}>
        <div
          style={{
            marginBottom: "2.5rem",
            borderRadius: "0.75rem",
            overflow: "hidden",
            height: "400px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <img
            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#334155" }}>
          {event.desc ? (
            event.desc.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} style={{ marginBottom: "1.5rem" }}>
                {paragraph}
              </p>
            ))
          ) : (
            <p>No description details are available for this event.</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "3rem", borderTop: "1px solid #e2e8f0", paddingTop: "2rem", flexWrap: "wrap" }}>
          {event.registrationUrl ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              Register for Event
            </a>
          ) : (
            <Link to="/contact" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Register for Event
            </Link>
          )}
          {event.meetingUrl && (
            <a
              href={event.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                background: "var(--jhub-blue)",
                borderColor: "var(--jhub-blue)"
              }}
            >
              Join Online Meeting →
            </a>
          )}
          <Link
            to="/events"
            className="btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            ← Back to Events
          </Link>
        </div>
      </section>
    </>
  );
}
