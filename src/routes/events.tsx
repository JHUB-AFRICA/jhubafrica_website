import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/events")({
    head: () => ({
        meta: [
            { title: "Events — JHUB Africa" },
            { name: "description", content: "Upcoming hackathons, demo days, workshops and meetups at JHUB Africa." },
            { property: "og:title", content: "Events — JHUB Africa" },
            { property: "og:description", content: "Hackathons, demo days, workshops and meetups." },
        ],
    }),
    component: EventsPage,
});

const EVENTS = [
    { day: "12", month: "Jul", title: "Innovation Demo Day", desc: "Cohort showcase of student-led startups pitching to investors and partners.", titleColor: "" },
    { day: "24", month: "Jul", title: "AI for Africa Hackathon", desc: "48-hour hackathon focused on applied AI solutions for local industries.", titleColor: "green" },
    { day: "09", month: "Aug", title: "Founders Fireside", desc: "Conversations with African founders on building and scaling ventures.", titleColor: "red" },
    { day: "21", month: "Aug", title: "Women in Tech Meetup", desc: "Network, mentorship and lightning talks for women in technology.", titleColor: "" },
];

function EventsPage() {
    return (
        <>
            <header className="page-header">
                <h1>Upcoming <span style={{ color: "var(--jhub-green)" }}>Events</span></h1>
                <p>Hands-on opportunities to learn, build and connect with Africa's tech ecosystem.</p>
            </header>

            <section className="content-section">
                <div className="cards-grid">
                    {EVENTS.map((e) => (
                        <div key={e.title} className="prog-card">
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
