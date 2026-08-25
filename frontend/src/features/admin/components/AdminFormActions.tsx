import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

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
  const loadingLabel = isEditing || submitLabel.toLowerCase().includes("update") ? "Updating..." : "Saving...";

  return (
    <div
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
      }}
    >
      <button
        type="submit"
        className="btn-primary"
        disabled={submitting}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          opacity: submitting ? 0.65 : 1,
          cursor: submitting ? "not-allowed" : "pointer",
          transition: "opacity 0.2s ease, transform 0.15s, box-shadow 0.15s",
        }}
      >
        {submitting && <Loader2 className="animate-spin" size={16} />}
        <span>{submitting ? loadingLabel : submitLabel}</span>
      </button>
      {isEditing && onCancel && (
        <button
          type="button"
          className="btn-outline"
          onClick={onCancel}
          disabled={submitting}
          style={{
            opacity: submitting ? 0.65 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "opacity 0.2s ease",
          }}
        >
          {cancelLabel}
        </button>
      )}
      {children}
    </div>
  );
}
