import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function InputField({ label, style, ...rest }: InputFieldProps) {
  return (
    <div>
      {label && (
        <label style={{ display: "block", marginBottom: 6 }}>{label}</label>
      )}
      <input style={{ ...style }} {...rest} />
    </div>
  );
}

export default InputField;
