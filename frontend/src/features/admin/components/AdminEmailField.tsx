import { Mail } from "lucide-react";
import styles from "../../../styles/Admin.module.css";

interface AdminEmailFieldProps {
  email: string;
  setEmail: (val: string) => void;
  disabled?: boolean;
}

export function AdminEmailField({ email, setEmail, disabled = false }: AdminEmailFieldProps) {
  return (
    <div>
      <label
        htmlFor="admin-user-email"
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
        <Mail size={14} style={{ color: "var(--jhub-green)" }} />
        <span>Official Administrator Email Address *</span>
      </label>
      <input
        required
        id="admin-user-email"
        aria-label="Official Administrator Email Address"
        type="email"
        placeholder="e.g. j.kariuki@jhubafrica.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={disabled}
        className={styles["input-style"]}
        style={{ height: "48px", borderRadius: "10px" }}
      />
    </div>
  );
}
