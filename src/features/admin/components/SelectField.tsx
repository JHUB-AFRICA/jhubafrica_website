import React from "react";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function SelectField({
  label,
  style,
  children,
  ...rest
}: SelectFieldProps) {
  return (
    <div>
      {label && (
        <label style={{ display: "block", marginBottom: 6 }}>{label}</label>
      )}
      <select style={{ ...style }} {...rest}>
        {children}
      </select>
    </div>
  );
}

export default SelectField;
