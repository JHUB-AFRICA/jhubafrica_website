import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import ContactStrip from "../components/site/ContactStrip";
import PartnersSection from "../components/site/PartnersSection";
import { IMPACT_METRICS } from "../data/impact";
import heroBg from "../assets/hero-bg.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JHUB Africa — Innovation Hub at JKUAT" },
      { name: "description", content: "JHUB Africa nurtures startups, builds digital skills and partners with industry to drive innovation across Africa." },
      { property: "og:title", content: "JHUB Africa — Innovation Hub at JKUAT" },
      { property: "og:description", content: "Programs, courses and events that grow Africa's innovation ecosystem." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <div
        className="hero-bg"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(8,20,45,0.72), rgba(8,20,45,0.55)), url(${heroBg.url})` }}
      >
        <section className="hero-section hero-on-image">
        <span className="hero-tag">Innovation for Transformation</span>
        <h1>Africa's <span>Innovation Gateway</span> at JKUAT</h1>
        <p className="hero-sub">
          JHUB Africa turns student, research and entrepreneurial ideas into tested, investable and scalable
          solutions — through incubation, mentorship, technical support, partnerships and market access.
        </p>
        <div className="hero-btns">
          <Link to="/innovation" className="btn-primary">Submit Your Innovation</Link>
          <Link to="/support" className="btn-outline">Sponsor a Project</Link>
        </div>
        </section>

        <div className="stats-bar stats-on-image">
        {IMPACT_METRICS.map((m) => (
          <div key={m.l} className="stat">
            <div className="stat-n">{m.n}</div>
            <div className="stat-l">{m.l}</div>
          </div>
        ))}
        </div>
      </div>

      <section className="content-section">
        <div className="section-eyebrow">Choose your path</div>
        <h2 className="section-h2">Where do you fit in the ecosystem?</h2>
        <div className="cards-grid">
          <Link to="/for-innovators" className="prog-card audience-card">
            <span className="prog-tag prog-tag-g">Innovator</span>
            <div className="prog-title green">I am an innovator</div>
            <p className="prog-desc">Get incubation, mentorship, technical support and funding connections to move your idea toward market readiness.</p>
            <div className="prog-meta"><span className="prog-arrow">Submit your innovation →</span></div>
          </Link>
          <Link to="/for-students" className="prog-card audience-card">
            <span className="prog-tag prog-tag-b">Student</span>
            <div className="prog-title">I am a student</div>
            <p className="prog-desc">Join a community of builders, attend workshops, access courses and work on real-world innovation challenges.</p>
            <div className="prog-meta"><span className="prog-arrow">Explore student opportunities →</span></div>
          </Link>
          <Link to="/for-partners" className="prog-card audience-card">
            <span className="prog-tag prog-tag-p">Funder</span>
            <div className="prog-title red">I am a funder</div>
            <p className="prog-desc">Discover sponsor-ready projects with clear stages, impact areas, teams and support needs.</p>
            <div className="prog-meta"><span className="prog-arrow">View fundable projects →</span></div>
          </Link>
          <Link to="/for-partners" className="prog-card audience-card">
            <span className="prog-tag prog-tag-b">Partner</span>
            <div className="prog-title">I am a partner</div>
            <p className="prog-desc">Co-create programs, mentor innovators, sponsor challenges or collaborate on sector transformation.</p>
            <div className="prog-meta"><span className="prog-arrow">Partner with JHUB →</span></div>
          </Link>
          <Link to="/for-innovators" className="prog-card audience-card">
            <span className="prog-tag prog-tag-g">Researcher</span>
            <div className="prog-title green">I am a researcher</div>
            <p className="prog-desc">Commercialise research, connect with industry and translate academic work into scalable solutions.</p>
            <div className="prog-meta"><span className="prog-arrow">Collaborate with us →</span></div>
          </Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">What we do</div>
        <h2 className="section-h2">Programs that move ideas to market</h2>
        <p className="section-p">From skills training to startup incubation, our programs are designed for the real challenges of building in Africa.</p>
        <div className="cards-grid">
          <div className="prog-card">
            <span className="prog-tag prog-tag-g">Incubation</span>
            <div className="prog-title green">Startup Incubator</div>
            <p className="prog-desc">Mentorship, workspace and seed support for early-stage founders building digital products.</p>
            <div className="prog-meta"><span className="prog-slots">Rolling intake</span><Link to="/innovation" className="prog-arrow">Learn more →</Link></div>
          </div>
          <div className="prog-card">
            <span className="prog-tag prog-tag-b">Training</span>
            <div className="prog-title">Digital Skills Academy</div>
            <p className="prog-desc">Industry-aligned short courses in software, data, design and emerging technologies.</p>
            <div className="prog-meta"><span className="prog-slots">Quarterly cohorts</span><Link to="/courses" className="prog-arrow">View courses →</Link></div>
          </div>
          <div className="prog-card">
            <span className="prog-tag prog-tag-p">Research</span>
            <div className="prog-title red">Applied Research</div>
            <p className="prog-desc">Collaborative R&D with JKUAT faculties and industry to solve real-world problems.</p>
            <div className="prog-meta"><span className="prog-slots">Ongoing</span><Link to="/innovation" className="prog-arrow">Read more →</Link></div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Featured portfolio</div>
        <h2 className="section-h2 green">Fundable innovations seeking support</h2>
        <p className="section-p">A snapshot of active projects in our pipeline. Each project lists its stage, sector and the type of support it needs.</p>
        <div className="cards-grid">
          <article className="prog-card">
            <span className="prog-tag prog-tag-g">Climate Smart Agriculture</span>
            <div className="prog-title green">Smart Irrigation for Smallholders</div>
            <p className="prog-desc">IoT-based irrigation controllers reducing water use by up to 35% for smallholder farms in Kenya.</p>
            <div className="prog-meta"><span className="prog-slots">Stage: Pilot · Needs: Pilot funding</span><Link to="/support" className="prog-arrow">Sponsor →</Link></div>
          </article>
          <article className="prog-card">
            <span className="prog-tag prog-tag-b">Big AI Ideas</span>
            <div className="prog-title">Swahili Voice Assistant</div>
            <p className="prog-desc">Speech models tuned for Kenyan Swahili and code-switching to power inclusive digital services.</p>
            <div className="prog-meta"><span className="prog-slots">Stage: Prototype · Needs: Compute &amp; data</span><Link to="/support" className="prog-arrow">Sponsor →</Link></div>
          </article>
          <article className="prog-card">
            <span className="prog-tag prog-tag-p">Digital Trade</span>
            <div className="prog-title red">Cross-border SME Marketplace</div>
            <p className="prog-desc">Compliance-ready B2B marketplace connecting Kenyan SMEs to regional buyers under AfCFTA.</p>
            <div className="prog-meta"><span className="prog-slots">Stage: Market entry · Needs: Mentorship</span><Link to="/support" className="prog-arrow">Sponsor →</Link></div>
          </article>
        </div>
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link to="/innovation" className="btn-outline">Browse full portfolio</Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-eyebrow">Why JHUB</div>
        <h2 className="section-h2">Trusted, anchored and accountable</h2>
        <div className="cards-grid">
          <div className="prog-card"><div className="prog-title green">Anchored at JKUAT</div><p className="prog-desc">Hosted by Jomo Kenyatta University of Agriculture and Technology, with access to faculties, labs and graduate talent.</p></div>
          <div className="prog-card"><div className="prog-title">Transparent selection</div><p className="prog-desc">Innovations are reviewed against clear criteria. Funded projects publish progress and impact reports.</p></div>
          <div className="prog-card"><div className="prog-title red">Ecosystem partners</div><p className="prog-desc">We work with industry, government, research institutions and development partners across the region.</p></div>
        </div>
      </section>

      <PartnersSection />

      <ContactStrip />
    </>
  );
}
