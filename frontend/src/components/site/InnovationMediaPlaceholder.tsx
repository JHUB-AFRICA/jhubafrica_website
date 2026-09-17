import React from "react";

interface InnovationMediaPlaceholderProps {
  id?: string | number;
  label?: string;
  gradient?: string;
}

export function InnovationMediaPlaceholder({
  id = "default",
  label = "JHUB",
  gradient = "linear-gradient(135deg, #07152b 0%, #0f2d59 50%, #064e3b 100%)",
}: InnovationMediaPlaceholderProps) {
  const patternId = `grid-placeholder-${id}`;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: gradient,
      }}
    >
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "-20px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          right: "-10px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15, 45, 89, 0.6) 0%, rgba(15, 45, 89, 0) 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "1.25rem",
            fontWeight: "800",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "rgba(255, 255, 255, 0.08)",
            border: "none",
            borderRadius: "8px",
            padding: "6px 16px",
            backdropFilter: "blur(4px)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default InnovationMediaPlaceholder;
