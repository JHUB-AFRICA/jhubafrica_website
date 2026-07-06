import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        <div className="footer-col">
          <div className="footer-col-title">About</div>
          <Link to="/about" className="footer-link">About JHUB</Link>
          <Link to="/about" className="footer-link">Mission</Link>
          <Link to="/about" className="footer-link">Team</Link>
          <Link to="/about" className="footer-link">Partners</Link>
          <Link to="/about" className="footer-link">Impact</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Innovations</div>
          <Link to="/innovation" className="footer-link">All Innovations</Link>
          <Link to="/for-innovators" className="footer-link">Submit Innovation</Link>
          <Link to="/innovation" className="footer-link">Support Needs</Link>
          <Link to="/innovation" className="footer-link">Featured Projects</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Opportunities</div>
          <Link to="/courses" className="footer-link">Courses</Link>
          <Link to="/programs" className="footer-link">Programs</Link>
          <Link to="/events" className="footer-link">Events</Link>
          <Link to="/for-students" className="footer-link">Volunteer</Link>
          <Link to="/for-students" className="footer-link">Mentorship</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Partner / Fund</div>
          <Link to="/support" className="footer-link">Sponsor Projects</Link>
          <Link to="/for-partners" className="footer-link">Partner with Us</Link>
          <Link to="/for-partners" className="footer-link">Portfolio Brief</Link>
          <Link to="/contact" className="footer-link">Contact Partnerships</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Contact</div>
          <p className="footer-text">JKUAT Main Campus, Juja, Kenya</p>
          <p className="footer-text">Tel: +254 67 52181/4</p>
          <a href="mailto:info.jhub@jkuat.ac.ke" className="footer-link">info.jhub@jkuat.ac.ke</a>
          <Link to="/contact" className="footer-link">Newsletter signup</Link>
        </div>
      </div>
      <div className="footer-bottom">JHUB Africa © {new Date().getFullYear()} · Innovation for Transformation</div>
    </footer>
  );
}
