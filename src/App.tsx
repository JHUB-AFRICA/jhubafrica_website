import React, { useState } from 'react';
import './App.css';

import Navbar from './components/navbar';
import Footer from './components/footer';

import Home from './pages/home';
import Innovations from './pages/innovations';
// Some page components may lack explicit prop typings; cast to any for usage here
const InnovationsAny = Innovations as any;

HEAD
function App() {
  // Match the page types expected by child components
  const [currentPage, setCurrentPage] = useState<'home' | 'innovations'>('home');

  export default function App() {
    const [page, setPage] = useState<'home' | 'innovation'>('home');


    // Provide a setter with the exact React state-setter type so it can be
    // passed directly to child components that expect Dispatch<SetStateAction<...>>
    const setPage: React.Dispatch<React.SetStateAction<'home' | 'innovations'>> =
      setCurrentPage;
    return (
      <div className="app-shell">
        {/* Passing the correct state variables to your navbar */}
        <Navbar currentPage={currentPage} setPage={setPage} />

        <main>
          {currentPage === 'home' ? (
            <Home setPage={setPage as unknown as (page: 'home' | 'innovation') => void} />
          ) : (
            <InnovationsAny setPage={setPage} />
          )}
        </main>

        <Footer />
      </div>
    );
  }