import styles from "../../../../styles/Admin.module.css";

interface AdminResetSuccessProps {
  successMsg: string;
  onReturnToLogin: () => void;
}

export function AdminResetSuccess({ successMsg, onReturnToLogin }: AdminResetSuccessProps) {
  return (
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
        onClick={onReturnToLogin}
        className={styles.authSubmitBtn}
        style={{ justifySelf: "center", marginTop: "0.5rem" }}
      >
        Sign In Now
      </button>
    </div>
  );
}
