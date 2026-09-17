import React, { useId } from "react";

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextareaField({ label, style, id, ...rest }: TextareaFieldProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
      {label && (
        <label
          htmlFor={textareaId}
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--jhub-blue)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.15rem",
            display: "block",
          }}
        >
          {label}
        </label>
      )}
      <textarea id={textareaId} aria-label={rest["aria-label"] || label} style={{ ...style }} {...rest} />
    </div>
  );
}

export default TextareaField;
