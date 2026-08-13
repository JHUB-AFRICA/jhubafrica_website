import type { ReactNode } from "react";

interface AdminFormActionsProps {
  submitting: boolean;
  submitLabel: string;
  isEditing?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
  children?: ReactNode;
}

export function AdminFormActions({
  submitting,
  submitLabel,
  isEditing = false,
  onCancel,
  cancelLabel = "Cancel edit",
  children,
}: AdminFormActionsProps) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
      }}
    >
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
      {isEditing && onCancel && (
        <button
          type="button"
          className="btn-outline"
          onClick={onCancel}
          disabled={submitting}
        >
          {cancelLabel}
        </button>
      )}
      {children}
    </div>
  );
}
