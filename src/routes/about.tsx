import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
    head: () => ({
        meta: [
            { title: "About — JHUB Africa" },
            { name: "description", content: "JHUB Africa is JKUAT's innovation hub — our mission, vision and the team building Africa's tech ecosystem." },
            { property: "og:title", content: "About — JHUB Africa" },
            { property: "og:description", content: "Our mission, vision and team." },
        ],
    }),
    component: AboutPage,
});

function AboutPage() {
    return (
        <>
            <header className="page-header">
                <h1>About <span style={{ color: "var(--jhub-green)" }}>JHUB Africa</span></h1>
                <p>The innovation hub of Jomo Kenyatta University of Agriculture and Technology — a place where ideas become products that serve Africa.</p>
            </header>

            <section className="feature-split">
                <div className="split-copy">
                    <h2>Our story</h2>
                    <p>JHUB Africa was established to bridge the gap between academic research and industry, giving students, researchers and entrepreneurs the structure, mentorship and networks needed to build real ventures.</p>
                    <p>We work at the intersection of technology, business and community to ensure innovation translates to economic and social impact.</p>
                    <ul>
                        <li>Founded within JKUAT to commercialise research</li>
                        <li>Multi-disciplinary teams across engineering, design and business</li>
                        <li>Open to JKUAT and non-JKUAT innovators alike</li>
                    </ul>
                </div>
                <div className="split-panel">
                    <div className="info-card blue"><h3>Mission</h3><p>To nurture an innovation-driven ecosystem that creates jobs and solves African challenges.</p></div>
                    <div className="info-card green"><h3 className="green">Vision</h3><p>To be Africa's leading university-anchored innovation hub.</p></div>
                    <div className="info-card"><h3 className="red">Values</h3><p>Integrity, collaboration, excellence and impact.</p></div>
                </div>
            </section>

            <section className="content-section" style={{ textAlign: "center" }}>
                <Link to="/contact" className="btn-primary">Get in touch</Link>
            </section>
        </>
    );
}