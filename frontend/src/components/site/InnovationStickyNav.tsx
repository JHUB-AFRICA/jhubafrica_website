import type { InnovationItem } from "../../types/innovations";
import styles from "../../styles/IndividualInnovation.module.css";

interface InnovationStickyNavProps {
  innovation: InnovationItem;
}

export function InnovationStickyNav({ innovation }: InnovationStickyNavProps) {
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
      </div>
    </nav>
  );
}
