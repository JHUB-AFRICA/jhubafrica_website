import { User } from "lucide-react";
import styles from "../../../styles/Admin.module.css";

interface AdminNameFieldsProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  disabled?: boolean;
}

export function AdminNameFields({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  disabled = false,
}: AdminNameFieldsProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
      <div>
        <label
          htmlFor="admin-user-first-name"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: "var(--jhub-blue)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          <User size={14} style={{ color: "var(--jhub-green)" }} />
          <span>First Name *</span>
        </label>
        <input
          required
          id="admin-user-first-name"
          aria-label="First Name"
          type="text"
          placeholder="e.g. John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={disabled}
          className={styles["input-style"]}
          style={{ height: "48px", borderRadius: "10px" }}
        />
      </div>

      <div>
        <label
          htmlFor="admin-user-last-name"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.82rem",
            fontWeight: 800,
            color: "var(--jhub-blue)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
          }}
        >
          <User size={14} style={{ color: "var(--jhub-green)" }} />
          <span>Last Name *</span>
        </label>
        <input
          required
          id="admin-user-last-name"
          aria-label="Last Name"
          type="text"
          placeholder="e.g. Kariuki"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={disabled}
          className={styles["input-style"]}
          style={{ height: "48px", borderRadius: "10px" }}
        />
      </div>
    </div>
  );
}
