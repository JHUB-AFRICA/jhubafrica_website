import { useState, type FormEvent } from "react";
import { Loader2, Mail, Send } from "lucide-react";
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
      <div className={styles.adminSectionHeader}>
        <div className={styles.adminSectionTitleGroup}>
          <div className={styles.adminSectionHeadingRow}>
            <div className={styles.adminSectionIconBadge} style={{ backgroundColor: "#fff1f2", color: "#e11d48", border: "1px solid #fecdd3" }}>
              <Mail size={24} />
            </div>
            <h2 className={styles.adminSectionTitle}>Email Service Diagnostics</h2>
          </div>
          <p className={styles.adminSectionSubtitle}>
            Verify transactional email dispatch via Resend and test delivery directly to any recipient address.
          </p>
        </div>
        <span className={styles.adminSectionCountBadge} style={{ backgroundColor: "#fff1f2", color: "#9f1239", border: "1px solid #fecdd3" }}>
          Resend Pipeline
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm max-w-2xl">
        <form onSubmit={handleSendTest} className="grid gap-6">
          <InputField
            required
            type="email"
            label="Test Recipient Email"
            placeholder="your.name@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className={styles["input-style"]}
          />

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="btn-primary"
              disabled={sending || !testEmail.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                opacity: sending ? 0.65 : 1,
                cursor: sending ? "not-allowed" : "pointer",
                padding: "0.95rem 1.6rem",
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              <span>{sending ? "Sending Test Email..." : "Send Test Email"}</span>
            </button>
          </div>

          {resultMsg && (
            <div
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 600,
                backgroundColor: resultMsg.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                border: `1.5px solid ${resultMsg.type === "success" ? "var(--jhub-green)" : "#ef4444"}`,
                color: resultMsg.type === "success" ? "#065f46" : "#991b1b",
              }}
            >
              {resultMsg.text}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
