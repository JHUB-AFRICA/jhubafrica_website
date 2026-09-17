import React, { useId } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function InputField({ label, style, id, ...rest }: InputFieldProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
      {label && (
        <label
          htmlFor={inputId}
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
      <input id={inputId} aria-label={rest["aria-label"] || label} style={{ ...style }} {...rest} />
    </div>
  );
}

export default InputField;
