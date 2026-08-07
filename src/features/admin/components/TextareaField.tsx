import React from "react";

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextareaField({ label, style, ...rest }: TextareaFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
      {label && (
        <label
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
      <textarea style={{ ...style }} {...rest} />
    </div>
  );
}

export default TextareaField;
