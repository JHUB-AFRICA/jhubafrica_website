import { useState } from "react";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { requestPasswordReset } from "../../../../../axios/api/admin/auth";
import { AdminAuthHeader } from "./AdminAuthHeader";
import styles from "../../../../styles/Admin.module.css";

interface AdminForgotFormProps {
  onReturnToLogin: () => void;
}

export function AdminForgotForm({ onReturnToLogin }: AdminForgotFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <div className={styles.authShell}>
      <div className={styles.authCard}>
        <AdminAuthHeader
          title="Reset"
          highlight="Password"
          subtitle="Enter your administrator email to receive a secure password reset link."
        />

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
              onClick={onReturnToLogin}
              className={styles.authSecondaryBtn}
              style={{ justifySelf: "center", marginTop: "0.5rem" }}
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.authField}>
              <label htmlFor="forgot-email" className={styles.authLabel}>
                Administrator Email Address
              </label>
              <div className={styles.authInputWrapper}>
                <input
                  id="forgot-email"
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
                onClick={onReturnToLogin}
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
