import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminLogin,
  requestPasswordReset,
  submitPasswordReset,
} from "../../../../axios/api/admin/auth";
import { setAccessToken } from "../../../../axios/axios";
import styles from "../../../styles/Admin.module.css";

interface AdminAuthCardProps {
  onUnlocked: () => void | Promise<void>;
}

export function AdminAuthCard({ onUnlocked }: AdminAuthCardProps) {
  const [authMode, setAuthMode] = useState<"login" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const resetTokenRef = useRef<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("resetToken");
      if (token) {
        resetTokenRef.current = token;
        setAuthMode("reset");
      }
    }
  }, []);

  async function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccessMsg("");
    try {
      const response = await adminLogin(email, password);
      setAccessToken(response.token);
      setErr("");
      toast.success("Welcome back! Signed in as administrator.");
      await onUnlocked();
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Invalid email or password.";
      setErr(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccessMsg("");
    setDevResetUrl(null);
    try {
      const response = await requestPasswordReset(email);
      const msg = response.message || "Password reset instructions have been sent.";
      setSuccessMsg(msg);
      toast.success(msg);
      if (response.devResetUrl) {
        setDevResetUrl(response.devResetUrl);
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Failed to request password reset.";
      setErr(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteReset(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSuccessMsg("");

    if (newPassword.length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setErr(msg);
      toast.error(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match.";
      setErr(msg);
      toast.error(msg);
      return;
    }

    if (!resetTokenRef.current) {
      const msg = "Reset token is missing. Please request a new password reset link.";
      setErr(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const response = await submitPasswordReset(resetTokenRef.current, newPassword);
      const msg = response.message || "Password updated successfully!";
      setSuccessMsg(msg);
      toast.success(msg);
      setNewPassword("");
      setConfirmPassword("");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setTimeout(() => {
        setAuthMode("login");
        resetTokenRef.current = null;
      }, 2500);
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Failed to reset password. The link may have expired.";
      setErr(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  if (authMode === "forgot") {
    return (
      <div className={styles.authShell}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authIconWrapper}>
              <ShieldCheck size={26} />
            </div>
            <h1 className={styles.authTitle}>
              Reset <span style={{ color: "#10b981" }}>Password</span>
            </h1>
            <p className={styles.authSubtitle}>
              Enter your administrator email to receive a secure password reset link.
            </p>
          </div>

          {successMsg ? (
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "14px",
                textAlign: "center",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div style={{ color: "#166534", fontSize: "0.95rem", lineHeight: 1.5 }}>
                {successMsg}
              </div>
              {devResetUrl && (
                <div style={{ marginTop: "0.5rem", padding: "0.75rem", backgroundColor: "#dcfce7", borderRadius: "8px", fontSize: "0.85rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.25rem", color: "#14532d" }}>Dev Quick Link:</div>
                  <a href={devResetUrl} style={{ color: "#15803d", wordBreak: "break-all" }}>
                    Click here to reset password directly
                  </a>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErr("");
                  setSuccessMsg("");
                }}
                className={styles.authSecondaryBtn}
                style={{ justifySelf: "center", marginTop: "0.5rem" }}
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className={styles.authForm}>
              <div className={styles.authField}>
                <label htmlFor="forgot-email" className={styles.authLabel}>
                  Administrator Email Address
                </label>
                <div className={styles.authInputWrapper}>
                  <input
                    id="forgot-email"
                    autoFocus
                    required
                    type="email"
                    placeholder="admin@jhub.africa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.authInput}
                    aria-label="Admin email"
                  />
                </div>
              </div>

              {err && (
                <div className={styles.authErrorBanner}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{err}</span>
                </div>
              )}

              <div className={styles.authActionsGroup}>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.authSubmitBtn}
                  style={{ flex: 1, marginTop: 0 }}
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErr("");
                    setSuccessMsg("");
                  }}
                  className={styles.authSecondaryBtn}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (authMode === "reset") {
    return (
      <div className={styles.authShell}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authIconWrapper}>
              <ShieldCheck size={26} />
            </div>
            <h1 className={styles.authTitle}>
              Set New <span style={{ color: "#10b981" }}>Password</span>
            </h1>
            <p className={styles.authSubtitle}>
              Choose a strong, secure password for your administrator account.
            </p>
          </div>

          {successMsg ? (
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "14px",
                textAlign: "center",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div style={{ color: "#166534", fontSize: "1rem", fontWeight: 700 }}>
                {successMsg}
              </div>
              <p style={{ color: "#15803d", fontSize: "0.9rem", margin: 0 }}>
                Redirecting you to sign in...
              </p>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  resetTokenRef.current = null;
                  setErr("");
                  setSuccessMsg("");
                }}
                className={styles.authSubmitBtn}
                style={{ justifySelf: "center", marginTop: "0.5rem" }}
              >
                Sign In Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleCompleteReset} className={styles.authForm}>
              <div className={styles.authField}>
                <label htmlFor="new-password" className={styles.authLabel}>
                  New Password (min. 8 characters)
                </label>
                <div className={styles.authInputWrapper}>
                  <input
                    id="new-password"
                    autoFocus
                    required
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.authInput}
                    style={{ paddingRight: "2.85rem" }}
                    aria-label="New password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={styles.authEyeBtn}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.authField}>
                <label htmlFor="confirm-password" className={styles.authLabel}>
                  Confirm New Password
                </label>
                <div className={styles.authInputWrapper}>
                  <input
                    id="confirm-password"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.authInput}
                    style={{ paddingRight: "2.85rem" }}
                    aria-label="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.authEyeBtn}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {err && (
                <div className={styles.authErrorBanner}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{err}</span>
                </div>
              )}

              <div className={styles.authActionsGroup}>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.authSubmitBtn}
                  style={{ flex: 1, marginTop: 0 }}
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  <span>{loading ? "Updating password..." : "Update Password"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErr("");
                    setSuccessMsg("");
                  }}
                  className={styles.authSecondaryBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Default: Login View
  return (
    <div className={styles.authShell}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authIconWrapper}>
            <ShieldCheck size={28} />
          </div>
          <h1 className={styles.authTitle}>
            Admin <span style={{ color: "#10b981" }}>Access</span>
          </h1>
          <p className={styles.authSubtitle}>
            Sign in with your administrator credentials to manage news, events, and platform operations.
          </p>
        </div>

        {successMsg && (
          <div className={styles.authSuccessBanner} style={{ marginBottom: "1.25rem" }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={tryUnlock} className={styles.authForm}>
          <div className={styles.authField}>
            <label htmlFor="admin-email" className={styles.authLabel}>
              Admin Email
            </label>
            <div className={styles.authInputWrapper}>
              <input
                id="admin-email"
                autoFocus
                required
                type="email"
                placeholder="admin@jhub.africa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.authInput}
                aria-label="Admin email"
              />
            </div>
          </div>

          <div className={styles.authField}>
            <div className={styles.authLabelRow}>
              <label htmlFor="admin-password" className={styles.authLabel}>
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("forgot");
                  setErr("");
                  setSuccessMsg("");
                }}
                className={styles.authForgotBtn}
              >
                Forgot password?
              </button>
            </div>
            <div className={styles.authInputWrapper}>
              <input
                id="admin-password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.authInput}
                style={{ paddingRight: "2.85rem" }}
                aria-label="Admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.authEyeBtn}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {err && (
            <div className={styles.authErrorBanner}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{err}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.authSubmitBtn}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            <span>{loading ? "Signing in..." : "Sign In to Admin"}</span>
          </button>
        </form>

        <Link to="/" className={styles.authFooterLink}>
          <ArrowLeft size={14} />
          <span>Return to public website</span>
        </Link>
      </div>
    </div>
  );
}
