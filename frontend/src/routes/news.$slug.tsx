import { createFileRoute, Link } from "@tanstack/react-router";
import { getNewsBySlug } from "../../axios/api/news";
import { NewsPost } from "../types/news";

export const Route = createFileRoute("/news/$slug")({
  head: (ctx: { loaderData?: NewsPost }) => {
    const post = ctx.loaderData;
    return {
      meta: [
        { title: post ? `${post.title} — JHub Africa News` : "News — JHub Africa" },
        {
          name: "description",
          content: post ? post.excerpt : "Latest JHub Africa news.",
        },
        { property: "og:title", content: post ? post.title : "News — JHub Africa" },
        {
          property: "og:description",
          content: post ? post.excerpt : "Announcements, partnerships and stories.",
        },
      ],
    };
  },
  loader: async ({ params }) => {
    return getNewsBySlug(params.slug);
  },
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const post: NewsPost = Route.useLoaderData();

  return (
    <>
      <header className="page-header" style={{ position: "relative" }}>
        <Link
          to="/news"
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
          ← Back to News
        </Link>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
          <span className={`badge badge-${post.color}`} style={{ textTransform: "uppercase", fontSize: "0.8rem", fontWeight: 700 }}>
            {post.tag}
          </span>
          <span style={{ fontSize: "0.9rem", color: "#64748b" }}>· {post.date}</span>
        </div>
        <h1 style={{ marginTop: 0, fontSize: "2.5rem", color: "var(--jhub-blue)", lineHeight: 1.2 }}>{post.title}</h1>
        {post.excerpt && (
          <p style={{ fontSize: "1.15rem", color: "#475569", lineHeight: "1.6", fontWeight: 500, marginTop: "1rem" }}>
            {post.excerpt}
          </p>
        )}
      </header>

      <section className="content-section" style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "4rem" }}>
        <div
          style={{
            marginBottom: "2rem",
            borderRadius: "0.75rem",
            overflow: "hidden",
            height: "400px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <img
            src={post.image || "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=600"}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#334155" }}>
          <div style={{ fontWeight: 700, color: "var(--jhub-blue)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "24px", height: "2px", backgroundColor: "var(--jhub-green)" }}></span>
            By JHUB Editorial Team
          </div>
          {post.body ? (
            post.body.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} style={{ marginBottom: "1.5rem" }}>
                {paragraph}
              </p>
            ))
          ) : (
            <p>No content details are available for this post.</p>
          )}
        </div>

        <div style={{ marginTop: "3rem", borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
          <Link
            to="/news"
            className="btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            ← Back to News
          </Link>
        </div>
      </section>
    </>
  );
}
