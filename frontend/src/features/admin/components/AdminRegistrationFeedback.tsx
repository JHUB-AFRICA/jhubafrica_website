import { CheckCircle2, AlertCircle } from "lucide-react";

interface AdminRegistrationFeedbackProps {
  err: string;
  success: string;
}

export function AdminRegistrationFeedback({ err, success }: AdminRegistrationFeedbackProps) {
  return (
    <>
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
    </>
  );
}
