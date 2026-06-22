import React from 'react';

const Home: React.FC = () => {
    // Strategy-aligned Design System Styles
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#333',
            lineHeight: '1.6',
            backgroundColor: '#ffffff',
        },
        hero: {
            backgroundColor: '#f4f7f6', // Brand clean gray/teal tint
            padding: '80px 20px',
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            borderRadius: '12px',
            marginTop: '20px',
        },
        heroTitle: {
            fontSize: '2.8rem',
            color: '#006644', // Brand Green/Teal accent
            fontWeight: '800',
            marginBottom: '20px',
            maxWidth: '800px',
            margin: '0 auto 20px auto',
        },
        heroSubtitle: {
            fontSize: '1.25rem',
            color: '#555',
            maxWidth: '750px',
            margin: '0 auto 30px auto',
        },
        ctaGroup: {
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        primaryBtn: {
            backgroundColor: '#006644', // Primary Verb CTA
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer',
        },
        secondaryBtn: {
            backgroundColor: 'transparent',
            color: '#006644',
            border: '2px solid #006644',
            padding: '12px 24px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '6px',
            cursor: 'pointer',
        },
        section: {
            padding: '60px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        sectionTitle: {
            fontSize: '2rem',
            color: '#111',
            textAlign: 'center',
            marginBottom: '10px',
        },
        sectionSubtitle: {
            textAlign: 'center',
            color: '#666',
            marginBottom: '40px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
        },
        pathwayCard: {
            padding: '25px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'between',
            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        },
        cardTitle: {
            fontSize: '1.25rem',
            color: '#006644',
            marginBottom: '10px',
        },
        cardText: {
            fontSize: '0.95rem',
            color: '#555',
            marginBottom: '20px',
            flexGrow: 1,
        },
        cardCta: {
            color: '#006644',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: '0.95rem',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container}>
            {/* 1. Hero Section: Fixed repetitive copy per Strategy Sec 5.1 */}
            <header style={styles.hero} aria-label="Introduction">
                <h1 style={styles.heroTitle}>
                    Africa-focused innovation support for turning ideas, research, and student talent into market-ready solutions.
                </h1>
                <p style={styles.heroSubtitle}>
                    JHUB Africa connects innovators with incubation, mentorship, technical support, funding pathways,
                    industry partnerships, and visibility so that promising ideas can become scalable solutions.
                </p>
                <div style={styles.ctaGroup}>
                    <button style={styles.primaryBtn} onClick={() => alert('Routing to Submission Intake Form...')}>
                        Submit an Innovation
                    </button>
                    <button style={styles.secondaryBtn} onClick={() => alert('Routing to Partnerships/Funding form...')}>
                        Partner or Fund a Project
                    </button>
                </div>
            </header>

            {/* 2. Strategic Audience Pathways Section per Strategy Sec 4.3 */}
            <main>
                <section style={styles.section} aria-labelledby="pathways-heading">
                    <h2 id="pathways-heading" style={styles.sectionTitle}>Explore Your Pathway</h2>
                    <p style={styles.sectionSubtitle}>Select your role to see how JHUB Africa accelerates transformation.</p>

                    <div style={styles.grid}>
                        {/* Card 1: Innovator */}
                        <div style={styles.pathwayCard}>
                            <h3 style={styles.cardTitle}>I am an innovator</h3>
                            <p style={styles.cardText}>
                                Get incubation, mentorship, technical support, and funding connections to move your idea toward market readiness.
                            </p>
                            <span style={styles.cardCta} onClick={() => alert('Navigating to /innovators')}>
                                Submit your innovation &rarr;
                            </span>
                        </div>

                        {/* Card 2: Student */}
                        <div style={styles.pathwayCard}>
                            <h3 style={styles.cardTitle}>I am a student</h3>
                            <p style={styles.cardText}>
                                Join a community of builders, attend workshops, access courses, and work on real-world innovation challenges.
                            </p>
                            <span style={styles.cardCta} onClick={() => alert('Navigating to /students')}>
                                Explore student opportunities &rarr;
                            </span>
                        </div>

                        {/* Card 3: Funder */}
                        <div style={styles.pathwayCard}>
                            <h3 style={styles.cardTitle}>I am a funder</h3>
                            <p style={styles.cardText}>
                                Discover sponsor-ready projects with clear stages, impact areas, teams, and support needs.
                            </p>
                            <span style={styles.cardCta} onClick={() => alert('Navigating to /innovations')}>
                                View fundable projects &rarr;
                            </span>
                        </div>

                        {/* Card 4: Partner */}
                        <div style={styles.pathwayCard}>
                            <h3 style={styles.cardTitle}>I am a partner</h3>
                            <p style={styles.cardText}>
                                Co-create programs, mentor innovators, sponsor challenges, or collaborate on sector transformation.
                            </p>
                            <span style={styles.cardCta} onClick={() => alert('Navigating to /support-jhub')}>
                                Partner with JHUB &rarr;
                            </span>
                        </div>

                        {/* Card 5: Researcher */}
                        <div style={styles.pathwayCard}>
                            <h3 style={styles.cardTitle}>I am a researcher</h3>
                            <p style={styles.cardText}>
                                Commercialise research, connect with industry, and translate academic work into scalable solutions.
                            </p>
                            <span style={styles.cardCta} onClick={() => alert('Navigating to /contact')}>
                                Collaborate with us &rarr;
                            </span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;