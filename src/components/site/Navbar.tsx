import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import logoAsset from "../../assets/jhublogo.jpeg";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/innovation", label: "Innovation" },
  { to: "/for-innovators", label: "For Innovators" },
  { to: "/for-students", label: "For Students" },
  { to: "/for-partners", label: "For Partners" },
  { to: "/courses", label: "Courses" },
  { to: "/events", label: "Events" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About" },
  { to: "/support", label: "Support" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const playApplySound = () => {
    if (typeof window === "undefined") return;

    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) return;

    const audioContext = new AudioContextCtor();
    void audioContext.resume();

    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);
    masterGain.connect(audioContext.destination);

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.35, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    for (let i = 0; i < noiseData.length; i += 1) {
      const envelope = 1 - i / noiseData.length;
      noiseData[i] = (Math.random() * 2 - 1) * envelope * 0.8;
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(900, audioContext.currentTime);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(masterGain);
    noiseSource.start();
    noiseSource.stop(audioContext.currentTime + 0.35);

    const toneOscillator = audioContext.createOscillator();
    toneOscillator.type = "sawtooth";
    toneOscillator.frequency.setValueAtTime(140, audioContext.currentTime);
    toneOscillator.frequency.exponentialRampToValueAtTime(95, audioContext.currentTime + 0.35);

    const toneGain = audioContext.createGain();
    toneGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    toneGain.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.015);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);

    toneOscillator.connect(toneGain);
    toneGain.connect(masterGain);
    toneOscillator.start();
    toneOscillator.stop(audioContext.currentTime + 0.35);

    window.setTimeout(() => {
      audioContext.close().catch(() => undefined);
    }, 400);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsHidden(true);
      } else {
        // Scrolling up
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`site-header ${isHidden ? "site-header--hidden" : ""}`}>
      <Link to="/" className="brand-container" onClick={() => setOpen(false)}>
        <img
          src={logoAsset}
          alt="JHUB Africa — Innovations for Transformation"
          className="brand-logo-img"
        />
      </Link>

      <button
        className="mobile-toggle"
        aria-label="Toggle navigation"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>

      <nav className={`site-nav ${open ? "" : "collapsed"} site-nav-desktop`}>
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="nav-link"
            activeProps={{ className: "nav-link active" }}
            activeOptions={{ exact: item.to === "/" }}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link
        to="/contact"
        className="nav-cta"
        onClick={() => {
          setOpen(false);
          playApplySound();
        }}
      >
        Apply
      </Link>
    </header>
  );
}
