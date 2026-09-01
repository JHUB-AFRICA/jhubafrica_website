import { createFileRoute, Link } from "@tanstack/react-router";
import { getEventBySlug } from "../../axios/api/events";
import { EventItem } from "../types/events";
import EditorialHero from "../components/site/EditorialHero";
import { MapPin, Calendar } from "lucide-react";

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
      <EditorialHero
        themeVariant="navy"
        backLink={{
          to: "/events",
          label: "Back to Events Calendar",
        }}
        badges={[
          {
            label: `${event.month} ${event.day}`,
            variant: "accent",
            icon: <Calendar size={14} />,
          },
          ...(event.location
            ? [
                {
                  label: event.location,
                  variant: "outline" as const,
                  icon: <MapPin size={14} color="#6ee7b7" />,
                },
              ]
            : []),
        ]}
        title={event.title}
      />

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

        <div style={{ display: "flex", gap: "1rem", marginTop: "3rem", borderTop: "1px solid #e2e8f0", paddingTop: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          {event.meetingUrl && (
            <a
              href={event.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                background: "var(--jhub-green)",
                borderColor: "var(--jhub-green)"
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
            ← Back to Events Calendar
          </Link>
        </div>
      </section>
    </>
  );
}
