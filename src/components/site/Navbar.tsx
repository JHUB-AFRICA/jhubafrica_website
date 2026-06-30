import { useState } from "react";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/jhublogo.jpeg.asset.json";

const NAV = [
    { to: "/", label: "Home" },
    { to: "/innovation", label: "Innovation" },
    { to: "/courses", label: "Courses" },
    { to: "/events", label: "Events" },
    { to: "/news", label: "News" },
    { to: "/about", label: "About" },
    { to: "/support", label: "Support" },
    { to: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="site-header">
            <Link to="/" className="brand-container" onClick={() => setOpen(false)}>
                <img
                    src={logoAsset.url}
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

            <Link to="/contact" className="nav-cta">Apply</Link>
        </header>
    );
}
