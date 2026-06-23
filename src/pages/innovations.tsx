import React from 'react';

export default function Innovations() {
  return (
    <section id="solutions" className="feature-split">
      <div className="split-copy">
        <p className="section-label">Solution areas</p>
        <h2>Technology designed for the region, shipped with confidence.</h2>
        <p>
          JHUB Africa helps organisations launch digital products that serve African audiences with fast connectivity, easy integrations and strong security.
        </p>
        <ul>
          <li>Local-first architecture for smarter content delivery.</li>
          <li>Data-aware tooling for analytics, payments, and notifications.</li>
          <li>Collaborative design systems for effective product storytelling.</li>
        </ul>
      </div>

      <div className="split-panel">
        <div className="info-card">
          <h3>Innovation pipelines</h3>
          <p>
            Prioritize features using clear metrics, rapid testing, and developer-friendly deployment automation.
          </p>
        </div>
        <div className="info-card">
          <h3>Community impact</h3>
          <p>
            Bring teams, mentors, and creators together with tooling that simplifies onboarding and keeps systems aligned.
          </p>
        </div>
      </div>
    </section>
  );
}