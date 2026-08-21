import { useState } from "react";
import { Link } from "@tanstack/react-router";
import ApplyDialog from "./ApplyDialog";
import logoAsset from "../../assets/jhublogo.jpeg";
import { ContactModal } from "./ContactModal";
import styles from "../../styles/Navbar.module.css";

interface NavMenuItem {
  label: string;
  to?: string;
  children?: { to: string; label: string }[];
}

const MENU_ITEMS: NavMenuItem[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/innovation", label: "Innovations" },
  {
    label: "Programs",
    children: [
      { to: "/for-innovators", label: "For Innovators" },
      { to: "/for-students", label: "For Students" },
      { to: "/courses", label: "Courses & Programs" },
    ],
  },
  { to: "/for-partners", label: "Partners" },
  {
    label: "Community",
    children: [
      { to: "/news", label: "News & Blog" },
      { to: "/events", label: "Events" },
    ],
  },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <header className={styles['site-header']}>
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

        {/* Desktop Navigation (visible only on desktop) */}
        <nav className={`${styles['site-nav']} ${styles['desktop-nav']}`}>
          {MENU_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className={styles['nav-dropdown']}>
                  <button className={`${styles['nav-link']} ${styles['nav-link--dropdown']}`}>
                    {item.label} <span style={{ marginLeft: "4px", fontSize: "0.55rem", verticalAlign: "middle" }}>▼</span>
                  </button>
                  <div className={styles['nav-submenu']}>
                    {item.children.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className={styles['nav-submenu-link']}
                        activeProps={{ className: `${styles['nav-submenu-link']} ${styles.active}` }}
                        onClick={() => setOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to!}
                className={styles['nav-link']}
                activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Global CTA inside sticky header (visible only on desktop) */}
        <div className={styles['nav-cta']}>
          <ApplyDialog triggerText="Get Involved" triggerVariant="default" />
        </div>
      </header>

      {/* Mobile/Tablet Drawer Sidebar (visible only on mobile/tablet) */}
      <nav className={`${styles['mobile-sidebar']} ${open ? styles.open : styles.collapsed}`}>
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
          {MENU_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className={styles['nav-dropdown']}>
                  <div className={styles['sidebar-section-title']} style={{ marginTop: "1rem", marginBottom: "0.25rem", paddingLeft: "1rem" }}>
                    {item.label}
                  </div>
                  {item.children.map((sub) => (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      className={styles['nav-link']}
                      activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
                      onClick={() => setOpen(false)}
                      style={{ paddingLeft: "1.5rem" }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to!}
                className={item.to === "/" ? `${styles['nav-link']} ${styles['sidebar-home-link']}` : styles['nav-link']}
                activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
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

        <div className={styles['sidebar-cta-container']}>
          <ApplyDialog triggerText="Get Involved" triggerVariant="default" />
        </div>
      </nav>

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
