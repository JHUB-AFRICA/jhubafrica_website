import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { getNews } from "../../axios/api/news";
import { NewsPost } from "../types/news";
import SkeletonCards from "../components/site/SkeletonCards";
import ResourceFallback from "../components/site/ResourceFallback";
import EditorialHero from "../components/site/EditorialHero";
import { Search } from "lucide-react";

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
  errorComponent: ({ error, reset }) => (
    <>
      <EditorialHero
        themeVariant="dark"
        badges={[
          { label: "ANNOUNCEMENTS", variant: "sector" },
          { label: "STORIES", variant: "stage" },
          { label: "ECOSYSTEM UPDATES", variant: "verified" },
        ]}
        title={
          <>
            News &amp; <span style={{ color: "#6ee7b7" }}>Updates</span>
          </>
        }
        description="Stay current with announcements, partnerships and the latest wins from the JHUB Africa community."
      />
      <section className="content-section">
        <ResourceFallback error={error} onRetry={reset} resourceName="News & Updates" />
      </section>
    </>
  ),
  pendingComponent: () => (
    <>
      <EditorialHero
        themeVariant="dark"
        badges={[
          { label: "ANNOUNCEMENTS", variant: "sector" },
          { label: "STORIES", variant: "stage" },
          { label: "ECOSYSTEM UPDATES", variant: "verified" },
        ]}
        title={
          <>
            News &amp; <span style={{ color: "#6ee7b7" }}>Updates</span>
          </>
        }
        description="Stay current with announcements, partnerships and the latest wins from the JHUB Africa community."
      />
      <section className="content-section">
        <SkeletonCards count={3} hasImage={true} />
      </section>
    </>
  ),
});

function cleanAndSliceExcerpt(htmlOrText: string, maxLength: number = 140) {
  if (!htmlOrText) return "";
  const plainText = htmlOrText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plainText.length <= maxLength) return plainText;
  const sub = plainText.substring(0, maxLength);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 60 ? sub.substring(0, lastSpace) : sub).trim() + "...";
}

function NewsIndexPage() {
  const posts: NewsPost[] = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");

  // Derive unique categories/tags
  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.tag && p.tag.trim()) {
        set.add(p.tag.trim());
      }
    });
    return ["ALL", ...Array.from(set)];
  }, [posts]);

  // Filter posts based on query and tag
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return posts.filter((p) => {
      const matchTag = selectedTag === "ALL" || (p.tag && p.tag.toLowerCase() === selectedTag.toLowerCase());
      if (!matchTag) return false;

      if (!q) return true;

      const titleMatch = p.title ? p.title.toLowerCase().includes(q) : false;
      const excerptMatch = p.excerpt ? p.excerpt.toLowerCase().includes(q) : false;
      const bodyMatch = p.body ? p.body.toLowerCase().includes(q) : false;
      const authorMatch = p.author ? p.author.toLowerCase().includes(q) : false;
      const tagMatch = p.tag ? p.tag.toLowerCase().includes(q) : false;

      return titleMatch || excerptMatch || bodyMatch || authorMatch || tagMatch;
    });
  }, [posts, searchQuery, selectedTag]);

  return (
    <>
      <EditorialHero
        themeVariant="dark"
        badges={[
          { label: "ANNOUNCEMENTS", variant: "sector" },
          { label: "STORIES", variant: "stage" },
          { label: "ECOSYSTEM UPDATES", variant: "verified" },
        ]}
        title={
          <>
            News &amp; <span style={{ color: "#6ee7b7" }}>Updates</span>
          </>
        }
        description="Stay current with announcements, partnerships and the latest wins from the JHUB Africa community."
      />

      <section className="content-section" style={{ minHeight: "50vh" }}>
        {/* Search & Tag Filter Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {/* Search Bar */}
          <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
            <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search news by title, content or author..."
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
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {/* Filter Tags */}
          {uniqueTags.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className="btn-outline"
                  style={{
                    padding: "0.45rem 1.15rem",
                    fontSize: "0.85rem",
                    borderRadius: "30px",
                    border: selectedTag === tag ? "2px solid var(--jhub-green)" : "1px solid var(--border-color)",
                    backgroundColor: selectedTag === tag ? "var(--bg-soft)" : "transparent",
                    color: selectedTag === tag ? "var(--jhub-blue)" : "var(--text-muted)",
                    cursor: "pointer",
                    fontWeight: selectedTag === tag ? "700" : "500",
                    transition: "all 0.2s",
                    textTransform: tag === "ALL" ? "none" : "capitalize",
                  }}
                >
                  {tag === "ALL" ? "All Stories" : tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state-card" style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", background: "var(--bg-soft)" }}>
            <span style={{ fontSize: "2.2rem" }}>📰</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--jhub-blue)", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
              No matching news articles found
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
              Try adjusting your search keywords or choosing a different category filter.
            </p>
            {(searchQuery || selectedTag !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("ALL");
                }}
                className="btn-outline"
                style={{ fontSize: "0.85rem", padding: "8px 20px" }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="cards-grid" style={{ gap: "2.5rem 2rem" }}>
            {filteredPosts.map((p: NewsPost) => {
              const cardImg = p.image || "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=600";
              const displayExcerpt = p.excerpt && p.excerpt.trim().length > 0
                ? p.excerpt
                : cleanAndSliceExcerpt(p.body, 140);

              return (
                <Link
                  key={p.id || p.title}
                  to="/news/$slug"
                  params={{ slug: p.slug }}
                  className="news-card-borderless"
                >
                  <div className="news-media-wrap">
                    <img
                      src={cardImg}
                      alt={p.title}
                    />
                  </div>
                  <div style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "700", color: "var(--jhub-green)", marginBottom: "0.4rem" }}>
                    {p.tag}
                  </div>
                  <div className={`prog-title ${p.titleColor} hover-underline-center`} style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: "700", lineHeight: "1.3", marginBottom: "0.4rem" }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    {p.date}
                  </div>
                  <p className="prog-desc" style={{ flexGrow: 1, margin: "0 0 1.25rem 0", fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: "1.55" }}>
                    {displayExcerpt}
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "0.25rem" }}>
                    <span className="prog-arrow" style={{ fontSize: "0.88rem" }}>
                      Read →
                    </span>
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
