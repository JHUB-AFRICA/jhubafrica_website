import React from 'react';

const Innovations: React.FC = () => {
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            padding: '40px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'system-ui, sans-serif',
        },
        title: {
            color: '#006644',
            fontSize: '2.5rem',
            marginBottom: '10px',
        },
        projectCard: {
            border: '1px solid #e0e0e0',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            backgroundColor: '#fafafa'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Project Catalogue</h1>
            <p>Explore current innovations undergoing incubation and development.</p>

            <div style={styles.projectCard}>
                <h3>🐝 Smart Nyuki Project</h3>
                <p>An IoT-based precision apiculture platform optimizing honey production across Africa.</p>
            </div>

            <div style={styles.projectCard}>
                <h3>📊 AfriData Platform</h3>
                <p>A centralized data warehouse driving regional analytics and localized insights.</p>
            </div>
        </div>
    );
};

export default Innovations;