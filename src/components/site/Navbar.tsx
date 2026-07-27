import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import ApplyDialog from "./ApplyDialog";
import logoAsset from "../../assets/jhublogo.jpeg";
import { ContactModal } from "./ContactModal";

const NAV = [
  { to: "/about", label: "About" },
  { to: "/innovation", label: "Innovations" },
  { to: "/for-innovators", label: "For Innovators" },
  { to: "/for-partners", label: "For Partners & Funders" },
  { to: "/courses", label: "Courses & Programs" },
  { to: "/news", label: "News & Events" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
    <>
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

        <nav className={`site-nav ${open ? "open" : "collapsed"}`}>
          <div className="mobile-nav-header">
            <img src={logoAsset} alt="JHUB Logo" className="mobile-nav-logo" />
            <button
              type="button"
              className="mobile-nav-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              activeProps={{ className: "nav-link active" }}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => {
                setOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <ApplyDialog triggerText="Get Involved" triggerVariant="default" />
        </div>
      </header>

      {open && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setOpen(false)}
        />
      )}

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source="Navbar Apply Button"
      />
    </>
  );
}
