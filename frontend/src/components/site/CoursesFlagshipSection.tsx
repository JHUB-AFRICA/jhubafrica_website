import { Network, Cpu, ExternalLink } from "lucide-react";
import inukaImg from "../../assets/inuka-hero-image.png";
import samsungImg from "../../assets/samsung.png";

const FLAGSHIP_PROGRAMS = [
  {
    id: "inuka",
    title: "Inuka Digital Leap",
    eyebrow: "DIGITAL INFRASTRUCTURE TALENT",
    tagline: "Building Kenya's Digital Infrastructure Talent Pipeline",
    description:
      "A transformative partnership between JKUAT, Kenya Pipeline Company (KPC) Foundation, and JHUB Africa bridging Kenya's broadband skills gap through intensive hands-on fibre optics, network infrastructure, broadband deployment, and direct employment pathways.",
    url: "https://inukadigitalleap.jhubafrica.com/",
    image: inukaImg,
    accentColor: "var(--jhub-green, #10b981)",
    tagBg: "rgba(16, 185, 129, 0.12)",
    highlights: [
      "Fibre Optics Splicing & Optical Network Testing",
      "Enterprise Routing, Switching & Network Engineering",
      "Broadband Infrastructure & Last-Mile Deployment",
      "Direct Industry Apprenticeships & Job Placement",
    ],
    partner: "JKUAT & Kenya Pipeline Company (KPC) Foundation",
    ctaText: "Explore Inuka Portal",
    icon: <Network size={26} color="#10b981" />,
  },
  {
    id: "sic",
    title: "Samsung Innovation Campus (SIC)",
    eyebrow: "GLOBAL 4IR TECH ACADEMY",
    tagline: "AI, IoT & Coding Skills for Future Innovators",
    description:
      "Empowering young Africans with core Fourth Industrial Revolution competencies including Artificial Intelligence (AI), Internet of Things (IoT), Big Data analytics, and Python programming with direct industry mentorship and globally accredited Samsung certificates.",
    url: "https://sic.jhubafrica.com/",
    image: samsungImg,
    accentColor: "#3b82f6",
    tagBg: "rgba(59, 130, 246, 0.12)",
    highlights: [
      "Applied Artificial Intelligence (AI) & Machine Learning",
      "Internet of Things (IoT) Microcontrollers & Sensors",
      "Big Data Analysis & Python Programming",
      "Globally Endorsed Samsung Professional Certificate",
    ],
    partner: "Samsung Electronics & JKUAT",
    ctaText: "Explore Samsung Campus",
    icon: <Cpu size={26} color="#3b82f6" />,
  },
];

export function CoursesFlagshipSection() {
  return (
    <>
      <div className="section-eyebrow">Featured Academies &amp; Programs</div>
      <h2 className="section-h2" style={{ marginBottom: "0.75rem" }}>
        Flagship Programs &amp; Specialized Academies
      </h2>
      <p className="section-p" style={{ marginBottom: "2.5rem" }}>
        Explore our specialized industry-partnered academies and digital infrastructure talent pipelines with dedicated portals, hands-on labs, and global credentials.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "2.5rem",
          marginBottom: "3.5rem",
        }}
      >
        {FLAGSHIP_PROGRAMS.map((prog, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={prog.id}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "22px",
                background: isEven ? "var(--bg-soft, #f8fafc)" : "#ffffff",
                border: "none",
                overflow: "hidden",
              }}
            >
              {/* Media Image Banner */}
              <div
                style={{
                  width: "100%",
                  height: "230px",
                  overflow: "hidden",
                  backgroundColor: "#0f172a",
                  position: "relative",
                }}
              >
                <img
                  src={prog.image}
                  alt={prog.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.25rem",
                    left: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.95)",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {prog.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: "#ffffff",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    {prog.eyebrow}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div
                style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 900,
                      color: "var(--jhub-blue, #07152b)",
                      margin: "0 0 0.5rem 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {prog.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      color: prog.accentColor,
                      margin: "0 0 1rem 0",
                    }}
                  >
                    {prog.tagline}
                  </p>
                  <p
                    style={{
                      fontSize: "0.93rem",
                      lineHeight: 1.65,
                      color: "var(--text-muted, #64748b)",
                      margin: "0 0 1.5rem 0",
                    }}
                  >
                    {prog.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div
                    style={{
                      display: "grid",
                      gap: "0.6rem",
                      marginBottom: "1.75rem",
                    }}
                  >
                    {prog.highlights.map((item, hIdx) => (
                      <div
                        key={hIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          fontSize: "0.88rem",
                          color: "var(--text-main, #1e293b)",
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: prog.accentColor,
                            flexShrink: 0,
                          }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Partner Attribution */}
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted, #64748b)",
                      borderTop: isEven ? "1px solid rgba(0,0,0,0.06)" : "1px solid var(--border-color, #e2e8f0)",
                      paddingTop: "1.1rem",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span>Partner:</span>
                    <strong style={{ color: "var(--jhub-blue, #07152b)" }}>{prog.partner}</strong>
                  </div>

                  {/* Action Button */}
                  <a
                    href={prog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.9rem 1.4rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      background: prog.accentColor,
                      borderColor: prog.accentColor,
                    }}
                  >
                    <span>{prog.ctaText}</span>
                    <ExternalLink size={17} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
