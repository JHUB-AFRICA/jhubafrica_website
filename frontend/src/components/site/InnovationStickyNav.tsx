import { Share2, ExternalLink, MessageSquare } from "lucide-react";
import type { InnovationItem } from "../../types/innovations";
import styles from "../../styles/IndividualInnovation.module.css";

interface InnovationStickyNavProps {
  innovation: InnovationItem;
}

export function InnovationStickyNav({ innovation }: InnovationStickyNavProps) {
  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Explore "${innovation.title}" on the JHUB Africa Innovation Portfolio:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out "${innovation.title}" incubated at JHUB Africa: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={styles['sticky-nav-bar']}>
      <div className={styles['sticky-nav-inner']}>
        <div className={styles['sticky-nav-links']}>
          <button
            type="button"
            onClick={() => scrollToSection("overview")}
            className={styles['nav-anchor-link']}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("story")}
            className={styles['nav-anchor-link']}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Challenge &amp; Solution
          </button>
          {(innovation.traction || innovation.beneficiaries || innovation.impactEvidence) && (
            <button
              type="button"
              onClick={() => scrollToSection("impact")}
              className={styles['nav-anchor-link']}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Traction &amp; Impact
            </button>
          )}
          {innovation.need && (
            <button
              type="button"
              onClick={() => scrollToSection("support")}
              className={styles['nav-anchor-link']}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Support Needs
            </button>
          )}
          <button
            type="button"
            onClick={() => scrollToSection("team")}
            className={styles['nav-anchor-link']}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Innovator Team
          </button>
        </div>

        <div className={styles['sticky-nav-cta']}>
          <button
            type="button"
            onClick={handleShareTwitter}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
            title="Share on X"
          >
            <Share2 size={16} />
          </button>
          <button
            type="button"
            onClick={handleShareLinkedIn}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
            title="Share on LinkedIn"
          >
            <ExternalLink size={16} />
          </button>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
            title="Share on WhatsApp"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
