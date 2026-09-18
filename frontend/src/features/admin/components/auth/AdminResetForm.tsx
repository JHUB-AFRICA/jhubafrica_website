import { useState, useRef } from "react";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitPasswordReset } from "../../../../../axios/api/admin/auth";
import { AdminAuthHeader } from "./AdminAuthHeader";
import { AdminResetSuccess } from "./AdminResetSuccess";
import styles from "../../../../styles/Admin.module.css";

interface AdminResetFormProps {
  resetToken: string | null;
  onReturnToLogin: () => void;
}

function validateResetInput(password: string, confirm: string, token: string | null): string | null {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (password !== confirm) return "Passwords do not match.";
  if (!token) return "Reset token is missing. Please request a new password reset link.";
  return null;
}

interface ResetPasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  ariaLabel: string;
}

function ResetPasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  ariaLabel,
}: ResetPasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.authField}>
      <label htmlFor={id} className={styles.authLabel}>
        {label}
      </label>
      <div className={styles.authInputWrapper}>
        <input
          id={id}
          required
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.authInput}
          style={{ paddingRight: "2.85rem" }}
          aria-label={ariaLabel}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className={styles.authEyeBtn}
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export function AdminResetForm({ resetToken, onReturnToLogin }: AdminResetFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const activeRequestIdRef = useRef(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const validationError = validateResetInput(newPassword, confirmPassword, resetToken);
    if (validationError) {
      setErr(validationError);
      toast.error(validationError);
      return;
    }

    const requestId = ++activeRequestIdRef.current;
    setErr("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await submitPasswordReset(resetToken!, newPassword);
      if (requestId !== activeRequestIdRef.current) return;

      const msg = response.message || "Password updated successfully!";
      setSuccessMsg(msg);
      toast.success(msg);
      setNewPassword("");
      setConfirmPassword("");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setTimeout(() => {
        onReturnToLogin();
      }, 2500);
    } catch (error: any) {
      if (requestId !== activeRequestIdRef.current) return;
      console.error(error);
      const errMsg = error?.response?.data?.error || "Failed to reset password. The link may have expired.";
      setErr(errMsg);
      toast.error(errMsg);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setLoading(false);
      }
    }
  }

  return (
    <div className={styles.authShell}>
      <div className={styles.authCard}>
        <AdminAuthHeader
          title="Set New"
          highlight="Password"
          subtitle="Choose a strong, secure password for your administrator account."
        />

        {successMsg ? (
          <AdminResetSuccess
            successMsg={successMsg}
            onReturnToLogin={onReturnToLogin}
          />
        ) : (
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <ResetPasswordField
              id="new-password"
              label="New Password (min. 8 characters)"
              value={newPassword}
              onChange={setNewPassword}
              ariaLabel="New password"
            />

            <ResetPasswordField
              id="confirm-password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              ariaLabel="Confirm new password"
            />

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
                onClick={onReturnToLogin}
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
