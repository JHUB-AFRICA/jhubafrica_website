import { createFileRoute, Link } from "@tanstack/react-router";
import { getInnovationBySlug } from "../../axios/api/innovations";
import { InnovationItem } from "../types/innovations";

export const Route = createFileRoute("/innovation/$slug")({
  head: (ctx: any) => ({
    meta: [
      { title: "Innovation Details — JHUB Africa" },
      {
        name: "description",
        content: "Details about a specific JKUAT/JHUB Africa innovation.",
      },
    ],
  }),
  loader: async ({ params }) => {
    try {
      return await getInnovationBySlug(params.slug);
    } catch (err) {
      console.warn("Failed to load innovation details for slug:", params.slug, err);
      return null;
    }
  },
  component: InnovationDetailPage,
});

function InnovationDetailPage() {
  const innovation = Route.useLoaderData() as InnovationItem | null;

  if (!innovation) {
    return (
      <div style={{ padding: "6rem 2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", color: "var(--jhub-blue)", marginBottom: "1rem" }}>
          Innovation Project Not Found
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: "1.6" }}>
          The innovation project you are trying to view does not exist, has been removed, or there was a connection error.
        </p>
        <Link
          to="/innovation"
          style={{
            display: "inline-block",
            marginTop: "2rem",
            color: "var(--jhub-green)",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "1.05rem",
          }}
        >
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  // Render initials for team member profile circles
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color palette based on sector
  const getSectorStyle = (sector: string) => {
    const sec = sector.toLowerCase();
    if (sec.includes("agri") || sec.includes("farm") || sec.includes("food")) {
      return { gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)", color: "#065f46" };
    }
    if (sec.includes("health") || sec.includes("med") || sec.includes("bio")) {
      return { gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "#1e3a8a" };
    }
    if (sec.includes("tech") || sec.includes("soft") || sec.includes("cyber")) {
      return { gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", color: "#3b0764" };
    }
    return { gradient: "linear-gradient(135deg, #6b7280 0%, #374151 100%)", color: "#111827" };
  };

  const styleConfig = getSectorStyle(innovation.sector);

  return (
    <>
      <header className="page-header" style={{ position: "relative" }}>
        <Link
          to="/innovation"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--jhub-green)",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          ← Back to Portfolio
        </Link>
        <h1 style={{ marginTop: 0 }}>{innovation.title}</h1>
        <p>
          Discover how this project is addressing critical needs in the{" "}
          <strong>{innovation.sector}</strong> sector.
        </p>
      </header>

      <section className="content-section">
        {/* Dynamic Cover Image Banner */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "360px",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            background: innovation.coverImageUrl ? "#f1f5f9" : styleConfig.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {innovation.coverImageUrl ? (
            <img
              src={innovation.coverImageUrl}
              alt={innovation.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#fff", padding: "2rem" }}>
              <div style={{ fontSize: "4.5rem", marginBottom: "1rem" }}>💡</div>
              <h2 style={{ color: "#fff", margin: 0, fontSize: "2rem", fontWeight: 700 }}>
                {innovation.title}
              </h2>
              <span
                style={{
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  opacity: 0.8,
                }}
              >
                {innovation.sector} · {innovation.stage}
              </span>
            </div>
          )}
        </div>

        {/* Two-Column Problem and Solution Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          <div
            className="prog-card"
            style={{
              padding: "2rem",
              borderRadius: "14px",
              border: "1px solid var(--border-color)",
              background: "#fafafa",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#991b1b",
                letterSpacing: "1.5px",
                marginBottom: "0.5rem",
              }}
            >
              The Problem Statement
            </div>
            <h3 style={{ margin: "0 0 1rem 0", color: "#111" }}>What challenge does this address?</h3>
            <p style={{ lineHeight: "1.65", color: "#4b5563", margin: 0, fontSize: "1.05rem" }}>
              {innovation.problem}
            </p>
          </div>

          <div
            className="prog-card"
            style={{
              padding: "2rem",
              borderRadius: "14px",
              border: "1px solid #dcfce7",
              background: "#f0fdf4",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#166534",
                letterSpacing: "1.5px",
                marginBottom: "0.5rem",
              }}
            >
              The Proposed Solution
            </div>
            <h3 style={{ margin: "0 0 1rem 0", color: "#111" }}>How does this innovation solve it?</h3>
            <p style={{ lineHeight: "1.65", color: "#1e3a8a", margin: 0, fontSize: "1.05rem" }}>
              {innovation.solution}
            </p>
          </div>
        </div>

        {/* Fact Sheet bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "1.25rem 2rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            marginBottom: "3.5rem",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 200px" }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6, textTransform: "uppercase", display: "block" }}>
              Development Stage
            </span>
            <strong style={{ fontSize: "1.1rem", color: styleConfig.color }}>
              {innovation.stage}
            </strong>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.6, textTransform: "uppercase", display: "block" }}>
              Support Requirements
            </span>
            <strong style={{ fontSize: "1.1rem", color: "#0f172a" }}>
              {innovation.need}
            </strong>
          </div>
        </div>

        {/* Development Group Members Section */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="section-eyebrow">Development Team</div>
          <h2 className="section-h2" style={{ marginBottom: "1.5rem" }}>The group members building this project</h2>
          
          {!innovation.teamMembers || innovation.teamMembers.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                borderRadius: "12px",
                border: "1px dashed var(--border-color)",
                background: "#fafafa",
                color: "#64748b",
                textAlign: "center",
                fontSize: "0.95rem",
              }}
            >
              💼 Team directory details are currently being finalized. For direct inquiries or sponsorship profiles, reach out to the JHUB Africa desk.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {innovation.teamMembers.map((m, idx) => (
                <div
                  key={idx}
                  className="prog-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: 
                        idx % 3 === 0 ? "#dbeafe" :
                        idx % 3 === 1 ? "#dcfce7" :
                        "#f3e8ff",
                      color: 
                        idx % 3 === 0 ? "#1e40af" :
                        idx % 3 === 1 ? "#166534" :
                        "#6b21a8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    {getInitials(m.name)}
                  </div>
                  <div>
                    <strong style={{ color: "#1e293b", fontSize: "0.95rem", display: "block" }}>
                      {m.name}
                    </strong>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {m.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
