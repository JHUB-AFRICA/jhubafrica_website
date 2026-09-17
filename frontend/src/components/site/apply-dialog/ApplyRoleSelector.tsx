import { CSSProperties } from "react";
import { ROLES, RoleOption } from "./types";

interface ApplyRoleSelectorProps {
  selectedRole: RoleOption;
  onSelectRole: (role: RoleOption) => void;
  disabled?: boolean;
}

const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "0.45rem",
  fontSize: "0.9rem",
  fontWeight: 700,
  color: "#334155",
};

const requiredStarStyle: CSSProperties = {
  color: "#b91c1c",
  marginLeft: "0.25rem",
};

export function ApplyRoleSelector({ selectedRole, onSelectRole, disabled }: ApplyRoleSelectorProps) {
  return (
    <div role="group" aria-labelledby="apply-role-label">
      <span id="apply-role-label" style={fieldLabelStyle}>
        I am applying as a<span style={requiredStarStyle}>*</span>
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {ROLES.map((role) => {
          const isSelected = selectedRole === role;
          const roleButtonStyle: CSSProperties = {
            padding: "0.6rem 1rem",
            borderRadius: "999px",
            border: isSelected ? "2px solid #0f766e" : "1px solid #d1d5db",
            backgroundColor: isSelected ? "#f0fdfa" : "#f8fafc",
            color: isSelected ? "#0f766e" : "#475569",
            fontWeight: isSelected ? 700 : 500,
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: "0.85rem",
            transition: "color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease",
          };

          return (
            <button
              key={role}
              type="button"
              disabled={disabled}
              onClick={() => onSelectRole(role)}
              style={roleButtonStyle}
            >
              {role}
            </button>
          );
        })}
      </div>
    </div>
  );
}
