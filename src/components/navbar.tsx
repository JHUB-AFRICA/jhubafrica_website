import React from 'react';

// 1. Define the interface for the props
interface NavbarProps {
  currentPage: 'home' | 'innovations';
  setPage: React.Dispatch<React.SetStateAction<'home' | 'innovations'>>;
}

// 2. Pass the interface to your component and destructure the props
export default function Navbar({ currentPage, setPage }: NavbarProps) {
  return (
    <nav>
      {/* Your existing navbar JSX goes here */}
      <button
        className={currentPage === 'home' ? 'active' : ''}
        onClick={() => setPage('home')}
      >
        Home
      </button>
      <button
        className={currentPage === 'innovations' ? 'active' : ''}
        onClick={() => setPage('innovations')}
      >
        Innovations
      </button>
    </nav>
  );
}