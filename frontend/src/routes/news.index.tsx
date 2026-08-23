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

function cleanAndSliceExcerpt(htmlOrText: string, maxLength: number = 140) {
  const plainText = htmlOrText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + "...";
}

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
            const cardImg = p.image || "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=600";
            const displayExcerpt = p.excerpt && p.excerpt.trim().length > 0
              ? p.excerpt
              : cleanAndSliceExcerpt(p.body, 140);

            return (
              <Link
                key={p.id || p.title}
                to="/news/$slug"
                params={{ slug: p.slug }}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <article
                  className="prog-card news-card-compact"
                  style={{ display: "flex", flexDirection: "column", height: "100%", cursor: "pointer" }}
                >
                  <div style={{ marginBottom: "1rem", borderRadius: "0.5rem", overflow: "hidden", height: "200px" }}>
                    <img
                      src={cardImg}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "700", color: "var(--jhub-green)", marginBottom: "0.5rem" }}>
                    {p.tag}
                  </div>
                  <div className={`prog-title ${p.titleColor}`} style={{ marginTop: 0, fontSize: "1.2rem", fontWeight: "700", lineHeight: "1.3" }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem", marginTop: "0.25rem" }}>
                    {p.date}
                  </div>
                  <p className="prog-desc" style={{ flexGrow: 1, margin: "0 0 1.25rem 0", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                    {displayExcerpt}
                  </p>
                  <div className="prog-meta" style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                    <span className="prog-slots" style={{ visibility: "hidden" }}>Slots</span>
                    <span className="prog-link-button">
                      Read →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
