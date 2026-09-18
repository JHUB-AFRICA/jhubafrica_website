import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminLogin } from "../../../../../axios/api/admin/auth";
import { setAccessToken } from "../../../../../axios/axios";
import { AdminAuthHeader } from "./AdminAuthHeader";
import styles from "../../../../styles/Admin.module.css";

interface AdminLoginFormProps {
  onUnlocked: () => void | Promise<void>;
  onForgotPassword: () => void;
}

export function AdminLoginForm({ onUnlocked, onForgotPassword }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
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

  return (
    <div className={styles.authShell}>
      <div className={styles.authCard}>
        <AdminAuthHeader
          title="Admin"
          highlight="Access"
          subtitle="Sign in with your administrator credentials to manage news, events, and platform operations."
        />

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.authField}>
            <label htmlFor="admin-email" className={styles.authLabel}>
              Admin Email
            </label>
            <div className={styles.authInputWrapper}>
              <input
                id="admin-email"
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
                onClick={onForgotPassword}
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
