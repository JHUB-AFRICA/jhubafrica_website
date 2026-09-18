import styles from "../../styles/IndividualInnovation.module.css";

interface TeamMember {
  id?: string;
  name: string;
  role: string;
}

interface InnovationTeamSectionProps {
  teamMembers?: TeamMember[];
}

const AVATAR_COLORS = [
  { bg: "#dbeafe", color: "#1e40af" },
  { bg: "#dcfce7", color: "#166534" },
  { bg: "#f3e8ff", color: "#6b21a8" },
  { bg: "#ffedd5", color: "#c2410c" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function InnovationTeamSection({ teamMembers }: InnovationTeamSectionProps) {
  return (
    <section id="team" className={styles['team-editorial-section']}>
      <span className={styles['section-eyebrow']} style={{ color: "#7c3aed" }}>
        Ecosystem Attribution
      </span>
      <h3 className={styles['support-title']}>Innovators &amp; Development Team</h3>

      {!teamMembers || teamMembers.length === 0 ? (
        <div className={styles['team-empty-box']}>
          💼 Team profiles and research attribution are maintained under the JHUB Africa Innovation Registry. For direct founder inquiries, connect via the JHUB desk.
        </div>
      ) : (
        <div className={styles['team-grid-editorial']}>
          {teamMembers.map((m, idx) => {
            const c = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div key={m.id || `${m.name}-${m.role}`} className={styles['team-card-editorial']}>
                <div
                  className={styles['team-avatar-editorial']}
                  style={{ backgroundColor: c.bg, color: c.color }}
                >
                  {getInitials(m.name)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0 }}>
                  <strong className={styles['team-name-editorial']}>{m.name}</strong>
                  <span className={styles['team-role-editorial']}>{m.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
