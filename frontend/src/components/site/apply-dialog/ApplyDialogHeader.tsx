import { CSSProperties } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ApplyDialogHeaderProps {
  source?: string;
  isInnovator?: boolean;
}

const dialogHeaderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  marginBottom: "1.5rem",
};

const dialogTitleStyle: CSSProperties = {
  fontSize: "1.5rem",
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

export function ApplyDialogHeader({ source, isInnovator }: ApplyDialogHeaderProps) {
  return (
    <DialogHeader style={dialogHeaderStyle}>
      <span style={dialogTagStyle}>Get Involved</span>
      <DialogTitle style={dialogTitleStyle}>
        {isInnovator ? "Submit Your Innovation Venture" : "Join the JHUB Africa Innovation Community"}
      </DialogTitle>
      <DialogDescription style={dialogDescriptionStyle}>
        {isInnovator
          ? "Provide details about your venture. Our team will review your proposal and get in touch with next steps."
          : "Tell us who you are and what you're working on. We connect innovators, students, and partners with tailored support."}
      </DialogDescription>
      {source && (
        <div style={sourceStyle}>
          Originating from: <strong>{source}</strong>
        </div>
      )}
    </DialogHeader>
  );
}
