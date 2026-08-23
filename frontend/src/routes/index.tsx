import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, Compass, Leaf, Globe, Cpu, MapPin } from "lucide-react";
import PartnersSection from "../components/site/PartnersSection";
import { getEvents } from "../../axios/api/events";
import { getNews } from "../../axios/api/news";
import { getInnovations } from "../../axios/api/innovations";
import { EventItem } from "../types/events";
import { NewsPost } from "../types/news";
import { InnovationItem } from "../types/innovations";
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpeg";
import image3 from "../assets/images/image3.jpeg";
import image4 from "../assets/images/image4.jpeg";
import image5 from "../assets/images/image5.jpeg";
import image6 from "../assets/images/images6.jpg";
import image7 from "../assets/images/images7.jpg";
import styles from "../styles/Home.module.css";

const HERO_IMAGES = [image1, image2, image3, image4, image5];

const SUPPORT_STEPS = [
  {
    title: "Incubation",
    description: "Build ideas with coaching, lab access and pilot support.",
    image: image7,
    overlay: "linear-gradient(135deg, rgba(15, 45, 89, 0.9), rgba(16, 185, 129, 0.4))",
  },
  {
    title: "Mentorship",
    description: "Connect with experts, investors and industry mentors.",
    image: image2,
    overlay: "linear-gradient(135deg, rgba(4, 120, 87, 0.92), rgba(59, 130, 246, 0.35))",
  },
  {
    title: "Training",
    description: "Develop tech and innovation skills through applied programs.",
    image: image6,
    overlay: "linear-gradient(135deg, rgba(30, 64, 175, 0.9), rgba(245, 158, 11, 0.35))",
  },
  {
    title: "Funding connections",
    description: "Access partner networks, grant opportunities and strategic support.",
    image: image4,
    overlay: "linear-gradient(135deg, rgba(127, 29, 29, 0.9), rgba(14, 165, 233, 0.35))",
  },
  {
    title: "Commercialisation",
    description: "Validate market fit, scale solutions and reach customers.",
    image: image5,
    overlay: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(16, 185, 129, 0.4))",
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "JHUB Africa",
      "url": "https://jhubafrica.com",
      "logo": "https://jhubafrica.com/assets/jhublogo.jpeg",
      "description": "JHUB Africa is the innovation hub of JKUAT, empowering researchers, students and entrepreneurs to build technology for Africa.",
      "parentOrganization": {
        "@type": "CollegeOrUniversity",
        "name": "Jomo Kenyatta University of Agriculture and Technology",
        "alternateName": "JKUAT",
        "url": "https://www.jkuat.ac.ke"
      },
      "sameAs": [
        "https://twitter.com/JHUB_Africa",
        "https://www.linkedin.com/company/jhub-africa"
      ]
    };

    return {
      meta: [
        { title: "JHUB Africa — Africa's Innovation Hub" },
        {
          name: "description",
          content:
            "JHUB Africa empowers innovators, builds solutions and partners across sectors to address Africa's most pressing challenges.",
        },
        {
          property: "og:title",
          content: "JHUB Africa — Innovation Hub at JKUAT",
        },
        {
          property: "og:description",
          content:
            "Explore innovations, events, partner opportunities and impact stories from JHUB Africa.",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(organizationSchema)
        }
      ]
    };
  },
  loader: async () => {
    const [events, news, innovations] = await Promise.all([
      getEvents(),
      getNews(),
      getInnovations()
    ]);
    return { events, news, innovations: innovations.slice(0, 3) };
  },
  component: Index,
});

const HOMEPAGE_METRICS = [
  { n: "2023", l: "Founded", suffix: "" },
  { n: 400, l: "Innovators Supported", suffix: "+" },
  { n: 150, l: "Innovations", suffix: "+" },
  { n: 1000, l: "Students Engaged", suffix: "+" },
  { n: 12, l: "Partners", suffix: "+" },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US");

function formatCount(value: number, metric: { n: number | string }) {
  return typeof metric.n === "string"
    ? String(metric.n)
    : numberFormatter.format(value);
}

function Index() {
  const { events, news, innovations }: { events: EventItem[]; news: NewsPost[]; innovations: InnovationItem[] } =
    Route.useLoaderData();

  const [slides, setSlides] = useState<
    { id: number; imageIndex: number; state: "visible" | "entering" }[]
  >([{ id: 0, imageIndex: 0, state: "visible" }]);
  const [counts, setCounts] = useState(() =>
    Array(HOMEPAGE_METRICS.length).fill(0),
  );
  const slideCounter = useRef(1);
  const currentImageIndex = useRef(0);

  useEffect(() => {
    const metricTargets = HOMEPAGE_METRICS.map((m) =>
      typeof m.n === "number"
        ? m.n
        : Number(String(m.n).replace(/[^0-9]/g, "")),
    );
    let cancelled = false;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      if (cancelled) return;
      const progress = Math.min((now - start) / duration, 1);
      setCounts(
        metricTargets.map((value) => Math.round(value * progress)),
      );
      if (progress < 1) window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextIndex =
        (currentImageIndex.current + 1) % HERO_IMAGES.length;
      currentImageIndex.current = nextIndex;
      const newId = slideCounter.current++;

      setSlides((prev) => [
        ...prev,
        { id: newId, imageIndex: nextIndex, state: "entering" },
      ]);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlides((prev) =>
            prev.map((s) =>
              s.state === "entering" ? { ...s, state: "visible" } : s,
            ),
          );
        });
      });

      setTimeout(() => {
        setSlides((prev) => {
          const last = prev[prev.length - 1];
          return last ? [{ ...last, state: "visible" }] : prev;
        });
      }, 1400);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <div className={styles['hero-bg']}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`${styles['hero-bg-layer']} ${slide.state === "visible"
              ? styles['hero-bg-layer--visible']
              : styles['hero-bg-layer--entering']
              }`}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(8,20,45,0.72), rgba(8,20,45,0.55)), url(${HERO_IMAGES[slide.imageIndex]})`,
            }}
          />
        ))}
        <section className={`${styles['hero-section']} ${styles['hero-on-image']}`}>
          <div className={styles['hero-kicker']}>Africa's Innovation Hub</div>
          {/* eslint-disable-next-line */}
          <h1>
            Africa's Innovation Hub for <span>Turning Ideas into Impact</span>
          </h1>
          <p className={styles['hero-sub']}>
            JHUB Africa empowers innovators, builds solutions and partners across
            sectors to address Africa’s most pressing challenges and create
            sustainable economic growth.
          </p>
          <div className={styles['hero-actions']}>
            <Link to="/innovation" className="btn-primary">
              Explore Innovations
            </Link>
            <Link to="/for-partners" className="btn-outline">
              Partner With Us
            </Link>
          </div>
        </section>

        <div className={`${styles['stats-bar']} ${styles['stats-on-image']}`}>
          {HOMEPAGE_METRICS.map((m, index) => (
            <div key={m.l} className={`${styles.stat} ${styles['metric-card']}`}>
              <div className={styles['stat-n']}>
                {formatCount(counts[index], m)}
                {m.suffix}
              </div>
              <div className={styles['stat-l']}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="content-section" style={{ paddingBottom: "3rem", paddingTop: "3rem" }}>
        <div style={{ display: "grid", gap: "2rem" }} className="diagonal-values-grid">
          {/* Cell 1: Top-Left (Vision) */}
          <div style={{ padding: "1.5rem 0", maxWidth: "480px" }} className="diagonal-vision-cell">
            <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--jhub-blue)", lineHeight: "1.1", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              OUR<br />VISION
            </h2>
            <div style={{ width: "80px", height: "4px", backgroundColor: "var(--jhub-green)", margin: "1.5rem 0" }} />
            <p style={{ fontSize: "1.35rem", lineHeight: "1.6", color: "var(--text-main)", fontWeight: "500", margin: 0 }}>
              A one stop hub offering comprehensive array of digital solutions for societal needs.
            </p>
          </div>

          {/* Cell 2: Top-Right (Spacer on Desktop) */}
          <div className="diagonal-spacer-cell" />

          {/* Cell 3: Bottom-Left (Spacer on Desktop) */}
          <div className="diagonal-spacer-cell" />

          {/* Cell 4: Bottom-Right (Mission) */}
          <div style={{ padding: "1.5rem 0", maxWidth: "480px", marginLeft: "auto" }} className="diagonal-mission-cell">
            <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--jhub-blue)", lineHeight: "1.1", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              OUR<br />MISSION
            </h2>
            <div style={{ width: "80px", height: "4px", backgroundColor: "var(--jhub-green)", margin: "1.5rem 0" }} />
            <p style={{ fontSize: "1.35rem", lineHeight: "1.6", color: "var(--text-main)", fontWeight: "500", margin: 0 }}>
              To drive sustainable digital transformation, providing accessible and impactful solutions for small and medium-scale farmers, traders and enterprises.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Audience-based navigation</div>
        <h2 className="section-h2">Find what matters to you</h2>
        <div className={`cards-grid ${styles['audience-grid']}`}>
          <Link to="/innovation" className={`prog-card ${styles['audience-card']}`}>
            <div className="prog-title green">Innovators</div>
            <p className="prog-desc">
              Get support to build, test and scale your solution.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Start Your Journey →</span>
            </div>
          </Link>
          <Link to="/for-students" className={`prog-card ${styles['audience-card']}`}>
            <div className="prog-title">Students</div>
            <p className="prog-desc">
              Learn, innovate and grow your ideas with JHUB.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Explore Programs →</span>
            </div>
          </Link>
          <Link to="/support" className={`prog-card ${styles['audience-card']}`}>
            <div className="prog-title red">Funders & Investors</div>
            <p className="prog-desc">
              Discover high-potential innovations ready for support.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">View Opportunities →</span>
            </div>
          </Link>
          <Link to="/for-partners" className={`prog-card ${styles['audience-card']}`}>
            <div className="prog-title">Partners & Researchers</div>
            <p className="prog-desc">
              Collaborate on research, pilots and applied innovation.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Partner With Us →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Our focus areas</div>
        <p className="section-copy section-copy--right">
          At JHUB Africa, we pride ourselves in fostering groundbreaking solutions that address pressing challenges. Our featured innovations span various sectors, showcasing the creativity and dedication of our innovators. Explore our transformative solutions that are making a real difference.
        </p>
        <h2 className="section-h2">Themes driving our innovation portfolio</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem", marginTop: "3rem" }}>
          {[
            { icon: <Sprout size={28} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />, title: "Climate Smart Agriculture", desc: "Digital tools for resilient, sustainable food systems." },
            { icon: <Compass size={28} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />, title: "Digital Twin Models", desc: "Real-time simulation and monitoring for systems and energy." },
            { icon: <Leaf size={28} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />, title: "Green Digital Innovation", desc: "Climate-friendly products that reduce waste and improve efficiency." },
            { icon: <Globe size={28} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />, title: "Digital Trade", desc: "Platforms and tools that enable regional market access." },
            { icon: <Cpu size={28} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />, title: "AI & Digital Transformation", desc: "Inclusive AI and automation for African enterprises." }
          ].map((theme, index) => (
            <div key={index} className="theme-row-item" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border-color)" }}>
              {/* Column 1: Icon + Title (Enlarged) */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {theme.icon}
                <h3 style={{ fontSize: "1.45rem", fontWeight: "800", color: "var(--jhub-blue)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {theme.title}
                </h3>
              </div>
              {/* Column 2: Description */}
              <p className="prog-desc" style={{ fontSize: "1.15rem", color: "var(--text-main)", margin: 0, lineHeight: "1.5", alignSelf: "center", textAlign: "left" }}>
                {theme.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Featured innovations</div>
        <h2 className="section-h2 green">Real solutions with real progress</h2>
        <div className="cards-grid">
          <article className="prog-card">
            <div className="prog-title green">AgriSense AI</div>
            <p className="prog-desc">
              A precision agriculture platform helping smallholders optimise inputs and yields.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">Agriculture · Prototype</span>
              <Link to="/innovation" className="prog-arrow">View Project →</Link>
            </div>
          </article>
          <article className="prog-card">
            <div className="prog-title">M-Twin Health</div>
            <p className="prog-desc">
              Digital twin systems and diagnostics for rural health and community care.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">Health · Pilot</span>
              <Link to="/innovation" className="prog-arrow">View Project →</Link>
            </div>
          </article>
          <article className="prog-card">
            <div className="prog-title red">TradeLink Africa</div>
            <p className="prog-desc">
              A cross-border marketplace that simplifies compliance for SMEs.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">Digital Trade · Market entry</span>
              <Link to="/innovation" className="prog-arrow">View Project →</Link>
            </div>
          </article>
        </div>
        <div className={styles['homepage-browse-section']}>
          <Link to="/innovation" className="btn-outline">Browse full portfolio</Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">How JHUB supports innovation</div>
        <h2 className="section-h2">Support at every stage</h2>
        <div className={styles['support-grid']}>
          {SUPPORT_STEPS.map((step) => (
            <article key={step.title} className={styles['support-card']}>
              <div
                className={styles['support-card-media']}
                style={{
                  backgroundImage: `${step.overlay}, url(${step.image})`,
                }}
              />
              <div className={styles['support-card-body']}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section section-innovations">
        <div className="section-eyebrow">Learn more about our innovations</div>
        <h2 className="section-h2">From groundbreaking ideas to community impact</h2>
        <div className="cards-grid" style={{ marginTop: "1.25rem" }}>
          {innovations.map((p) => (
            <Link
              key={p.id}
              to="/innovation/$slug"
              params={{ slug: p.slug || "" }}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <article className="prog-card" style={{ height: "100%", cursor: "pointer", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                {p.coverImageUrl ? (
                  <div style={{ height: "180px", overflow: "hidden", borderBottom: "1px solid var(--border-color)" }}>
                    <img
                      src={p.coverImageUrl}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div style={{ height: "180px", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0f2d59 0%, #1e1b4b 100%)", borderBottom: "1px solid var(--border-color)" }}>
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid-home" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="#ffffff" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-home)" />
                    </svg>
                    <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)", filter: "blur(10px)" }} />
                    <div style={{ position: "absolute", bottom: "-30px", right: "-10px", width: "140px", height: "140px", borderRadius: "50%", background: "radial-gradient(circle, rgba(15, 45, 89, 0.6) 0%, rgba(15, 45, 89, 0) 70%)", filter: "blur(10px)" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <span style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: "800", letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "8px", padding: "6px 16px", backdropFilter: "blur(4px)" }}>JHUB</span>
                    </div>
                  </div>
                )}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <div className="prog-title" style={{ marginTop: 0, fontSize: "1.25rem" }}>{p.title}</div>

                  {p.description && (
                    <p className="prog-desc" style={{ marginTop: "0.5rem", color: "#475569", fontSize: "0.95rem", flexGrow: 1 }}>
                      {p.description}
                    </p>
                  )}

                  <div className="prog-meta" style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
                    <span className="prog-arrow">
                      View project details →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {innovations.length === 0 && (
            <div
              className="prog-card"
              style={{ gridColumn: "1 / -1", textAlign: "center" }}
            >
              <p className="prog-desc">
                No innovations found.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="content-section story-section">
        <div className={styles['story-grid']}>
          <article className={styles['story-card']}>
            <div className="section-eyebrow">Success stories</div>
            <h2 className="section-h2">From idea to impact: EcoBriq</h2>
            <p className="section-p">
              EcoBriq used JHUB's incubation support to refine its product, secure funding and start commercial operations.
            </p>
            <div className={styles['story-stats']}>
              <div>
                <strong>25+</strong>
                <span>Jobs created</span>
              </div>
              <div>
                <strong>5</strong>
                <span>Pilot sites</span>
              </div>
              <div>
                <strong>120 tons</strong>
                <span>Waste repurposed</span>
              </div>
            </div>
            <Link to="/news" className="btn-outline">Read full story</Link>
          </article>
          <article className={styles['quote-card']}>
            <div className={styles['quote-mark']}>“</div>
            <p>
              JHUB's mentorship and incubation support helped us refine our solution and secure our first investment.
            </p>
            <div className={styles['quote-author']}>Carolyne W., Founder, EcoBriq</div>
          </article>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Visibility</div>
        <h2 className="section-h2">Upcoming events and latest news</h2>
        <div className={styles['event-news-grid']}>
          <div>
            <div className={styles['section-subtitle']}>Upcoming events</div>
            <div className={`cards-grid ${styles['news-grid']}`}>
              {events.slice(0, 3).map((event) => (
                <article key={event.id} className="prog-card news-card-compact">
                  <div className={styles['event-card-inner']}>
                    <div className={styles['event-date']}>
                      <div className={styles['event-day']}>{event.day}</div>
                      <div className={styles['event-month']}>{event.month}</div>
                    </div>
                    <div>
                      <div className={`prog-title ${event.titleColor}`} style={{ textAlign: "left" }}>{event.title}</div>
                      <p className="prog-desc" style={{ textAlign: "left" }}>{event.desc}</p>
                      {event.location && (
                        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem", textAlign: "left" }}>
                          <MapPin size={14} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="prog-meta" style={{ justifyContent: "flex-start", marginTop: "1rem" }}>
                    <Link to="/events" search={{ selectedId: event.id }} className="prog-arrow">Read →</Link>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/events" className="btn-outline" style={{ marginTop: "1.5rem" }}>View All Events</Link>
          </div>

          <div>
            <div className={styles['section-subtitle']}>Latest news</div>
            <div className={`cards-grid ${styles['news-grid']}`}>
              {news.slice(0, 3).map((post) => (
                <article key={post.id} className="prog-card news-card-compact">
                  <div className={`prog-title ${post.titleColor}`}>{post.title}</div>
                  <p className="prog-desc">{post.body}</p>
                  <div className="prog-meta">
                    <span className="prog-slots">{post.date}</span>
                    <Link to="/news" className="prog-arrow">Read →</Link>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/news" className="btn-outline" style={{ marginTop: "1.5rem" }}>Read More News</Link>
          </div>
        </div>
      </section>

      <PartnersSection compact />

      <section className={`content-section ${styles['newsletter-section']}`}>
        <div className={styles['newsletter-copy']}>
          <div className="section-eyebrow">Stay connected</div>
          <h2 className="section-h2">Get updates on innovations, events and opportunities</h2>
          <p className="section-p">
            Subscribe for the latest news, calls for applications and partner
            opportunities.
          </p>
        </div>
        <form className={styles['newsletter-form']} onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email address"
            className={styles['newsletter-input']}
            aria-label="Newsletter email"
          />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </section>
    </>
  );
}
