import React, { useState } from 'react';

interface HomeProps {
  setPage: (page: 'home' | 'innovation') => void;
}

export default function Home({ setPage }: HomeProps) {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Digital infrastructure for modern ecosystems</span>
          <h1>Empowering African innovation with scalable, secure web platforms.</h1>
          <p>
            JHUB Africa delivers fast frontends, resilient APIs, and intelligent operations for teams building the next generation of regional digital products.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#features">
              View Platform Pillars
            </a>
            <button className="button button-secondary" onClick={() => setPage('innovation')}>
              Explore Innovation Pipelines
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-card">
            <strong>220+</strong>
            <span>Connecting creators, partners, and communities.</span>
          </div>
          <div className="hero-card accent-card">
            <strong>99.99%</strong>
            <span>Uptime-ready delivery through modern hosting and observability.</span>
          </div>
          <div className="hero-card">
            <strong>3x faster</strong>
            <span>Local experiences optimized for mobile, web, and data-rich workflows.</span>
          </div>
        </div>
      </section>

      <section id="features" className="content-section">
        <div className="section-intro">
          <p className="section-label">Platform capabilities</p>
          <h2>Built around flexible systems and African-first workflows.</h2>
          <p className="section-copy">
            From headless frontends to distributed APIs, JHUB Africa combines technology and design to help teams deploy fast, stay secure, and scale sustainably.
          </p>
        </div>

        <div className="cards-grid">
          <article className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Adaptive UI Layers</h3>
            <p>
              Customizable client surfaces that adapt automatically to mobile, tablet, and desktop users across diverse network conditions.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Resilient API Mesh</h3>
            <p>
              Distributed endpoints with strong authorization and real-time observability to power commerce, community, and content workflows.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Reliable Delivery</h3>
            <p>
              Production-ready builds, continuous deployment support, and compact asset delivery to keep digital experiences responsive and stable.
            </p>
          </article>
        </div>
      </section>

      <section id="contact" className="content-section contact-section">
        <div>
          <p className="section-label">Start a conversation</p>
          <h2>Launch your next digital platform.</h2>
          <p className="section-copy">
            Leave your contact details and we’ll send a response with tailored options, technology recommendations, and next-step guidance.
          </p>
        </div>

        <div className="contact-card">
          {!subscribed ? (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <label htmlFor="email">Your email address</label>
              <input id="email" type="email" placeholder="you@example.com" required />
              <button type="submit">Request details</button>
            </form>
          ) : (
            <div className="success-message">
              ✨ Thanks! Your request is received and we’ll follow up soon.
            </div>
          )}
        </div>
      </section>
    </>
  );
}