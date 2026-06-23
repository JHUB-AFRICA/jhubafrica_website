import React from 'react';

interface NavbarProps {
  currentPage: 'home' | 'innovation';
  setPage: (page: 'home' | 'innovation') => void;
}

export default function Navbar({ currentPage, setPage }: NavbarProps) {
  return (
    <header className="site-header">
      <div className="brand" onClick={() => setPage('home')}>
        <span className="brand-mark">JHUB</span> Africa
      </div>

      <nav className="site-nav">
        <button 
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
          onClick={() => setPage('home')}
        >
          Home
        </button>
        <button 
          className={`nav-link ${currentPage === 'innovation' ? 'active' : ''}`} 
          onClick={() => setPage('innovation')}
        >
          Innovation Pipelines
        </button>
        <a className="nav-link" href="#contact">Connect</a>
      </nav>
    </header>
  );
}