import { createFileRoute } from "@tanstack/react-router";
import { getNews } from "@/lib/api";

export const Route = createFileRoute("/news")({
    head: () => ({
        meta: [
            { title: "News — JHUB Africa" },
            { name: "description", content: "Latest announcements, partnerships and startup wins from JHUB Africa." },
            { property: "og:title", content: "News — JHUB Africa" },
            { property: "og:description", content: "Announcements, partnerships and stories." },
        ],
    }),
    loader: async () => {
        return getNews();
    },
    component: NewsPage,
});

function NewsPage() {
    const posts = Route.useLoaderData();

    return (
        <>
            <header className="page-header">
                <h1>News & <span style={{ color: "var(--jhub-green)" }}>Updates</span></h1>
                <p>Stay current with announcements, partnerships and the latest wins from the JHUB Africa community.</p>
            </header>

            <section className="content-section">
                <div className="cards-grid">
                    {posts.map((p) => (
                        <article key={p.id || p.title} className="prog-card">
                            <span className={`prog-tag prog-tag-${p.color}`}>{p.tag}</span>
                            <div className={`prog-title ${p.titleColor}`}>{p.title}</div>
                            <p className="prog-desc">{p.body}</p>
                            <div className="prog-meta">
                                <span className="prog-slots">{p.date}</span>
                                <span className="prog-arrow">Read →</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}

