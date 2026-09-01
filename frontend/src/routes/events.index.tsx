import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getEvents } from "../../axios/api/events";
import { EventItem } from "../types/events";
import SkeletonCards from "../components/site/SkeletonCards";
import ResourceFallback from "../components/site/ResourceFallback";
import EditorialHero from "../components/site/EditorialHero";
import heroStyles from "../styles/EditorialHero.module.css";
import { MapPin, Search } from "lucide-react";

export const Route = createFileRoute("/events/")({
  validateSearch: () => ({}),
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
  errorComponent: ({ error, reset }) => (
    <>
      <EditorialHero
        themeVariant="navy"
        badges={[
          { label: "EVENTS CALENDAR", variant: "sector" },
          { label: "HACKATHONS", variant: "stage" },
          { label: "DEMO DAYS", variant: "verified" },
        ]}
        title={
          <>
            Upcoming <span style={{ color: "#6ee7b7" }}>Events</span>
          </>
        }
        description="Hands-on opportunities to learn, build and connect with Africa's tech ecosystem."
      />
      <section className="content-section">
        <ResourceFallback error={error} onRetry={reset} resourceName="Events Calendar" />
      </section>
    </>
  ),
  pendingComponent: () => (
    <>
      <EditorialHero
        themeVariant="navy"
        badges={[
          { label: "EVENTS CALENDAR", variant: "sector" },
          { label: "HACKATHONS", variant: "stage" },
          { label: "DEMO DAYS", variant: "verified" },
        ]}
        title={
          <>
            Upcoming <span style={{ color: "#6ee7b7" }}>Events</span>
          </>
        }
        description="Hands-on opportunities to learn, build and connect with Africa's tech ecosystem."
      />

      <section className="content-section">
        <SkeletonCards count={3} hasImage={true} />
      </section>
    </>
  ),
});

function EventsPage() {
  const events = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const filteredEvents = events.filter((e: EventItem) => {
    // 1. Tab Type Filter
    if (activeTab !== "ALL") {
      if (activeTab === "WEBINAR") {
        if (e.type !== "WEBINAR" && e.type !== "SEMINAR") return false;
      } else {
        if (e.type !== activeTab) return false;
      }
    }

    // 2. Search Text Filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = e.title.toLowerCase().includes(q);
      const matchesDesc = e.desc.toLowerCase().includes(q);
      const matchesLocation = e.location ? e.location.toLowerCase().includes(q) : false;
      return matchesTitle || matchesDesc || matchesLocation;
    }

    return true;
  });

  return (
    <>
      <EditorialHero
        themeVariant="navy"
        badges={[
          { label: "EVENTS CALENDAR", variant: "sector" },
          { label: "HACKATHONS", variant: "stage" },
          { label: "DEMO DAYS", variant: "verified" },
        ]}
        title={
          <>
            Upcoming <span style={{ color: "#6ee7b7" }}>Events</span>
          </>
        }
        description="Hands-on opportunities to learn, build and connect with Africa's tech ecosystem."
      />

      <section className="content-section" style={{ minHeight: "50vh" }}>
        {/* Search & Tabs Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {/* Search Bar */}
          <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search events by title, description or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderRadius: "30px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-soft)",
                color: "var(--text-main)",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              { key: "ALL", label: "All Events" },
              { key: "WORKSHOP", label: "Workshops" },
              { key: "HACKATHON", label: "Hackathons" },
              { key: "CONFERENCE", label: "Conferences" },
              { key: "WEBINAR", label: "Webinars & Seminars" },
              { key: "NETWORKING", label: "Networking" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="btn-outline"
                style={{
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.88rem",
                  borderRadius: "30px",
                  border: activeTab === tab.key ? "2px solid var(--jhub-green)" : "1px solid var(--border-color)",
                  backgroundColor: activeTab === tab.key ? "var(--bg-soft)" : "transparent",
                  color: activeTab === tab.key ? "var(--jhub-blue)" : "var(--text-muted)",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.key ? "700" : "500",
                  transition: "all 0.2s"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="empty-state-card" style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", background: "var(--bg-soft)" }}>
            <span style={{ fontSize: "2.2rem" }}>📅</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--jhub-blue)", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
              No matching events found
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
              Adjust your search keywords or filter category options to locate matching scheduled events.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {filteredEvents.map((e: EventItem) => {
              const eventDateObj = new Date(e.startDateISO);
              const formattedTime = isNaN(eventDateObj.getTime())
                ? "9:00 AM"
                : eventDateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

              const displayDateTime = `${e.month} ${e.day}, ${eventDateObj.getFullYear()} at ${formattedTime}`;
              const displayDesc = e.desc.replace(/<[^>]*>/g, " ").substring(0, 110) + (e.desc.length > 110 ? "..." : "");

              return (
                <Link
                  key={e.id || e.title}
                  to="/events/$slug"
                  params={{ slug: e.slug || "" }}
                  className="horizontal-event-card"
                >
                  {/* Left Column: Image */}
                  <div className="horizontal-event-media">
                    <img
                      src={e.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"}
                      alt={e.title}
                    />
                  </div>

                  {/* Right Column: Details */}
                  <div className="horizontal-event-details">
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span style={{ textTransform: "uppercase", fontSize: "0.7rem", background: "rgba(16, 185, 129, 0.1)", color: "var(--jhub-green)", padding: "4px 10px", borderRadius: "4px", fontWeight: "700" }}>
                        {e.type || "Event"}
                      </span>
                    </div>

                    <h3 className="hover-underline-center" style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--jhub-blue)", margin: "0 0 0.5rem 0", lineHeight: "1.3" }}>
                      {e.title}
                    </h3>
                    
                    <div style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                      <span>{displayDateTime}</span>
                    </div>

                    {e.location && (
                      <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                        <MapPin size={14} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
                        <span>{e.location}</span>
                      </div>
                    )}

                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.5" }}>
                      {displayDesc}
                    </p>

                    <div>
                      <span
                        className="prog-link-button"
                        style={{ display: "inline-block" }}
                      >
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
