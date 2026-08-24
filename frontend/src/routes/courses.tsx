import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import ApplyDialog from "../components/site/ApplyDialog";
import { getPublicCourses } from "../../axios/api/courses";
import { CourseItem } from "../types/courses";
import SkeletonCards from "../components/site/SkeletonCards";
import ResourceFallback from "../components/site/ResourceFallback";

export const Route = createFileRoute("/courses")({
  head: (ctx: { loaderData?: CourseItem[] }) => {
    const courses = ctx.loaderData || [];
    const validCourses = courses.filter(c => c && c.title && c.desc);

    const coursesSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "numberOfItems": validCourses.length,
      "itemListElement": validCourses.map((c: CourseItem, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Course",
          "name": c.title,
          "description": c.desc,
          "provider": {
            "@type": "Organization",
            "name": "JHUB Africa",
            "url": "https://jhubafrica.com"
          },
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": c.deliveryMode === "ONLINE" ? "Online" : c.deliveryMode === "IN_PERSON" ? "In-Person" : "Hybrid",
            "duration": c.durationWeeks ? `P${c.durationWeeks}W` : "P6W",
            "courseWorkload": "Part-Time"
          }
        }
      }))
    };

    return {
      meta: [
        { title: "Courses — JHUB Africa" },
        {
          name: "description",
          content:
            "Industry-aligned short courses in software, data, design and emerging technologies.",
        },
        { property: "og:title", content: "Courses — JHUB Africa" },
        {
          property: "og:description",
          content: "Skills programs designed for the African job market.",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(coursesSchema)
        }
      ]
    };
  },
  loader: () => getPublicCourses(),
  component: CoursesPage,
  errorComponent: ({ error, reset }) => (
    <>
      <header className="page-header">
        <h1>
          Our <span style={{ color: "var(--jhub-green)" }}>Courses</span>
        </h1>
        <p>
          Practical, instructor-led programs designed with industry partners.
          Cohort-based, with no upfront payment for accepted learners on
          subsidised tracks.
        </p>
      </header>
      <section className="content-section">
        <ResourceFallback error={error} onRetry={reset} resourceName="Courses" />
      </section>
    </>
  ),
  pendingComponent: () => (
    <>
      <header className="page-header">
        <h1>
          Our <span style={{ color: "var(--jhub-green)" }}>Courses</span>
        </h1>
        <p>
          Practical, instructor-led programs designed with industry partners.
          Cohort-based, with no upfront payment for accepted learners on
          subsidised tracks.
        </p>
      </header>

      <section className="content-section">
        <SkeletonCards count={3} />
      </section>
    </>
  ),
});

const CATEGORIES = ["All", "Software", "Data", "Emerging Tech"] as const;

function CoursesPage() {
  const courses = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return courses.filter((c: CourseItem) => {
      const matchQ =
        q.trim() === "" ||
        `${c.title} ${c.desc}`.toLowerCase().includes(q.toLowerCase());
      const matchCategory = category === "All" || c.tag === category;
      return matchQ && matchCategory;
    });
  }, [courses, q, category]);

  return (
    <>
      <header className="page-header">
        <h1>
          Our <span style={{ color: "var(--jhub-green)" }}>Courses</span>
        </h1>
        <p>
          Practical, instructor-led programs designed with industry partners.
          Cohort-based, with no upfront payment for accepted learners on
          subsidised tracks.
        </p>
      </header>

      <section className="content-section">
        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search courses..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="filter-input"
            aria-label="Search courses"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-meta">
          Showing {filtered.length} of {courses.length} courses
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state-card" style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "12px", background: "var(--bg-soft)" }}>
            <span style={{ fontSize: "2.2rem" }}>🎓</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--jhub-blue)", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
              No Courses Found
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
              We couldn't find any courses matching your search criteria. Try modifying your search keywords or choosing a different category.
            </p>
            <button
              onClick={() => {
                setQ("");
                setCategory("All");
              }}
              className="btn-outline"
              style={{ fontSize: "0.85rem", padding: "10px 24px" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filtered.map((c: CourseItem) => (
              <div key={c.id} className="prog-card">
                <span className={`prog-tag prog-tag-${c.color}`}>
                  {c.tag}
                </span>
                <div className={`prog-title ${c.titleColor ?? ""}`} style={{ marginTop: "0.5rem" }}>
                  {c.title}
                </div>
                <p className="prog-desc">{c.desc}</p>
                <div className="quick-facts">
                  <span className="qf-pill">
                    <strong>Duration</strong> {c.duration}
                  </span>
                  <span className="qf-pill">
                    <strong>Mode</strong> {c.mode}
                  </span>
                  <span className="qf-pill">
                    <strong>Level</strong> {c.level}
                  </span>
                  <span
                    className={`qf-pill ${c.cohort === "Open" ? "qf-open" : "qf-wait"}`}
                  >
                    <strong>Cohort</strong> {c.cohort}
                  </span>
                </div>
                <div className="prog-meta">
                  <span className="prog-slots">{c.cert}</span>
                  <ApplyDialog
                    triggerText="Join waitlist →"
                    triggerVariant="ghost"
                    triggerClassName="prog-arrow"
                    source={c.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "3rem" }}>
          <div className="section-eyebrow">Course FAQ</div>
          <h2 className="section-h2">Before you apply</h2>
          <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
            <div className="prog-card">
              <div className="prog-title">Is there an upfront cost?</div>
              <p className="prog-desc">
                Subsidised tracks have no upfront payment for accepted learners.
                Some advanced specialisations have tuition fees disclosed at
                application.
              </p>
            </div>
            <div className="prog-card">
              <div className="prog-title green">
                Is there a minimum cohort size?
              </div>
              <p className="prog-desc">
                Each course runs once a minimum cohort is met. We'll confirm
                your seat or roll you to the next cohort.
              </p>
            </div>
            <div className="prog-card">
              <div className="prog-title red">What certification do I get?</div>
              <p className="prog-desc">
                Learners who complete the assessments receive a JHUB Africa
                certificate of completion endorsed by JKUAT.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}