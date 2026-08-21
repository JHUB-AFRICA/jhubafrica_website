import { Link } from "@tanstack/react-router";
import logoAsset from "../../assets/jhublogo.jpeg";
import { Mail, Phone, MapPin, Globe, Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        <div className="footer-col" style={{ maxWidth: "340px" }}>
          <img
            src={logoAsset}
            alt="JHUB Africa Logo"
            style={{
              height: "52px",
              width: "auto",
              objectFit: "contain",
              alignSelf: "flex-start",
              marginBottom: "0.6rem",
              borderRadius: "4px"
            }}
          />
          <p className="footer-text" style={{ fontSize: "0.92rem", lineHeight: "1.5", color: "var(--text-muted)", marginTop: "4px", marginBottom: "1rem" }}>
            Africa's premier innovation acceleration platform. Nurturing African innovations from conception to market success through mentorship, resources, and community support.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "1rem" }}>
            <a href="https://jhubafrica.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon social-globe" aria-label="Website">
              <Globe size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon social-linkedin" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon social-x" aria-label="X (formerly Twitter)">
              <svg style={{ width: "16px", height: "16px", fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon social-facebook" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon social-instagram" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon social-tiktok" aria-label="TikTok">
              <svg style={{ width: "16px", height: "16px", fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.11-.83 6.35 6.35 0 0 0-6.35 6.35 6.35 0 0 0 10.66 4.77 6.18 6.18 0 0 0 4.32-6V6.69a8.43 8.43 0 0 0 3.8 1.16V4.4a4.86 4.86 0 0 1-3.8-1.71z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Collaborate</div>
          <Link to="/innovation" className="footer-link">
            All Innovations
          </Link>
          <Link to="/for-innovators" className="footer-link">
            Submit Innovation
          </Link>
          <Link to="/for-partners" className="footer-link">
            Partner with Us
          </Link>
          <Link to="/for-partners" className="footer-link">
            Sponsor Projects
          </Link>
          <Link to="/for-partners" className="footer-link">
            Portfolio Brief
          </Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Opportunities</div>
          <Link to="/courses" className="footer-link">
            Courses
          </Link>
          <Link to="/courses" className="footer-link">
            Programs
          </Link>
          <Link to="/events" className="footer-link">
            Events
          </Link>
          <Link to="/for-students" className="footer-link">
            Volunteer
          </Link>
          <Link to="/for-students" className="footer-link">
            Mentorship
          </Link>
        </div>
        <div className="footer-col" style={{ minWidth: "220px" }}>
          <div className="footer-col-title">Contact Us</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "0.5rem" }}>
            <a href="mailto:info.jhub@jkuat.ac.ke" className="footer-link" style={{ display: "flex", alignItems: "center", gap: "0.5rem", wordBreak: "break-all" }}>
              <Mail size={16} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
              <span>info.jhub@jkuat.ac.ke</span>
            </a>
            <a href="tel:+254720268182" className="footer-link" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Phone size={16} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
              <span>+254 720 268182</span>
            </a>
            <div className="footer-text" style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0, color: "var(--text-main)" }}>
              <MapPin size={16} style={{ color: "var(--jhub-green)", flexShrink: 0 }} />
              <span>JKUAT, Juja, Kenya</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        JHUB Africa © {new Date().getFullYear()} · Innovation for Transformation
      </div>
    </footer>
  );
}
