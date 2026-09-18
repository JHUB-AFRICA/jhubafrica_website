import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import styles from "../../../styles/Admin.module.css";

interface PasswordFieldItemProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}

function PasswordFieldItem({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: PasswordFieldItemProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
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
        <Lock size={14} style={{ color: "var(--jhub-green)" }} />
        <span>{label}</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          required
          id={id}
          aria-label={label.replace("*", "").trim()}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={styles["input-style"]}
          style={{ height: "48px", borderRadius: "10px", paddingRight: "3rem" }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={disabled}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            color: "var(--text-muted)",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function ValidationIndicatorItem({ isValid, label }: { isValid: boolean; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        color: isValid ? "var(--jhub-green)" : "var(--text-muted)",
      }}
    >
      <CheckCircle2 size={16} style={{ color: isValid ? "var(--jhub-green)" : "#cbd5e1" }} />
      <span style={{ fontWeight: isValid ? 700 : 500 }}>{label}</span>
    </div>
  );
}

interface AdminPasswordFieldsProps {
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isMinLength: boolean;
  isMatch: boolean;
  disabled?: boolean;
}

export function AdminPasswordFields({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isMinLength,
  isMatch,
  disabled = false,
}: AdminPasswordFieldsProps) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
        <PasswordFieldItem
          id="admin-user-password"
          label="Initial Password *"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          disabled={disabled}
        />
        <PasswordFieldItem
          id="admin-user-confirm-password"
          label="Confirm Password *"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Re-enter password"
          disabled={disabled}
        />
      </div>

      {/* Password Live Validation Indicators */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
          padding: "0.85rem 1.15rem",
          backgroundColor: "rgba(15, 45, 89, 0.03)",
          borderRadius: "10px",
          border: "1px dashed var(--border-color)",
          fontSize: "0.85rem",
        }}
      >
        <ValidationIndicatorItem isValid={isMinLength} label="Minimum 8 characters" />
        <ValidationIndicatorItem isValid={isMatch} label="Passwords match" />
      </div>
    </>
  );
}
