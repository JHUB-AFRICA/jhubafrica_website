import React from "react";

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextareaField({ label, style, ...rest }: TextareaFieldProps) {
  return (
    <div>
      {label && (
        <label style={{ display: "block", marginBottom: 6 }}>{label}</label>
      )}
      <textarea style={{ ...style }} {...rest} />
    </div>
  );
}

export default TextareaField;
