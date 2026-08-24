import React, { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { RefreshCw, ServerCrash, WifiOff, AlertTriangle, ChevronDown, ChevronUp, Home, Mail } from "lucide-react";

interface ResourceFallbackProps {
  error?: Error | any;
  title?: string;
  message?: string;
  resourceName?: string;
  onRetry?: () => void | Promise<void>;
  isFullPage?: boolean;
  compact?: boolean;
}

export function isBackendOffline(error?: any): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  const code = error.code || "";
  const status = error.status || error.response?.status;

  return (
    code === "ERR_NETWORK" ||
    code === "ERR_CONNECTION_REFUSED" ||
    code === "ECONNREFUSED" ||
    msg.includes("network error") ||
    msg.includes("failed to fetch") ||
    msg.includes("connection refused") ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    status === 500
  );
}

export default function ResourceFallback({
  error,
  title,
  message,
  resourceName = "content",
  onRetry,
  isFullPage = false,
  compact = false,
}: ResourceFallbackProps) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const isOffline = isBackendOffline(error);

  const displayTitle =
    title ||
    (isOffline
      ? "Backend Services Unavailable"
      : `Unable to Load ${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}`);

  const displayMessage =
    message ||
    (isOffline
      ? "We're experiencing difficulty connecting to the JHUB API servers. The backend service may be temporarily down or undergoing maintenance."
      : `An unexpected issue occurred while retrieving ${resourceName}. Please try refreshing or check back in a few moments.`);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        await router.invalidate();
      }
    } catch (e) {
      console.warn("Retry attempt failed:", e);
    } finally {
      setTimeout(() => setRetrying(false), 600);
    }
  };

  const content = (
    <div
      style={{
        maxWidth: compact ? "480px" : "640px",
        width: "100%",
        margin: "0 auto",
        padding: compact ? "1.5rem" : "2.5rem 2rem",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 30px -5px rgba(15, 45, 89, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.05)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Accent Gradient Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: isOffline
            ? "linear-gradient(90deg, #f59e0b, #ef4444)"
            : "linear-gradient(90deg, var(--jhub-green, #10b981), #3b82f6)",
        }}
      />

      {/* Icon with Glowing Pulse Background */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          backgroundColor: isOffline ? "#fffbeb" : "#f0fdf4",
          color: isOffline ? "#d97706" : "var(--jhub-green, #10b981)",
          marginBottom: "1.25rem",
          position: "relative",
          boxShadow: isOffline
            ? "0 0 0 8px rgba(245, 158, 11, 0.12)"
            : "0 0 0 8px rgba(16, 185, 129, 0.12)",
        }}
      >
        {isOffline ? (
          <ServerCrash size={32} strokeWidth={2.2} />
        ) : (
          <AlertTriangle size={32} strokeWidth={2.2} />
        )}
      </div>

      {/* Status Badge */}
      <div style={{ marginBottom: "0.75rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            padding: "3px 10px",
            borderRadius: "20px",
            backgroundColor: isOffline ? "#fef3c7" : "#fee2e2",
            color: isOffline ? "#92400e" : "#991b1b",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: isOffline ? "#d97706" : "#dc2626",
              display: "inline-block",
            }}
          />
          {isOffline ? "Server Connection Issue" : "Load Failure"}
        </span>
      </div>

      {/* Heading */}
      <h2
        style={{
          fontSize: compact ? "1.35rem" : "1.65rem",
          fontWeight: 700,
          color: "var(--jhub-blue, #0f2d59)",
          margin: "0 0 0.5rem 0",
          letterSpacing: "-0.01em",
        }}
      >
        {displayTitle}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: compact ? "0.9rem" : "0.98rem",
          color: "#475569",
          lineHeight: "1.6",
          margin: "0 auto 1.75rem auto",
          maxWidth: "480px",
        }}
      >
        {displayMessage}
      </p>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "10px 22px",
            fontSize: "0.9rem",
            cursor: retrying ? "not-allowed" : "pointer",
            opacity: retrying ? 0.8 : 1,
          }}
        >
          <RefreshCw
            size={16}
            style={{
              animation: retrying ? "spin 1s linear infinite" : "none",
            }}
          />
          {retrying ? "Reconnecting..." : "Try Again"}
        </button>

        <Link
          to="/"
          className="btn-outline"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "10px 20px",
            fontSize: "0.9rem",
            textDecoration: "none",
          }}
        >
          <Home size={16} />
          Go Home
        </Link>

        <Link
          to="/contact"
          className="btn-outline"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "10px 18px",
            fontSize: "0.9rem",
            textDecoration: "none",
            borderColor: "#cbd5e1",
            color: "#64748b",
          }}
        >
          <Mail size={16} />
          Help Desk
        </Link>
      </div>

      {/* Technical Diagnostics Accordion */}
      {error && (
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.85rem", marginTop: "0.85rem" }}>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
            }}
          >
            {showDetails ? "Hide technical details" : "Show technical details"}
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDetails && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                textAlign: "left",
                fontSize: "0.78rem",
                color: "#334155",
                fontFamily: "monospace",
                maxHeight: "160px",
                overflowY: "auto",
                wordBreak: "break-all",
              }}
            >
              <div>
                <strong>Error:</strong> {error.name || "Error"}: {error.message || String(error)}
              </div>
              {error.code && (
                <div>
                  <strong>Code:</strong> {error.code}
                </div>
              )}
              {error.response?.status && (
                <div>
                  <strong>HTTP Status:</strong> {error.response.status}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Inline Keyframes for spinning icon */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (isFullPage) {
    return (
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background: "radial-gradient(circle at 50% 30%, #f8fafc, #ffffff)",
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 1rem", width: "100%" }}>
      {content}
    </div>
  );
}
