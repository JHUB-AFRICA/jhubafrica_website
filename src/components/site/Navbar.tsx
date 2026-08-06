import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import ApplyDialog from "./ApplyDialog";
import logoAsset from "../../assets/jhublogo.jpeg";
import { ContactModal } from "./ContactModal";
import styles from "../../styles/Navbar.module.css";

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
      <header className={`${styles['site-header']} ${isHidden ? styles['site-header--hidden'] : ""}`}>
        <Link to="/" className={styles['brand-container']} onClick={() => setOpen(false)}>
          <img
            src={logoAsset}
            alt="JHUB Africa — Innovations for Transformation"
            className={styles['brand-logo-img']}
          />
        </Link>

        <button
          className={styles['mobile-toggle']}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <nav className={`${styles['site-nav']} ${open ? styles.open : styles.collapsed}`}>
          <div className={styles['mobile-nav-header']}>
            <button
              type="button"
              className={styles['mobile-nav-close']}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className={styles['sidebar-section-title']}>JHUB AFRICA</div>
          <div className={styles['sidebar-links-group']}>
            <Link
              to="/"
              className={`${styles['nav-link']} ${styles['sidebar-home-link']}`}
              activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
              activeOptions={{ exact: true }}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={styles['nav-link']}
                activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
                activeOptions={{ exact: (item.to as string) === "/" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className={styles['sidebar-section-title']}>FOLLOW US</div>
          <div className={styles['sidebar-links-group']}>
            <a
              href="https://linkedin.com/company/jhub-africa"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['sidebar-social-link']}
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/jhubafrica"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['sidebar-social-link']}
            >
              X
            </a>
            <a
              href="https://github.com/JHUB-AFRICA"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['sidebar-social-link']}
            >
              GitHub
            </a>
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['sidebar-social-link']}
            >
              YouTube
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['sidebar-social-link']}
            >
              Facebook
            </a>
          </div>
        </nav>

        <div className={styles['nav-cta']}>
          <ApplyDialog triggerText="Get Involved" triggerVariant="default" />
        </div>
      </header>

      {open && (
        <div
          className={styles['mobile-nav-backdrop']}
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
