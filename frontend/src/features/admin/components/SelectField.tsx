import React, { useId } from "react";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function SelectField({
  label,
  style,
  id,
  children,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
      {label && (
        <label
          htmlFor={selectId}
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
      <select id={selectId} aria-label={rest["aria-label"] || label} style={{ ...style }} {...rest}>
        {children}
      </select>
    </div>
  );
}

export default SelectField;
