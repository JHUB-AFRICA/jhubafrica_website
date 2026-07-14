import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getNews, type NewsPost } from "@/lib/api";

export const Route = createFileRoute("/news")({
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
  component: NewsPage,
});

const POSTS = [
  {
    tag: "Announcement",
    title: "New Cohort Applications Open",
    date: "June 2026",
    body: "Applications are now open for our incoming startup cohort. Selected teams receive mentorship, workspace and seed support.",
    color: "g" as const,
    titleColor: "green" as const,
  },
  {
    tag: "Partnership",
    title: "JHUB Africa Signs MoU with Industry Partner",
    date: "May 2026",
    body: "A new partnership to accelerate applied research projects in fintech and agritech.",
    color: "b" as const,
    titleColor: "" as const,
  },
  {
    tag: "Story",
    title: "Alumni Startup Closes Pre-Seed Round",
    date: "April 2026",
    body: "A JHUB-incubated startup secures pre-seed funding to scale across East Africa.",
    color: "p" as const,
    titleColor: "red" as const,
  },
];

function NewsPage() {
  const posts: NewsPost[] = Route.useLoaderData();
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const selectedPost = posts.find((p) => p.id === selectedNewsId);
  const detailRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedPost || !detailRef.current) return;
    detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedPost]);

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
                <span className={`prog-tag prog-tag-${p.color}`}>{p.tag}</span>
                <div className={`prog-title ${p.titleColor}`}>{p.title}</div>
                <p className="prog-desc">{p.body}</p>
                <div className="prog-meta">
                  <span className="prog-slots">{p.date}</span>
                  <button
                    type="button"
                    className="prog-link-button"
                    onClick={() => setSelectedNewsId(p.id)}
                  >
                    Read →
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {selectedPost && (
          <article ref={detailRef} className="prog-card news-full-detail">
            {selectedPost.image && (
              <div style={{ marginBottom: "1rem", borderRadius: "0.5rem", overflow: "hidden", height: "270px" }}>
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <span className={`prog-tag prog-tag-${selectedPost.color}`}>{selectedPost.tag}</span>
            <div className={`prog-title ${selectedPost.titleColor}`}>{selectedPost.title}</div>
            <p className="news-full-date">{selectedPost.date}</p>
            {selectedPost.body.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="news-full-paragraph">
                {paragraph}
              </p>
            ))}
            <button
              type="button"
              className="prog-link-button"
              onClick={() => setSelectedNewsId(null)}
              style={{ marginTop: "1rem" }}
            >
              Close full story
            </button>
          </article>
        )}
      </section>
    </>
  );
}

