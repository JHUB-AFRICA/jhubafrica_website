import { useState, type FormEvent } from "react";
import {
  Loader2,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { createAdminUser } from "../../../../axios/api/admin/users";
import styles from "../../../styles/Admin.module.css";

interface AdminRegistrationFormProps {
  onAdminCreated: () => void | Promise<void>;
}

export function AdminRegistrationForm({ onAdminCreated }: AdminRegistrationFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const isMinLength = password.length >= 8;
  const isMatch = password.length > 0 && password === confirmPassword;

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErr("");
    setSuccess("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!isMinLength) {
      setErr("Password must be at least 8 characters long.");
      return;
    }

    if (!isMatch) {
      setErr("Passwords do not match. Please verify both fields.");
      return;
    }

    try {
      setIsCreating(true);
      await createAdminUser({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "ADMIN",
      });

      setSuccess(`Administrator account for ${firstName.trim()} ${lastName.trim()} was successfully registered!`);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      await onAdminCreated();
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to register administrator account. Please check your details and try again.";
      setErr(errMsg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: "1px solid var(--border-color)",
        boxShadow: "0 10px 35px -5px rgba(15, 23, 42, 0.06)",
        padding: "2.25rem",
        marginBottom: "3rem",
      }}
    >
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

      {/* Feedback Banners */}
      {err && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            color: "#991b1b",
            fontSize: "0.92rem",
            marginBottom: "1.75rem",
            lineHeight: 1.5,
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px", color: "#dc2626" }} />
          <div>
            <strong style={{ display: "block", marginBottom: "2px" }}>Registration Error</strong>
            {err}
          </div>
        </div>
      )}

      {success && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            color: "#166534",
            fontSize: "0.92rem",
            marginBottom: "1.75rem",
            lineHeight: 1.5,
          }}
        >
          <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: "2px", color: "var(--jhub-green)" }} />
          <div>
            <strong style={{ display: "block", marginBottom: "2px" }}>Success</strong>
            {success}
          </div>
        </div>
      )}

      <form onSubmit={handleCreate} style={{ display: "grid", gap: "1.5rem" }}>
        {/* Row 1: Name fields */}
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
              className={styles["input-style"]}
              style={{ height: "48px", borderRadius: "10px" }}
            />
          </div>
        </div>

        {/* Row 2: Email */}
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
            className={styles["input-style"]}
            style={{ height: "48px", borderRadius: "10px" }}
          />
        </div>

        {/* Row 3: Passwords with show/hide toggles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label
              htmlFor="admin-user-password"
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
              <span>Initial Password *</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                required
                id="admin-user-password"
                aria-label="Initial Password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles["input-style"]}
                style={{ height: "48px", borderRadius: "10px", paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-user-confirm-password"
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
              <span>Confirm Password *</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                required
                id="admin-user-confirm-password"
                aria-label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles["input-style"]}
                style={{ height: "48px", borderRadius: "10px", paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isMinLength ? "var(--jhub-green)" : "var(--text-muted)" }}>
            <CheckCircle2 size={16} style={{ color: isMinLength ? "var(--jhub-green)" : "#cbd5e1" }} />
            <span style={{ fontWeight: isMinLength ? 700 : 500 }}>Minimum 8 characters</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isMatch ? "var(--jhub-green)" : "var(--text-muted)" }}>
            <CheckCircle2 size={16} style={{ color: isMatch ? "var(--jhub-green)" : "#cbd5e1" }} />
            <span style={{ fontWeight: isMatch ? 700 : 500 }}>Passwords match</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={isCreating || !isMinLength || !isMatch || !email.trim() || !firstName.trim() || !lastName.trim()}
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 700,
              opacity: isCreating || !isMinLength || !isMatch || !email.trim() || !firstName.trim() || !lastName.trim() ? 0.5 : 1,
              cursor: isCreating ? "not-allowed" : "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            {isCreating ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            <span>{isCreating ? "Registering Administrator..." : "Register Administrator"}</span>
          </button>

          {(firstName || lastName || email || password || confirmPassword) && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isCreating}
              className="btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                fontSize: "0.9rem",
              }}
            >
              <RotateCcw size={15} />
              <span>Reset Form</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
