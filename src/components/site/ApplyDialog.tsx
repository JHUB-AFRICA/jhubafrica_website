"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitApplication } from "@/lib/api";

const ROLES = ["Student", "Innovator", "Partner", "Sponsor", "Volunteer"] as const;

type RoleOption = (typeof ROLES)[number];

interface ApplyDialogProps {
  triggerText: string;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost";
  triggerClassName?: string;
  source?: string;
}

interface ApplyFormData {
  fullName: string;
  email: string;
  phone: string;
  role: RoleOption;
  message: string;
}

const initialForm: ApplyFormData = {
  fullName: "",
  email: "",
  phone: "",
  role: "Student",
  message: "",
};

export default function ApplyDialog({
  triggerText,
  triggerVariant = "default",
  triggerClassName,
  source,
}: ApplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ApplyFormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const dialogContentStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    boxShadow: "0 32px 80px rgba(15, 23, 42, 0.16)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: "2rem",
  };

  const dialogHeaderStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  };

  const dialogTitleStyle: CSSProperties = {
    fontSize: "2rem",
    lineHeight: 1.05,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  };

  const dialogDescriptionStyle: CSSProperties = {
    fontSize: "1rem",
    lineHeight: 1.8,
    color: "#475569",
    maxWidth: "38rem",
    margin: 0,
  };

  const dialogTagStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    padding: "0.35rem 0.85rem",
    backgroundColor: "#ecfdf5",
    color: "#0f766e",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
    width: "fit-content",
  };

  const sourceStyle: CSSProperties = {
    color: "#64748b",
    marginBottom: "1.25rem",
    fontSize: "0.95rem",
  };

  const formGridStyle: CSSProperties = {
    display: "grid",
    gap: "1rem",
  };

  const twoColumnGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1rem",
  };

  const fieldLabelStyle: CSSProperties = {
    display: "block",
    marginBottom: "0.45rem",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#334155",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "1rem 1.1rem",
    border: "1px solid #d1d5db",
    borderRadius: "18px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    background: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const textareaStyle: CSSProperties = {
    ...inputStyle,
    minHeight: "140px",
    resize: "vertical",
  };

  const actionRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "1.25rem",
  };

  const submitButtonStyle: CSSProperties = {
    minWidth: "14rem",
    padding: "0.95rem 1.25rem",
    backgroundColor: "#0f766e",
    color: "white",
    borderRadius: "999px",
    border: "none",
  };

  const cancelButtonStyle: CSSProperties = {
    border: "1px solid #cbd5e1",
    borderRadius: "999px",
    padding: "0.85rem 1.25rem",
    backgroundColor: "transparent",
    color: "#475569",
    fontWeight: 600,
    cursor: "pointer",
  };

  const feedbackStyle: CSSProperties = {
    color: status === "error" ? "#b91c1c" : "#0f766e",
    fontSize: "0.95rem",
    marginTop: "0.35rem",
  };

  const requiredStarStyle: CSSProperties = {
    color: "#b91c1c",
    marginLeft: "0.25rem",
  };

  useEffect(() => {
    if (!open && status === "success") {
      setFormData(initialForm);
      setStatus("idle");
      setFeedback("");
    }
  }, [open, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setFeedback("Please fill out all fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setFeedback("Sending your request...");

    try {
      await submitApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        message: formData.message.trim(),
        source,
      });
      setStatus("success");
      setFeedback("Thanks! We received your request and will respond soon.");
      setTimeout(() => setOpen(false), 1400);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setFeedback("Unable to send your request right now. Please try again later.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={triggerVariant} className={triggerClassName}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl" style={dialogContentStyle}>
        <DialogHeader style={dialogHeaderStyle}>
          <DialogTitle style={dialogTitleStyle}>Apply to connect with JHUB Africa</DialogTitle>
          <DialogDescription style={dialogDescriptionStyle}>
            Share your details and how you'd like to work with us. We’ll save your request and notify the team.
          </DialogDescription>
        </DialogHeader>

        <span style={dialogTagStyle}>Apply form</span>
        {source ? <p style={sourceStyle}>Context: {source}</p> : null}

        <form onSubmit={handleSubmit} style={formGridStyle}>
          <div style={twoColumnGridStyle}>
            <label style={{ display: "grid", gap: "0.5rem" }}>
                <span style={fieldLabelStyle}>Full name<span style={requiredStarStyle}>*</span></span>
              <input
                required
                name="fullName"
                value={formData.fullName}
                onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                placeholder="First and last name"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.5rem" }}>
              <span style={fieldLabelStyle}>Email address<span style={requiredStarStyle}>*</span></span>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </label>
          </div>

          <div style={twoColumnGridStyle}>
            <label style={{ display: "grid", gap: "0.5rem" }}>
              <span style={fieldLabelStyle}>Phone number<span style={requiredStarStyle}>*</span></span>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                placeholder="+254 7XX XXX XXX"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "grid", gap: "0.5rem" }}>
              <span style={fieldLabelStyle}>I am a<span style={requiredStarStyle}>*</span></span>
              <select
                value={formData.role}
                onChange={(event) => setFormData({ ...formData, role: event.target.value as RoleOption })}
                style={inputStyle}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label style={{ display: "grid", gap: "0.5rem" }}>
            <span style={fieldLabelStyle}>Message<span style={requiredStarStyle}>*</span></span>
            <textarea
              required
              name="message"
              value={formData.message}
              onChange={(event) => setFormData({ ...formData, message: event.target.value })}
              placeholder="Tell us what you need and how we can help"
              rows={4}
              style={textareaStyle}
            />
          </label>

          {feedback ? (
            <p style={feedbackStyle}>{feedback}</p>
          ) : null}

          <div style={actionRowStyle}>
            <Button type="submit" variant="default" style={submitButtonStyle} disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Submit request"}
            </Button>
            <DialogClose asChild>
              <button type="button" style={cancelButtonStyle}>
                Cancel
              </button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "1rem 1.1rem",
  border: "1px solid #d1d5db",
  borderRadius: 18,
  fontSize: "0.95rem",
  fontFamily: "inherit",
  background: "#f8fafc",
  color: "#0f172a",
  outline: "none",
  boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
};
