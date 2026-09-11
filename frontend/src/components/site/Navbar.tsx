import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import logoAsset from "../../assets/jhublogo.jpeg";
import { ContactModal } from "./ContactModal";
import styles from "../../styles/Navbar.module.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const location = useLocation();
  const currentPath = location.pathname;

  const isRouteActive = (to?: string) => {
    if (!to) return false;
    if (to === "/") return currentPath === "/";
    return currentPath === to || currentPath.startsWith(`${to}/`);
  };

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

        {/* Desktop Navigation (visible only on desktop) */}
        <nav className={`${styles['site-nav']} ${styles['desktop-nav']}`}>
          {MENU_ITEMS.map((item) => {
            if (item.children) {
              const isChildActive = item.children.some((sub) => isRouteActive(sub.to));
              return (
                <div key={item.label} className={styles['nav-dropdown']}>
                  <button
                    className={`${styles['nav-link']} ${styles['nav-link--dropdown']} ${isChildActive ? styles.active : ''}`}
                    data-active={isChildActive ? "true" : undefined}
                  >
                    {item.label} <span style={{ marginLeft: "4px", fontSize: "0.55rem", verticalAlign: "middle" }}>▼</span>
                  </button>
                  <div className={styles['nav-submenu']}>
                    {item.children.map((sub) => {
                      const isActive = isRouteActive(sub.to);
                      return (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className={`${styles['nav-submenu-link']} ${isActive ? styles.active : ''}`}
                          activeProps={{ className: `${styles['nav-submenu-link']} ${styles.active}` }}
                          data-active={isActive ? "true" : undefined}
                          data-status={isActive ? "active" : undefined}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isActive = isRouteActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to!}
                className={`${styles['nav-link']} ${isActive ? styles.active : ''}`}
                activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
                activeOptions={{ exact: item.to === "/" }}
                data-active={isActive ? "true" : undefined}
                data-status={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions: CTA + Mobile Menu Toggle */}
        <div className={styles['header-actions']}>
          <Link
            to="/contact"
            className={styles['nav-cta']}
          >
            Get in Touch
          </Link>

          {/* Mobile Navigation Trigger & Sheet Drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className={`${styles['mobile-toggle']} ${open ? styles['mobile-toggle--open'] : ''}`}
                aria-label={open ? "Collapse navigation" : "Open navigation"}
              >
                <span className={styles['hamburger-box']}>
                  <span className={styles['hamburger-line']} />
                  <span className={styles['hamburger-line']} />
                  <span className={styles['hamburger-line']} />
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              hideCloseButton={true}
              className="w-[290px] sm:w-[330px] p-0 flex flex-col h-full bg-white border-l border-slate-200"
            >
              {/* Pinned Header */}
              <SheetHeader className="px-5 py-3.5 border-b border-slate-100 flex flex-row items-center justify-between text-left shrink-0">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
                  <img
                    src={logoAsset}
                    alt="JHUB Africa"
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <SheetTitle className="sr-only">JHUB Africa Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile site navigation menu
                </SheetDescription>

                {/* Animated 3-lines to X button to collapse sidebar */}
                <button
                  className={`${styles['mobile-toggle']} ${styles['mobile-toggle--open']}`}
                  onClick={() => setOpen(false)}
                  aria-label="Collapse navigation"
                >
                  <span className={styles['hamburger-box']}>
                    <span className={styles['hamburger-line']} />
                    <span className={styles['hamburger-line']} />
                    <span className={styles['hamburger-line']} />
                  </span>
                </button>
              </SheetHeader>

              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto px-5 py-3.5 overscroll-contain flex flex-col">
                <div className={styles['sidebar-section-title']}>JHUB AFRICA</div>
                <div className={styles['sidebar-links-group']}>
                  {MENU_ITEMS.map((item) => {
                    if (item.children) {
                      return (
                        <div key={item.label} className={styles['nav-dropdown']}>
                          <div className={styles['sidebar-group-title']}>
                            {item.label}
                          </div>
                          {item.children.map((sub) => {
                            const isActive = isRouteActive(sub.to);
                            return (
                              <Link
                                key={sub.to}
                                to={sub.to}
                                className={`${styles['nav-link']} ${isActive ? styles.active : ''}`}
                                activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
                                data-active={isActive ? "true" : undefined}
                                data-status={isActive ? "active" : undefined}
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => setOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      );
                    }

                    const isActive = isRouteActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to!}
                        className={`${styles['nav-link']} ${item.to === "/" ? styles['sidebar-home-link'] : ''} ${isActive ? styles.active : ''}`}
                        activeProps={{ className: `${styles['nav-link']} ${styles.active}` }}
                        activeOptions={{ exact: item.to === "/" }}
                        data-active={isActive ? "true" : undefined}
                        data-status={isActive ? "active" : undefined}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className={styles['sidebar-section-title']} style={{ marginTop: "0.85rem" }}>FOLLOW US</div>
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

                {/* Left-aligned Optimal CTA Button */}
                <div className={styles['sidebar-cta-container']}>
                  <Link
                    to="/contact"
                    className={styles['sidebar-cta-btn']}
                    onClick={() => setOpen(false)}
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source="Navbar Apply Button"
      />
    </>
  );
}
