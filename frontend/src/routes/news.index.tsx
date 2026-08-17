import { createFileRoute, Link } from "@tanstack/react-router";
import { getNews } from "../../axios/api/news";
import { NewsPost } from "../types/news";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News — JHUB Africa" },
      {
        name: "description",
        content:
          "Latest announcements, partnerships and startup wins from JHUB Africa.",
      },
      { property: "og:title", content: "News — JHUB Africa" },
      {
        property: "og:description",
        content: "Announcements, partnerships and stories.",
      },
    ],
  }),
  loader: async () => {
    return getNews();
  },
  component: NewsIndexPage,
});

function NewsIndexPage() {
  const posts: NewsPost[] = Route.useLoaderData();

  return (
    <>
      <header className="page-header">
        <h1>News & <span style={{ color: "var(--jhub-green)" }}>Updates</span></h1>
        <p>Stay current with announcements, partnerships and the latest wins from the JHUB Africa community.</p>
      </header>

      <section className="content-section">
        <div className="cards-grid">
          {posts.map((p: NewsPost) => {
            return (
              <article
                key={p.id || p.title}
                className="prog-card news-card-compact"
              >
                {p.image && (
                  <div style={{ marginBottom: "1rem", borderRadius: "0.5rem", overflow: "hidden", height: "200px" }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className={`prog-title ${p.titleColor}`}>{p.title}</div>
                <p className="prog-desc">{p.excerpt}</p>
                <div className="prog-meta">
                  <span className="prog-slots">{p.date}</span>
                  <Link
                    to="/news/$slug"
                    params={{ slug: p.slug }}
                    className="prog-link-button"
                  >
                    Read →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
