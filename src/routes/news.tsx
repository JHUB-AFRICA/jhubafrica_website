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
  const posts = Route.useLoaderData();

  return (
    <>
      <header className="page-header">
        <h1>News & <span style={{ color: "var(--jhub-green)" }}>Updates</span></h1>
        <p>Stay current with announcements, partnerships and the latest wins from the JHUB Africa community.</p>
      </header>

      <section className="content-section">
        <div className="cards-grid">
          {posts.map((p: NewsPost) => (
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

