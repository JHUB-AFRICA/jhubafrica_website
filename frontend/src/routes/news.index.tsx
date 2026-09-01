import { createFileRoute, Link } from "@tanstack/react-router";
import { getNews } from "../../axios/api/news";
import { NewsPost } from "../types/news";
import SkeletonCards from "../components/site/SkeletonCards";
import ResourceFallback from "../components/site/ResourceFallback";
import EditorialHero from "../components/site/EditorialHero";

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

      <section className="content-section">
        <div className="cards-grid" style={{ gap: "2.5rem 2rem" }}>
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
      </section>
    </>
  );
}
