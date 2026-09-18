import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { getAdminUsers, type AdminAccountItem } from "../../../../axios/api/admin/users";
import { AdminRegistrationForm } from "./AdminRegistrationForm";
import { AdminUsersList } from "./AdminUsersList";

export function AdminUsersManager() {
  const [admins, setAdmins] = useState<AdminAccountItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setAdmins(data);
    } catch (e) {
      console.error("Failed to load admin users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <section className="content-section" style={{ marginTop: "3.5rem" }}>
      {/* Section Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.3rem 0.85rem",
            borderRadius: "999px",
            background: "rgba(16, 185, 129, 0.12)",
            color: "var(--jhub-green)",
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "0.85rem",
          }}
        >
          <ShieldCheck size={15} />
          <span>Access &amp; Security</span>
        </div>

        <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--jhub-blue)", margin: "0 0 0.6rem 0", letterSpacing: "-0.02em" }}>
          Administrator <span style={{ color: "var(--jhub-green)" }}>Accounts</span>
        </h2>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem", maxWidth: "760px", lineHeight: 1.6 }}>
          Register and manage platform administrators with full privileges to curate news posts, events, flagship academies, innovations, and system communications.
        </p>
      </div>

      {/* Admin Registration Card */}
      <AdminRegistrationForm onAdminCreated={loadAdmins} />

      {/* Existing Administrators Directory */}
      <AdminUsersList admins={admins} loading={loading} />
    </section>
  );
}
