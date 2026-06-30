import { Link } from "@tanstack/react-router";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-logo">JHUB Africa © {new Date().getFullYear()}</div>
                <div className="footer-links">
                    <Link to="/about" className="footer-link">About</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                    <Link to="/support" className="footer-link">Support</Link>
                    <Link to="/news" className="footer-link">News</Link>
                </div>
            </div>
        </footer>
    );
}
