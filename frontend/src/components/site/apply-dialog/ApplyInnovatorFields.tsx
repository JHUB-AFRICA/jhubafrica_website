import { CSSProperties, ChangeEvent } from "react";
import { ApplyFormData } from "./types";

interface ApplyInnovatorFieldsProps {
  formData: ApplyFormData;
  updateField: (field: keyof ApplyFormData, value: any) => void;
  disabled?: boolean;
}

const twoColumnGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "1rem",
};

const fieldLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "0.45rem",
  fontSize: "0.9rem",
  fontWeight: 700,
  color: "#334155",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "1rem 1.1rem",
  border: "1px solid #d1d5db",
  borderRadius: "18px",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  background: "#f8fafc",
  color: "#0f172a",
  outline: "none",
  boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: "100px",
  resize: "vertical",
};

const requiredStarStyle: CSSProperties = {
  color: "#b91c1c",
  marginLeft: "0.25rem",
};

const STAGES = ["Concept", "Prototype", "Pilot", "Market entry", "Scale"] as const;

export function ApplyInnovatorFields({ formData, updateField, disabled }: ApplyInnovatorFieldsProps) {
  return (
    <div style={{ display: "grid", gap: "1rem", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
      <div>
        <label htmlFor="apply-innovationTitle" style={fieldLabelStyle}>
          Innovation Title<span style={requiredStarStyle}>*</span>
        </label>
        <input
          id="apply-innovationTitle"
          type="text"
          disabled={disabled}
          placeholder="e.g. Smart Irrigation Sensor"
          value={formData.innovationTitle || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("innovationTitle", e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={twoColumnGridStyle}>
        <div>
          <label htmlFor="apply-sector" style={fieldLabelStyle}>
            Sector<span style={requiredStarStyle}>*</span>
          </label>
          <input
            id="apply-sector"
            type="text"
            disabled={disabled}
            placeholder="e.g. Agritech, Healthtech, FinTech"
            value={formData.sector || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField("sector", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="apply-stage" style={fieldLabelStyle}>
            Current Stage<span style={requiredStarStyle}>*</span>
          </label>
          <select
            id="apply-stage"
            disabled={disabled}
            value={formData.stage || "Concept"}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              updateField("stage", e.target.value as ApplyFormData["stage"])
            }
            style={inputStyle}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="apply-problem" style={fieldLabelStyle}>
          Problem Statement<span style={requiredStarStyle}>*</span>
        </label>
        <textarea
          id="apply-problem"
          disabled={disabled}
          placeholder="What specific challenge or market failure does your project address?"
          value={formData.problem || ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateField("problem", e.target.value)}
          style={textareaStyle}
        />
      </div>

      <div>
        <label htmlFor="apply-solution" style={fieldLabelStyle}>
          Proposed Solution<span style={requiredStarStyle}>*</span>
        </label>
        <textarea
          id="apply-solution"
          disabled={disabled}
          placeholder="How does your innovation solve this problem in a novel or scalable way?"
          value={formData.solution || ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateField("solution", e.target.value)}
          style={textareaStyle}
        />
      </div>

      <div>
        <label htmlFor="apply-need" style={fieldLabelStyle}>
          Support Required<span style={requiredStarStyle}>*</span>
        </label>
        <textarea
          id="apply-need"
          disabled={disabled}
          placeholder="What support do you need from JHUB? (e.g. Incubation, lab access, grant funding, mentorship)"
          value={formData.need || ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateField("need", e.target.value)}
          style={textareaStyle}
        />
      </div>
    </div>
  );
}
