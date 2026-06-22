import React, { useState } from 'react';
import Home from './Home';
import Innovations from './Innovations'; // 1. Import your new module

function App() {
  // 2. State to track which page is currently active ('home' or 'innovations')
  const [currentPage, setCurrentPage] = useState<'home' | 'innovations'>('home');

  // Simple navbar styling
  const navStyles: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    padding: '15px 20px',
    backgroundColor: '#111',
    color: '#fff',
  };

  const linkStyles = (page: string): React.CSSProperties => ({
    cursor: 'pointer',
    fontWeight: currentPage === page ? 'bold' : 'normal',
    color: currentPage === page ? '#00bb77' : '#fff',
    textDecoration: 'none',
  });

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav style={navStyles}>
        <span
          style={linkStyles('home')}
          onClick={() => setCurrentPage('home')}
        >
          Home
        </span>
        <span
          style={linkStyles('innovations')}
          onClick={() => setCurrentPage('innovations')}
        >
          Innovations
        </span>
      </nav>

      {/* 3. Conditional Rendering Matrix */}
      {currentPage === 'home' && <Home />}
      {currentPage === 'innovations' && <Innovations />}
    </div>
  );
}

export default App;