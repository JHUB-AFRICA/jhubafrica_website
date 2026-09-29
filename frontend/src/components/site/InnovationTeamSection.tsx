import styles from "../../styles/IndividualInnovation.module.css";

interface TeamMember {
  id?: string;
  name: string;
  role: string;
}

interface InnovationTeamSectionProps {
  teamMembers?: TeamMember[];
}

const DEFAULT_LEAD: TeamMember = {
  name: "Dr. Lawrence Nderu",
  role: "Principal Investigator & Project Lead",
};

const DEFAULT_SIX_MEMBERS: TeamMember[] = [
  { name: "Dr. Rehema Ndeda", role: "Co-Founder & Automation Lead" },
  { name: "Dr. Mwangi Karanja", role: "Innovative Technology & Data Science Lead" },
  { name: "Dr. William Murithi", role: "Business Development & Strategy Lead" },
  { name: "Dr. John Kinyuru", role: "Research & Innovation Development Lead" },
  { name: "Simon Mwangi", role: "Hub Manager & Partnerships Associate" },
  { name: "Ms. Daisy Ondwari", role: "Product Development Fellow" },
];

function getInitials(name: string): string {
  if (!name) return "";
  const cleaned = name
    .split(" ")
    .filter((part) => !/^(dr\.?|mr\.?|mrs\.?|ms\.?|prof\.?|eng\.?)$/i.test(part));

  const initials = cleaned
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return initials || name.slice(0, 2).toUpperCase();
}

export function InnovationTeamSection({ teamMembers }: InnovationTeamSectionProps) {
  // Identify lead: prefer Dr. Lawrence Nderu, or a member with "Principal Investigator" / "Lead" in their role
  const nderuMember = teamMembers?.find((m) => m.name.toLowerCase().includes("nderu"));
  const explicitLead = teamMembers?.find((m) => /principal investigator|project lead/i.test(m.role));

  const lead: TeamMember = nderuMember || explicitLead || DEFAULT_LEAD;

  // Other members: exclude whichever member was picked as the lead
  const otherCustomMembers = (teamMembers || []).filter(
    (m) => m !== nderuMember && m !== explicitLead
  );

  // If the innovation has its own team members, show them; otherwise fallback to the six core leads
  const members: TeamMember[] =
    otherCustomMembers.length > 0 ? otherCustomMembers : DEFAULT_SIX_MEMBERS;

  return (
    <section id="team" className={styles['team-editorial-section']}>
      <span className={styles['section-eyebrow']} style={{ color: "var(--jhub-green, #10b981)" }}>
        Ecosystem Attribution
      </span>
      <h3 className={styles['support-title']}>Innovators &amp; Development Team</h3>

      {/* Dr Lawrence Nderu, the principal investigator, opens the section on his own row with a 2px teal rule above him */}
      <div className={styles['team-lead-row']}>
        <div className={styles['team-lead-avatar']} title={lead.name}>
          {getInitials(lead.name)}
        </div>
        <div className={styles['team-lead-info']}>
          <h4 className={styles['team-lead-name']}>{lead.name}</h4>
          <span className={styles['team-lead-role']}>{lead.role}</span>
        </div>
      </div>

      {/* The other six people sit below in a three-column grid, separated by a thin pale hairline */}
      <div className={styles['team-grid-implied']}>
        {members.map((m, idx) => (
          <div key={m.id || `${m.name}-${idx}`} className={styles['team-grid-entry']}>
            <div className={styles['team-entry-avatar']} title={m.name}>
              {getInitials(m.name)}
            </div>
            <div className={styles['team-entry-info']}>
              <h5 className={styles['team-entry-name']}>{m.name}</h5>
              <span className={styles['team-entry-role']}>{m.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
