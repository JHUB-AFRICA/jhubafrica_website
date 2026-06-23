<<<<<<< HEAD
﻿import React, { useState } from 'react';
import './App.css';

import Navbar from './components/navbar';
import Footer from './components/footer';

import Home from './pages/home';
import Innovations from './pages/innovations';

function App() {
  const [page, setPage] = useState<'home' | 'innovation'>('home');

  return (
    <div className="app-shell">
      <Navbar currentPage={page} setPage={setPage} />

      <main>
        {page === 'home' ? (
          <Home setPage={setPage} />
        ) : (
          <Innovations />
        )}
      </main>

      <Footer />
=======
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
>>>>>>> d34dca0e126fb02ef86e1af9e99f78f31157bd4c
    </div>
  );
}

export default App;