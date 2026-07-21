import { createFileRoute } from "@tanstack/react-router";
import ApplyDialog from "../components/site/ApplyDialog";

export const Route = createFileRoute("/courses")({
  head: () => ({
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
  }),
  component: CoursesPage,
});

const COURSES = [
  {
    tag: "Software",
    title: "Full-Stack Web Development",
    desc: "TypeScript, React, Node, databases and deployment to the cloud.",
    level: "Beginner → Intermediate",
    duration: "12 weeks",
    mode: "Hybrid",
    cohort: "Open",
    cert: "Certificate of completion",
    color: "g" as const,
    titleColor: "green" as const,
  },
  {
    tag: "Data",
    title: "Data Analytics & Visualization",
    desc: "Python, SQL, dashboards and storytelling with data.",
    level: "Intermediate",
    duration: "8 weeks",
    mode: "Online",
    cohort: "Open",
    cert: "Certificate of completion",
    color: "b" as const,
  },
  {
    tag: "AI",
    title: "Applied Machine Learning",
    desc: "Hands-on ML workflows, model evaluation and deployment.",
    level: "Advanced",
    duration: "10 weeks",
    mode: "Hybrid",
    cohort: "Waitlist",
    cert: "Certificate of completion",
    color: "p" as const,
    titleColor: "red" as const,
  },
  {
    tag: "Design",
    title: "Product & UX Design",
    desc: "Research, prototyping and design systems for digital products.",
    level: "Beginner",
    duration: "6 weeks",
    mode: "Hybrid",
    cohort: "Open",
    cert: "Certificate of completion",
    color: "g" as const,
    titleColor: "green" as const,
  },
  {
    tag: "Cloud",
    title: "Cloud & DevOps Essentials",
    desc: "CI/CD, containers and cloud-native deployment on AWS / GCP.",
    level: "Intermediate",
    duration: "8 weeks",
    mode: "Online",
    cohort: "Waitlist",
    cert: "Certificate of completion",
    color: "b" as const,
  },
  {
    tag: "Mobile",
    title: "Mobile App Development",
    desc: "Cross-platform mobile apps with React Native and Flutter.",
    level: "Intermediate",
    duration: "10 weeks",
    mode: "On-campus",
    cohort: "Open",
    cert: "Certificate of completion",
    color: "p" as const,
    titleColor: "red" as const,
  },
];

function CoursesPage() {
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
        <div className="cards-grid">
          {COURSES.map((c) => (
            <div key={c.title} className="prog-card">
              <div className={`prog-title ${c.titleColor ?? ""}`}>
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