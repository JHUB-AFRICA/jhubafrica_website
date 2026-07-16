import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import ContactStrip from "../components/site/ContactStrip";
import PartnersSection from "../components/site/PartnersSection";
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpeg";
import image3 from "../assets/images/image3.jpeg";
import image4 from "../assets/images/image4.jpeg";
import image5 from "../assets/images/image5.jpeg";

const HERO_IMAGES = [image1, image2, image3, image4, image5];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JHUB Africa — Innovation Hub at JKUAT" },
      {
        name: "description",
        content:
          "JHUB Africa nurtures startups, builds digital skills and partners with industry to drive innovation across Africa.",
      },
      {
        property: "og:title",
        content: "JHUB Africa — Innovation Hub at JKUAT",
      },
      {
        property: "og:description",
        content:
          "Programs, courses and events that grow Africa's innovation ecosystem.",
      },
    ],
  }),
  component: Index,
});

const HOMEPAGE_METRICS = [
  { n: "1,000+", l: "Students Engaged" },
  { n: "150+", l: "Innovations Supported" },
  { n: "30+", l: "Active Projects" },
  { n: "15+", l: "Strategic Partners" },
];

function Index() {
  const [slides, setSlides] = useState<
    { id: number; imageIndex: number; state: "visible" | "entering" | "done" }[]
  >([{ id: 0, imageIndex: 0, state: "visible" }]);
  const [counts, setCounts] = useState(() => [0, 0, 0, 0]);
  const slideCounter = useRef(1);
  const currentImageIndex = useRef(0);

  useEffect(() => {
    const metricTargets = HOMEPAGE_METRICS.map((m) =>
      Number(m.n.replace(/[^0-9]/g, "")),
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

      // Add new slide off-screen to the right
      setSlides((prev) => [
        ...prev,
        { id: newId, imageIndex: nextIndex, state: "entering" as const },
      ]);

      // Next frame: start sliding it in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlides((prev) =>
            prev.map((s) =>
              s.state === "entering" ? { ...s, state: "visible" } : s
            )
          );
        });
      });

      // After transition ends, remove all old slides (keep only the newest)
      setTimeout(() => {
        setSlides((prev) => {
          const last = prev[prev.length - 1];
          return last ? [{ ...last, state: "visible" }] : prev;
        });
      }, 1400);
    }, 5000);

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
          <div className="hero-kicker">INNOVATION FOR TRANSFORMATION</div>
          {/* eslint-disable-next-line */}
          <h1 style={{ color: "#ffffff" }}>
            Africa's <span>Innovation Gateway</span> at JKUAT
          </h1>
          <p className="hero-sub">
            JHUB Africa turns student, research and entrepreneurial ideas into
            tested, investable and scalable solutions — through incubation,
            mentorship, technical support, partnerships and market access.
          </p>
        </section>

        <div className="stats-bar stats-on-image">
          {HOMEPAGE_METRICS.map((m, index) => (
            <div key={m.l} className="stat">
              <div className="stat-n">
                {counts[index].toLocaleString()}+
              </div>
              <div className="stat-l">{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="content-section">
        <div className="section-eyebrow">Choose your path</div>
        <h2 className="section-h2">Where do you fit in the ecosystem?</h2>
        <div className="cards-grid">
          <Link to="/innovation" className="prog-card audience-card">
            <div className="prog-title green">I have an idea or startup</div>
            <p className="prog-desc">
              Get mentorship, prototyping support, funding pathways and market
              access for your venture.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Submit innovation →</span>
            </div>
          </Link>
          <Link to="/courses" className="prog-card audience-card">
            <div className="prog-title">I want to learn or join</div>
            <p className="prog-desc">
              Join courses, the innovation club, hackathons, workshops and
              volunteer opportunities.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Explore courses →</span>
            </div>
          </Link>
          <Link to="/support" className="prog-card audience-card">
            <div className="prog-title red">I want to fund a project</div>
            <p className="prog-desc">
              Discover credible, fundable innovations across agritech, climate,
              AI and digital trade.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">View portfolio →</span>
            </div>
          </Link>
          <Link to="/for-partners" className="prog-card audience-card">
            <div className="prog-title">
              My organisation wants to collaborate
            </div>
            <p className="prog-desc">
              Co-design programs, challenge calls, pilots and applied research
              across sectors.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Partner with JHUB →</span>
            </div>
          </Link>
          <Link to="/for-innovators" className="prog-card audience-card">
            <div className="prog-title green">
              I want to commercialise research
            </div>
            <p className="prog-desc">
              Access labs, IP support, mentorship and pathways to translate
              research into ventures.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Collaborate →</span>
            </div>
          </Link>
          <Link to="/news" className="prog-card audience-card">
            <div className="prog-title red">I want to follow JHUB</div>
            <p className="prog-desc">
              Read news, impact stories and announcements from across the JHUB
              Africa community.
            </p>
            <div className="prog-meta">
              <span className="prog-arrow">Read stories →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">What we do</div>
        <h2 className="section-h2">Programs that move ideas to market</h2>
        <p className="section-p">
          From skills training to startup incubation, our programs are designed
          for the real challenges of building in Africa.
        </p>
        <div className="cards-grid">
          <div className="prog-card">
            <div className="prog-title green">Startup Incubator</div>
            <p className="prog-desc">
              Mentorship, workspace and seed support for early-stage founders
              building digital products.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">Rolling intake</span>
              <Link to="/innovation" className="prog-arrow">
                Learn more →
              </Link>
            </div>
          </div>
          <div className="prog-card">
            <div className="prog-title">Digital Skills Academy</div>
            <p className="prog-desc">
              Industry-aligned short courses in software, data, design and
              emerging technologies.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">Quarterly cohorts</span>
              <Link to="/courses" className="prog-arrow">
                View courses →
              </Link>
            </div>
          </div>
          <div className="prog-card">
            <div className="prog-title red">Applied Research</div>
            <p className="prog-desc">
              Collaborative R&D with JKUAT faculties and industry to solve
              real-world problems.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">Ongoing</span>
              <Link to="/innovation" className="prog-arrow">
                Read more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Featured portfolio</div>
        <h2 className="section-h2 green">
          Fundable innovations seeking support
        </h2>
        <p className="section-p">
          A snapshot of active projects in our pipeline. Each project lists its
          stage, sector and the type of support it needs.
        </p>
        <div className="cards-grid">
          <article className="prog-card">
            <div className="prog-title green">
              Smart Irrigation for Smallholders
            </div>
            <p className="prog-desc">
              IoT-based irrigation controllers reducing water use by up to 35%
              for smallholder farms in Kenya.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">
                Stage: Pilot · Needs: Pilot funding
              </span>
              <Link to="/support" className="prog-arrow">
                Sponsor →
              </Link>
            </div>
          </article>
          <article className="prog-card">
            <div className="prog-title">Swahili Voice Assistant</div>
            <p className="prog-desc">
              Speech models tuned for Kenyan Swahili and code-switching to power
              inclusive digital services.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">
                Stage: Prototype · Needs: Compute &amp; data
              </span>
              <Link to="/support" className="prog-arrow">
                Sponsor →
              </Link>
            </div>
          </article>
          <article className="prog-card">
            <div className="prog-title red">Cross-border SME Marketplace</div>
            <p className="prog-desc">
              Compliance-ready B2B marketplace connecting Kenyan SMEs to
              regional buyers under AfCFTA.
            </p>
            <div className="prog-meta">
              <span className="prog-slots">
                Stage: Market entry · Needs: Mentorship
              </span>
              <Link to="/support" className="prog-arrow">
                Sponsor →
              </Link>
            </div>
          </article>
        </div>
        <div className="homepage-browse-section">
          <Link to="/innovation" className="btn-outline">
            Browse full portfolio
          </Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Why JHUB</div>
        <h2 className="section-h2">Trusted, anchored and accountable</h2>
        <div className="cards-grid">
          <div className="prog-card">
            <div className="prog-title green">Anchored at JKUAT</div>
            <p className="prog-desc">
              Hosted by Jomo Kenyatta University of Agriculture and Technology,
              with access to faculties, labs and graduate talent.
            </p>
          </div>
          <div className="prog-card">
            <div className="prog-title">Transparent selection</div>
            <p className="prog-desc">
              Innovations are reviewed against clear criteria. Funded projects
              publish progress and impact reports.
            </p>
          </div>
          <div className="prog-card">
            <div className="prog-title red">Ecosystem partners</div>
            <p className="prog-desc">
              We work with industry, government, research institutions and
              development partners across the region.
            </p>
          </div>
        </div>
      </section>

      <PartnersSection />

      <ContactStrip />
    </>
  );
}
