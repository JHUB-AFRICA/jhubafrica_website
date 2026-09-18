import { Loader2, ShieldCheck, Mail } from "lucide-react";
import type { AdminAccountItem } from "../../../../axios/api/admin/users";
import styles from "../../../styles/Admin.module.css";

interface AdminUsersListProps {
  admins: AdminAccountItem[];
  loading: boolean;
}

export function AdminUsersList({ admins, loading }: AdminUsersListProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "var(--jhub-blue)" }}>
          Active Platform Administrators ({admins.length})
        </h3>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Accounts authorized with full system permissions
        </span>
      </div>

      {loading ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
          }}
        >
          <Loader2 className="animate-spin" size={28} style={{ margin: "0 auto 0.75rem", color: "var(--jhub-green)" }} />
          <div style={{ fontWeight: 600 }}>Loading administrator directory...</div>
        </div>
      ) : admins.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            background: "var(--bg-soft)",
            borderRadius: "16px",
            border: "1px dashed var(--border-color)",
          }}
        >
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
            No additional administrators found. Use the registration form above to provision new staff accounts.
          </p>
        </div>
      ) : (
        <ul className={styles["list-style"]}>
          {admins.map((adm) => {
            const displayName =
              adm.first_name || adm.last_name
                ? `${adm.first_name || ""} ${adm.last_name || ""}`.trim()
                : adm.email;

            const initials = (adm.first_name ? adm.first_name.charAt(0) : adm.email.charAt(0)).toUpperCase();

            return (
              <li
                key={adm.id}
                className={styles["list-item-style"]}
                style={{
                  padding: "1.15rem 1.5rem",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "1.15rem", alignItems: "center" }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, var(--jhub-green) 0%, #059669 100%)",
                      color: "#ffffff",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 900,
                      fontSize: "1.1rem",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "1.1rem", color: "var(--jhub-blue)", fontWeight: 800 }}>
                        {displayName}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "3px 9px",
                          borderRadius: "999px",
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                          backgroundColor: "rgba(16, 185, 129, 0.12)",
                          color: "var(--jhub-green)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <ShieldCheck size={12} />
                        {adm.role}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Mail size={13} style={{ opacity: 0.7 }} />
                        {adm.email}
                      </span>

                      {adm.created_at && (
                        <span style={{ opacity: 0.75 }}>
                          · Registered {new Date(adm.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#166534",
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: "var(--jhub-green)",
                      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)",
                    }}
                  />
                  <span>Active Privileges</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
