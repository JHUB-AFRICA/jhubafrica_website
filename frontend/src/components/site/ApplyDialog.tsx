"use client";

import { useState, type CSSProperties, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ApplyDialogProps } from "./apply-dialog/types";
import { useApplyDialog } from "./apply-dialog/useApplyDialog";
import { ApplyDialogHeader } from "./apply-dialog/ApplyDialogHeader";
import { ApplyRoleSelector } from "./apply-dialog/ApplyRoleSelector";
import { ApplyInnovatorFields } from "./apply-dialog/ApplyInnovatorFields";

const dialogContentStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.12)",
  border: "1px solid rgba(148, 163, 184, 0.12)",
  padding: "1.25rem",
  width: "min(92vw, 720px)",
  maxWidth: "720px",
  maxHeight: "85vh",
  overflowY: "auto",
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
  minHeight: "100px",
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
  minWidth: "12rem",
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

const requiredStarStyle: CSSProperties = {
  color: "#b91c1c",
  marginLeft: "0.25rem",
};

export default function ApplyDialog({
  triggerText,
  triggerVariant = "default",
  triggerClassName,
  triggerStyle,
  source,
}: ApplyDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    formData,
    status,
    feedback,
    updateField,
    handleRoleSelect,
    handleSubmit,
    handleOpenChange,
    isInnovator,
  } = useApplyDialog(setOpen, source);

  const disabled = status === "submitting";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          className={cn("cursor-pointer", triggerClassName)}
          style={triggerStyle}
        >
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent style={dialogContentStyle}>
        <ApplyDialogHeader source={source} isInnovator={isInnovator} />

        <form onSubmit={handleSubmit} style={formGridStyle}>
          <ApplyRoleSelector
            selectedRole={formData.role}
            onSelectRole={handleRoleSelect}
            disabled={disabled}
          />

          <div style={twoColumnGridStyle}>
            <div>
              <label htmlFor="apply-fullName" style={fieldLabelStyle}>
                Full Name<span style={requiredStarStyle}>*</span>
              </label>
              <input
                id="apply-fullName"
                type="text"
                required
                disabled={disabled}
                placeholder="Jane Doe"
                value={formData.fullName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("fullName", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="apply-email" style={fieldLabelStyle}>
                Email Address<span style={requiredStarStyle}>*</span>
              </label>
              <input
                id="apply-email"
                type="email"
                required
                disabled={disabled}
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("email", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label htmlFor="apply-phone" style={fieldLabelStyle}>
              Phone Number<span style={requiredStarStyle}>*</span>
            </label>
            <input
              id="apply-phone"
              type="tel"
              required
              disabled={disabled}
              placeholder="+254 700 000 000"
              value={formData.phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("phone", e.target.value)}
              style={inputStyle}
            />
          </div>

          {isInnovator && (
            <ApplyInnovatorFields
              formData={formData}
              updateField={updateField}
              disabled={disabled}
            />
          )}

          <div>
            <label htmlFor="apply-message" style={fieldLabelStyle}>
              {isInnovator ? "Team & Founder Background" : "Brief Motivation / Message"}
              <span style={requiredStarStyle}>*</span>
            </label>
            <textarea
              id="apply-message"
              required
              disabled={disabled}
              placeholder={
                isInnovator
                  ? "Share details about your core team members, affiliations, and technical background."
                  : "Tell us about your interests, project ideas, or partnership objectives."
              }
              value={formData.message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateField("message", e.target.value)}
              style={textareaStyle}
            />
          </div>

          {feedback && (
            <p
              style={{
                color: status === "error" ? "#b91c1c" : "#0f766e",
                fontSize: "0.95rem",
                marginTop: "0.35rem",
                fontWeight: 500,
              }}
            >
              {feedback}
            </p>
          )}

          <div style={actionRowStyle}>
            <Button
              type="submit"
              disabled={disabled}
              className="cursor-pointer font-bold"
              style={submitButtonStyle}
            >
              {status === "submitting" ? "Submitting..." : isInnovator ? "Submit Proposal" : "Submit Application"}
            </Button>
            <DialogClose asChild>
              <button type="button" disabled={disabled} style={cancelButtonStyle}>
                Cancel
              </button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
