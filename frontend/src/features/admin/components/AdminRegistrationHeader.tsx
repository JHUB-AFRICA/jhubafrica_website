import { UserPlus, Sparkles } from "lucide-react";

export function AdminRegistrationHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 45, 89, 0.1) 100%)",
            display: "grid",
            placeItems: "center",
            color: "var(--jhub-green)",
          }}
        >
          <UserPlus size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--jhub-blue)" }}>
            Register New Administrator
          </h3>
          <p style={{ margin: "3px 0 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Provide staff account details. Newly added admins will receive full governance access immediately.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          background: "rgba(15, 45, 89, 0.05)",
          padding: "0.4rem 0.9rem",
          borderRadius: "8px",
          fontSize: "0.82rem",
          fontWeight: 700,
          color: "var(--jhub-blue)",
        }}
      >
        <Sparkles size={14} style={{ color: "var(--jhub-green)" }} />
        <span>Role: Super Admin</span>
      </div>
    </div>
  );
}
