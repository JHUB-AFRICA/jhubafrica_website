import React from 'react';

const Home: React.FC = () => {
    // Inline styles for quick setup (feel free to move this to a CSS file)
    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            lineHeight: '1.6',
        },
        hero: {
            backgroundColor: '#f4f7f6',
            padding: '60px 20px',
            textAlign: 'center',
        },
        heroTitle: {
            fontSize: '2.5rem',
            color: '#007bff',
            marginBottom: '15px',
        },
        heroSubtitle: {
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '25px',
        },
        button: {
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        section: {
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px',
        },
        card: {
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }
    };

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.heroTitle}>Welcome to My Application</h1>
                <p style={styles.heroSubtitle}>A secure, fast, and scalable digital experience.</p>
                <button style={styles.button} onClick={() => alert('Getting Started!')}>
                    Get Started
                </button>
            </header>

            {/* Features Section */}
            <section style={styles.section}>
                <h2>Key Features</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h3>Dashboard</h3>
                        <p>Monitor your activities, track progress, and manage analytics in real-time.</p>
                    </div>
                    <div style={styles.card}>
                        <h3>High Security</h3>
                        <p>Built with modern architectural defensive principles to keep your data safe.</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Seamless Integration</h3>
                        <p>Easily connects with your existing workflows, tools, and repositories.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;