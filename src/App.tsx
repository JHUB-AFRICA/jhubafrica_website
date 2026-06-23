import React, { useState } from 'react';
import './App.css';

import Navbar from './components/navbar';
import Footer from './components/footer';

import Home from './pages/home';
import Innovations from './pages/innovations';

export default function App() {
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
    </div>
  );
}