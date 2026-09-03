import { useState, useEffect, type FormEvent } from "react";
import {
  Loader2,
  UserPlus,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getAdminUsers, createAdminUser, AdminAccountItem } from "../../../../axios/api/admin/users";
import styles from "../../../styles/Admin.module.css";

export function AdminUsersManager() {
  const [admins, setAdmins] = useState<AdminAccountItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notifications
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

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

  const isMinLength = password.length >= 8;
  const isMatch = password.length > 0 && password === confirmPassword;

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
      await loadAdmins();
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

      {/* Redesigned Admin Registration Card */}
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
                transition: "all 0.2s ease",
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

      {/* Existing Administrators Directory */}
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
    </section>
  );
}
