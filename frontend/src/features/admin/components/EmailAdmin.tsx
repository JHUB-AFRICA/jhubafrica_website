import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { adminSendTestEmail } from "../../../../axios/api/email";
import { InputField } from "./InputField";
import styles from "../../../styles/Admin.module.css";

export function EmailAdmin() {
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSendTest = async (e: FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;

    setSending(true);
    setResultMsg(null);

    try {
      const res = await adminSendTestEmail(testEmail.trim());
      setResultMsg({
        type: "success",
        text: res.message || `Test email successfully dispatched to ${testEmail}!`,
      });
      setTestEmail("");
    } catch (err: any) {
      setResultMsg({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to dispatch test email. Please check your backend RESEND_API_KEY.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="content-section">
      <h2 style={{ marginBottom: "0.5rem" }}>Email Service Diagnostics</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
        Verify that the transactional email pipeline (Resend) is functioning and test delivery to any inbox.
      </p>

      <form onSubmit={handleSendTest} style={{ maxWidth: "560px", display: "grid", gap: "1rem" }}>
        <InputField
          required
          type="email"
          label="Test Recipient Email"
          placeholder="your.name@example.com"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className={styles["input-style"]}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={sending || !testEmail.trim()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: sending ? 0.65 : 1,
              cursor: sending ? "not-allowed" : "pointer",
            }}
          >
            {sending && <Loader2 className="animate-spin" size={16} />}
            <span>{sending ? "Sending Test Email..." : "Send Test Email"}</span>
          </button>
        </div>

        {resultMsg && (
          <div
            style={{
              padding: "0.85rem 1.15rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 500,
              backgroundColor: resultMsg.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${resultMsg.type === "success" ? "var(--jhub-green)" : "#ef4444"}`,
              color: resultMsg.type === "success" ? "#065f46" : "#991b1b",
            }}
          >
            {resultMsg.text}
          </div>
        )}
      </form>
    </section>
  );
}
