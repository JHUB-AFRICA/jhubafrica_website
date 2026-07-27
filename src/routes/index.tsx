import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import ContactStrip from "../components/site/ContactStrip";
import PartnersSection from "../components/site/PartnersSection";
import { getEvents, getNews, type EventItem, type NewsPost } from "@/lib/api";
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpeg";
import image3 from "../assets/images/image3.jpeg";
import image4 from "../assets/images/image4.jpeg";
import image5 from "../assets/images/image5.jpeg";
import image6 from "../assets/images/images6.jpg";
import image7 from "../assets/images/images7.jpg";

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
  head: () => ({
    meta: [
      { title: "JHUB Africa — Innovation Hub at JKUAT" },
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
  }),
  loader: async () => {
    const [events, news] = await Promise.all([getEvents(), getNews()]);
    return { events, news };
  },
  component: Index,
});

const HOMEPAGE_METRICS = [
  { n: 2023, l: "Founded", suffix: "" },
  { n: 400, l: "Innovators Supported", suffix: "+" },
  { n: 150, l: "Innovations", suffix: "+" },
  { n: 1000, l: "Students Engaged", suffix: "+" },
  { n: 12, l: "Partners", suffix: "+" },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US");

function formatCount(value: number) {
  return numberFormatter.format(value);
}

function Index() {
  const { events, news }: { events: EventItem[]; news: NewsPost[] } =
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
      <div className="hero-bg">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`hero-bg-layer ${slide.state === "visible"
              ? "hero-bg-layer--visible"
              : "hero-bg-layer--entering"
              }`}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(8,20,45,0.72), rgba(8,20,45,0.55)), url(${HERO_IMAGES[slide.imageIndex]})`,
            }}
          />
        ))}
        <section className="hero-section hero-on-image">
          <div className="hero-kicker">Africa's Innovation Hub</div>
          {/* eslint-disable-next-line */}
          <h1>
            Africa's Innovation Hub for <span>Turning Ideas into Impact</span>
          </h1>
          <p className="hero-sub">
            JHUB Africa empowers innovators, builds solutions and partners across
            sectors to address Africa’s most pressing challenges and create
            sustainable economic growth.
          </p>
          <div className="hero-actions">
            <Link to="/innovation" className="btn-primary">
              Explore Innovations
            </Link>
            <Link to="/for-partners" className="btn-outline">
              Partner With Us
            </Link>
          </div>
        </section>

        <div className="stats-bar stats-on-image">
          {HOMEPAGE_METRICS.map((m, index) => (
            <div key={m.l} className="stat metric-card">
              <div className="stat-n">
                {formatCount(counts[index])}
                {m.suffix}
              </div>
              <div className="stat-l">{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="content-section">
        <div className="section-eyebrow">Audience-based navigation</div>
        <h2 className="section-h2">Find what matters to you</h2>
        <div className="cards-grid audience-grid">
          <Link to="/innovation" className="prog-card audience-card">
            <div className="prog-title green">Innovators</div>
            <p className="prog-desc">
              Get support to build, test and scale your solution.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Start Your Journey →</span>
            </div>
          </Link>
          <Link to="/for-students" className="prog-card audience-card">
            <div className="prog-title">Students</div>
            <p className="prog-desc">
              Learn, innovate and grow your ideas with JHUB.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Explore Programs →</span>
            </div>
          </Link>
          <Link to="/support" className="prog-card audience-card">
            <div className="prog-title red">Funders & Investors</div>
            <p className="prog-desc">
              Discover high-potential innovations ready for support.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">View Opportunities →</span>
            </div>
          </Link>
          <Link to="/for-partners" className="prog-card audience-card">
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
        <h2 className="section-h2">Themes driving our innovation portfolio</h2>
        <div className="focus-grid">
          <article className="focus-card">
            <div className="focus-icon">🌾</div>
            <h3>Climate Smart Agriculture</h3>
            <p>Digital tools for resilient, sustainable food systems.</p>
          </article>
          <article className="focus-card">
            <div className="focus-icon">🧭</div>
            <h3>Digital Twin Models</h3>
            <p>Real-time simulation and monitoring for systems and energy.</p>
          </article>
          <article className="focus-card">
            <div className="focus-icon">🌿</div>
            <h3>Green Digital Innovation</h3>
            <p>Climate-friendly products that reduce waste and improve efficiency.</p>
          </article>
          <article className="focus-card">
            <div className="focus-icon">🌐</div>
            <h3>Digital Trade</h3>
            <p>Platforms and tools that enable regional market access.</p>
          </article>
          <article className="focus-card">
            <div className="focus-icon">🤖</div>
            <h3>AI & Digital Transformation</h3>
            <p>Inclusive AI and automation for African enterprises.</p>
          </article>
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
        <div className="homepage-browse-section">
          <Link to="/innovation" className="btn-outline">Browse full portfolio</Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">How JHUB supports innovation</div>
        <h2 className="section-h2">Support at every stage</h2>
        <div className="support-grid">
          {SUPPORT_STEPS.map((step) => (
            <article key={step.title} className="support-card">
              <div
                className="support-card-media"
                style={{
                  backgroundImage: `${step.overlay}, url(${step.image})`,
                }}
              />
              <div className="support-card-body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section story-section">
        <div className="story-grid">
          <article className="story-card">
            <div className="section-eyebrow">Success stories</div>
            <h2 className="section-h2">From idea to impact: EcoBriq</h2>
            <p className="section-p">
              EcoBriq used JHUB's incubation support to refine its product, secure funding and start commercial operations.
            </p>
            <div className="story-stats">
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
          <article className="quote-card">
            <div className="quote-mark">“</div>
            <p>
              JHUB's mentorship and incubation support helped us refine our solution and secure our first investment.
            </p>
            <div className="quote-author">Carolyne W., Founder, EcoBriq</div>
          </article>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Visibility</div>
        <h2 className="section-h2">Upcoming events and latest news</h2>
        <div className="event-news-grid">
          <div>
            <div className="section-subtitle">Upcoming events</div>
            <div className="cards-grid news-grid">
              {events.slice(0, 3).map((event) => (
                <article key={event.id} className="prog-card news-card-compact">
                  <div className="event-card-inner">
                    <div className="event-date">
                      <div className="event-day">{event.day}</div>
                      <div className="event-month">{event.month}</div>
                    </div>
                    <div>
                      <div className={`prog-title ${event.titleColor}`}>{event.title}</div>
                      <p className="prog-desc">{event.desc}</p>
                    </div>
                  </div>
                  <div className="prog-meta">
                    <Link to="/events" className="prog-arrow">Read →</Link>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/events" className="btn-outline">View All Events</Link>
          </div>

          <div>
            <div className="section-subtitle">Latest news</div>
            <div className="cards-grid news-grid">
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
            <Link to="/news" className="btn-outline">Read More News</Link>
          </div>
        </div>
      </section>

      <PartnersSection compact />

      <section className="content-section newsletter-section">
        <div className="newsletter-copy">
          <div className="section-eyebrow">Stay connected</div>
          <h2 className="section-h2">Get updates on innovations, events and opportunities</h2>
          <p className="section-p">
            Subscribe for the latest news, calls for applications and partner
            opportunities.
          </p>
        </div>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email address"
            className="newsletter-input"
            aria-label="Newsletter email"
          />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </section>

      <ContactStrip />
    </>
  );
}
