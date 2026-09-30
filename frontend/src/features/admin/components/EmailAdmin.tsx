import { useState, useEffect, useMemo, type FormEvent } from "react";
import {
  Loader2,
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Server,
  FileCode2,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  Search,
  Sparkles,
  RefreshCw,
  Globe,
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  Lightbulb,
} from "lucide-react";
import {
  adminSendTestEmail,
  adminGetEmailConfig,
  adminGetEmailTemplates,
  adminGetTemplatePreviewHtml,
  type EmailConfigResponse,
  type EmailTemplateInfo,
} from "../../../../axios/api/email";
import { InputField } from "./InputField";
import styles from "../../../styles/Admin.module.css";

type TabKey = "studio" | "pipeline" | "dispatcher" | "dns";
type ViewportMode = "desktop" | "tablet" | "mobile";

const DEFAULT_TEMPLATES: EmailTemplateInfo[] = [
  {
    id: "acknowledgment",
    name: "User Acknowledgment Receipt",
    category: "User Receipt",
    description: "Automated receipt sent to users after submitting an inquiry or application.",
  },
  {
    id: "enrollment",
    name: "Course Enrollment Confirmation",
    category: "User Receipt",
    description: "Confirmation email dispatched to students when enrolled in a training cohort.",
  },
  {
    id: "rsvp",
    name: "Event RSVP Confirmation",
    category: "User Receipt",
    description: "Reservation confirmation dispatched to attendees registered for an event.",
  },
  {
    id: "reset-password",
    name: "Admin Password Reset",
    category: "Authentication",
    description: "Time-sensitive secure reset link for administrator dashboard accounts.",
  },
  {
    id: "inquiry",
    name: "General Contact Inquiry",
    category: "Internal Lead",
    description: "Inquiry notification forwarded to secretariat staff from the contact form.",
  },
  {
    id: "lead-innovation",
    name: "Innovation Proposal Alert",
    category: "Internal Lead",
    description: "Lead email forwarded to the Innovation Team upon project submission.",
  },
  {
    id: "lead-partner",
    name: "Strategic Partnership Proposal Alert",
    category: "Internal Lead",
    description: "Lead email forwarded to Strategic Partnerships coordinators.",
  },
  {
    id: "lead-sponsor",
    name: "Sponsorship & Resource Mobilization Alert",
    category: "Internal Lead",
    description: "Lead email forwarded to the Funding & Partnerships office.",
  },
  {
    id: "lead-course",
    name: "Course Interest Registration Alert",
    category: "Internal Lead",
    description: "Alert sent to Training & Courses coordinator when interest is registered.",
  },
  {
    id: "lead-event",
    name: "Event Attendee Registration Alert",
    category: "Internal Lead",
    description: "Alert forwarded to the Events Coordinator for each RSVP.",
  },
  {
    id: "lead-general",
    name: "General Secretariat Inquiry",
    category: "Internal Lead",
    description: "Consolidated lead alert forwarded to the JHUB Secretariat.",
  },
];

export function EmailAdmin() {
  const [activeTab, setActiveTab] = useState<TabKey>("studio");
  const [config, setConfig] = useState<EmailConfigResponse | null>(null);
  const [templates, setTemplates] = useState<EmailTemplateInfo[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("acknowledgment");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Studio Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  // Dispatcher Controls
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [resultMsg, setResultMsg] = useState<{
    type: "success" | "error";
    text: string;
    details?: any;
  } | null>(null);

  // Fetch initial config and templates from backend
  const loadData = async () => {
    setRefreshing(true);
    try {
      const [cfg, tpls] = await Promise.allSettled([
        adminGetEmailConfig(),
        adminGetEmailTemplates(),
      ]);

      if (cfg.status === "fulfilled" && cfg.value) {
        setConfig(cfg.value);
      }
      if (tpls.status === "fulfilled" && tpls.value?.templates?.length) {
        setTemplates(tpls.value.templates);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch preview HTML whenever selectedTemplateId changes
  useEffect(() => {
    if (!selectedTemplateId) return;
    let cancelled = false;
    setLoadingPreview(true);

    adminGetTemplatePreviewHtml(selectedTemplateId)
      .then((html) => {
        if (!cancelled) setPreviewHtml(html);
      })
      .catch((err) => {
        if (!cancelled) {
          setPreviewHtml(`
            <div style="font-family: -apple-system, sans-serif; padding: 40px; text-align: center; color: #e11d48;">
              <h3 style="font-size: 18px; margin-bottom: 8px;">Template Preview Unavailable</h3>
              <p style="font-size: 14px; color: #64748b;">${err?.message || "Could not retrieve preview from backend."}</p>
            </div>
          `);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTemplateId]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === "ALL" ||
        (categoryFilter === "RECEIPT" && tpl.category === "User Receipt") ||
        (categoryFilter === "LEAD" && tpl.category === "Internal Lead") ||
        (categoryFilter === "AUTH" && tpl.category === "Authentication");

      return matchesSearch && matchesCat;
    });
  }, [templates, searchQuery, categoryFilter]);

  const selectedTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  // Handle Copy Raw HTML
  const handleCopyHtml = async () => {
    if (!previewHtml) return;
    try {
      await navigator.clipboard.writeText(previewHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  // Handle Copy DNS Record
  const handleCopyDns = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(key);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  // Test Dispatch
  const handleSendTest = async (e: FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;

    setSending(true);
    setResultMsg(null);

    try {
      const res = await adminSendTestEmail(testEmail.trim());
      setResultMsg({
        type: "success",
        text: res.message || `Test email dispatched to ${testEmail}!`,
        details: res.data,
      });
      setTestEmail("");
    } catch (err: any) {
      setResultMsg({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to dispatch test email. Please check your backend RESEND_API_KEY.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="content-section" style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* ── 1. Executive Modern Hub Header ───────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          borderRadius: "28px",
          padding: "2.75rem 3rem",
          color: "#ffffff",
          boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.25)",
          marginBottom: "2.25rem",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-60px",
            width: "280px",
            height: "280px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ maxWidth: "780px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.9rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: config?.isSandboxMode ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  color: config?.isSandboxMode ? "#fbbf24" : "#34d399",
                  border: `1px solid ${config?.isSandboxMode ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: config?.isSandboxMode ? "#f59e0b" : "#10b981",
                    boxShadow: `0 0 10px ${config?.isSandboxMode ? "#f59e0b" : "#10b981"}`,
                  }}
                />
                {config?.isSandboxMode ? "Phase 2: Local Dev Sandbox (Safe Mode)" : "Production Verified"}
              </span>

              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Sparkles size={14} style={{ color: "#38bdf8" }} />
                Non-Blocking Async Engine (&lt;50ms response)
              </span>
            </div>

            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 0.75rem 0",
                lineHeight: 1.2,
                color: "#ffffff",
              }}
            >
              Transactional Email Engine & Studio
            </h1>

            <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
              Live interactive workbench for JHUB Africa transactional notifications, applicant acknowledgment receipts,
              departmental lead routing, and local email deliverability verification.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "0.9rem 1.4rem",
                minWidth: "120px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#38bdf8" }}>
                {templates.length}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                Templates
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "0.9rem 1.4rem",
                minWidth: "120px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#34d399" }}>
                5
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                Teams Routed
              </div>
            </div>

            <button
              type="button"
              onClick={loadData}
              title="Refresh Pipeline Status"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "0.9rem",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin text-blue-400" : ""} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            marginTop: "2.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("studio")}
            style={{
              padding: "0.7rem 1.3rem",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              transition: "all 0.2s ease",
              border: activeTab === "studio" ? "1px solid #38bdf8" : "1px solid transparent",
              background: activeTab === "studio" ? "#38bdf8" : "rgba(255, 255, 255, 0.06)",
              color: activeTab === "studio" ? "#0f172a" : "#cbd5e1",
            }}
          >
            <Eye size={16} />
            <span>Template Studio & Visualizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pipeline")}
            style={{
              padding: "0.7rem 1.3rem",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              transition: "all 0.2s ease",
              border: activeTab === "pipeline" ? "1px solid #38bdf8" : "1px solid transparent",
              background: activeTab === "pipeline" ? "#38bdf8" : "rgba(255, 255, 255, 0.06)",
              color: activeTab === "pipeline" ? "#0f172a" : "#cbd5e1",
            }}
          >
            <Server size={16} />
            <span>Pipeline & Department Routing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dispatcher")}
            style={{
              padding: "0.7rem 1.3rem",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              transition: "all 0.2s ease",
              border: activeTab === "dispatcher" ? "1px solid #38bdf8" : "1px solid transparent",
              background: activeTab === "dispatcher" ? "#38bdf8" : "rgba(255, 255, 255, 0.06)",
              color: activeTab === "dispatcher" ? "#0f172a" : "#cbd5e1",
            }}
          >
            <Send size={16} />
            <span>Live / Simulated Dispatcher</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dns")}
            style={{
              padding: "0.7rem 1.3rem",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              transition: "all 0.2s ease",
              border: activeTab === "dns" ? "1px solid #38bdf8" : "1px solid transparent",
              background: activeTab === "dns" ? "#38bdf8" : "rgba(255, 255, 255, 0.06)",
              color: activeTab === "dns" ? "#0f172a" : "#cbd5e1",
            }}
          >
            <Globe size={16} />
            <span>Domain DNS Blueprint</span>
          </button>
        </div>
      </div>

      {/* ── 2. TAB 1: TEMPLATE STUDIO & VISUALIZER (FLAGSHIP WORKBENCH) ─── */}
      {activeTab === "studio" && (
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "1.75rem", alignItems: "start" }}>
          {/* Left Column: Template Navigator & Directory */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              padding: "1.75rem",
              boxShadow: "0 4px 20px -4px rgba(15, 23, 42, 0.04)",
              position: "sticky",
              top: "1.5rem",
            }}
          >
            {/* Search Box */}
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  fontSize: "0.88rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#0f172a",
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {[
                { key: "ALL", label: `All (${templates.length})` },
                { key: "RECEIPT", label: "Receipts" },
                { key: "LEAD", label: "Leads" },
                { key: "AUTH", label: "Auth" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategoryFilter(cat.key)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: categoryFilter === cat.key ? "#0f172a" : "#f1f5f9",
                    color: categoryFilter === cat.key ? "#ffffff" : "#64748b",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Template Card List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                maxHeight: "calc(100vh - 350px)",
                overflowY: "auto",
                paddingRight: "0.25rem",
              }}
            >
              {filteredTemplates.map((tpl) => {
                const isSelected = tpl.id === selectedTemplateId;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    style={{
                      textAlign: "left",
                      padding: "1rem 1.15rem",
                      borderRadius: "14px",
                      cursor: "pointer",
                      border: isSelected ? "1.5px solid #3b82f6" : "1px solid #f1f5f9",
                      backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                      boxShadow: isSelected ? "0 4px 12px rgba(59, 130, 246, 0.08)" : "none",
                      transition: "all 0.15s ease",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: isSelected ? "#1d4ed8" : "#0f172a",
                        }}
                      >
                        {tpl.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          backgroundColor:
                            tpl.category === "User Receipt"
                              ? "#ecfdf5"
                              : tpl.category === "Authentication"
                              ? "#fff1f2"
                              : "#f8fafc",
                          color:
                            tpl.category === "User Receipt"
                              ? "#059669"
                              : tpl.category === "Authentication"
                              ? "#e11d48"
                              : "#475569",
                          border: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        {tpl.category === "User Receipt" ? "Receipt" : tpl.category === "Authentication" ? "Auth" : "Lead"}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        color: "#64748b",
                        lineHeight: 1.45,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Email Studio & Device Canvas */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              boxShadow: "0 8px 30px -4px rgba(15, 23, 42, 0.04)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Studio Toolbar */}
            <div
              style={{
                padding: "1rem 1.75rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                backgroundColor: "#f8fafc",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                    {selectedTemplate?.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "6px",
                      backgroundColor: "#e2e8f0",
                      color: "#334155",
                    }}
                  >
                    ID: {selectedTemplateId}
                  </span>
                </div>
                <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                  {selectedTemplate?.description}
                </p>
              </div>

              {/* Viewport Switcher & Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Viewport Buttons */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "#e2e8f0",
                    borderRadius: "10px",
                    padding: "3px",
                    gap: "2px",
                  }}
                >
                  <button
                    type="button"
                    title="Desktop View (100%)"
                    onClick={() => setViewport("desktop")}
                    style={{
                      padding: "0.45rem 0.65rem",
                      borderRadius: "7px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: viewport === "desktop" ? "#ffffff" : "transparent",
                      color: viewport === "desktop" ? "#0f172a" : "#64748b",
                      boxShadow: viewport === "desktop" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    <Monitor size={15} />
                  </button>

                  <button
                    type="button"
                    title="Tablet View (600px)"
                    onClick={() => setViewport("tablet")}
                    style={{
                      padding: "0.45rem 0.65rem",
                      borderRadius: "7px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: viewport === "tablet" ? "#ffffff" : "transparent",
                      color: viewport === "tablet" ? "#0f172a" : "#64748b",
                      boxShadow: viewport === "tablet" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    <Tablet size={15} />
                  </button>

                  <button
                    type="button"
                    title="Mobile View (375px)"
                    onClick={() => setViewport("mobile")}
                    style={{
                      padding: "0.45rem 0.65rem",
                      borderRadius: "7px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: viewport === "mobile" ? "#ffffff" : "transparent",
                      color: viewport === "mobile" ? "#0f172a" : "#64748b",
                      boxShadow: viewport === "mobile" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    <Smartphone size={15} />
                  </button>
                </div>

                {/* Copy HTML Button */}
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  title="Copy full HTML source"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 0.95rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: copiedHtml ? "#059669" : "#334155",
                    cursor: "pointer",
                  }}
                >
                  {copiedHtml ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedHtml ? "Copied!" : "Copy HTML"}</span>
                </button>

                {/* Open in New Window Button */}
                <a
                  href={`http://localhost:4000/api/v1/admin/email/preview/${selectedTemplateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 0.95rem",
                    borderRadius: "10px",
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Full Screen</span>
                </a>
              </div>
            </div>

            {/* Email Client Simulated Window Header */}
            <div
              style={{
                backgroundColor: "#f1f5f9",
                borderBottom: "1px solid #e2e8f0",
                padding: "0.85rem 1.75rem",
                display: "grid",
                gap: "0.3rem",
                fontSize: "0.8rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#64748b", width: "55px", fontWeight: 700 }}>From:</span>
                <span style={{ color: "#0f172a", fontWeight: 600 }}>
                  JHUB Africa &lt;{config?.senderAddress || "onboarding@resend.dev"}&gt;
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#64748b", width: "55px", fontWeight: 700 }}>To:</span>
                <span style={{ color: "#0f172a" }}>applicant.recipient@example.com</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#64748b", width: "55px", fontWeight: 700 }}>Status:</span>
                <span style={{ color: "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <CheckCircle2 size={12} /> Rendered locally via template engine
                </span>
              </div>
            </div>

            {/* Interactive Responsive Canvas Frame */}
            <div
              style={{
                backgroundColor: "#e2e8f0",
                padding: "2rem",
                minHeight: "680px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                overflowY: "auto",
              }}
            >
              {loadingPreview ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "6rem 0", color: "#64748b" }}>
                  <Loader2 size={36} className="animate-spin text-blue-600" />
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Compiling template layout...</span>
                </div>
              ) : previewHtml ? (
                <div
                  style={{
                    width: viewport === "desktop" ? "100%" : viewport === "tablet" ? "620px" : "385px",
                    maxWidth: "100%",
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(0,0,0,0.06)",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <iframe
                    title="Live Email Preview"
                    srcDoc={previewHtml}
                    style={{
                      width: "100%",
                      height: "720px",
                      border: "none",
                      display: "block",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. TAB 2: PIPELINE & DEPARTMENT ROUTING ─────────────────────── */}
      {activeTab === "pipeline" && (
        <div style={{ display: "grid", gap: "2rem" }}>
          {/* Top Status Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {/* Core Provider Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "22px",
                padding: "2rem",
                boxShadow: "0 4px 20px -4px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Server size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                      Resend Gateway
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Core Transactional Provider</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "0.35rem 0.8rem",
                    borderRadius: "9999px",
                    backgroundColor: config?.isKeyConfigured ? "#ecfdf5" : "#fef3c7",
                    color: config?.isKeyConfigured ? "#059669" : "#d97706",
                    border: `1px solid ${config?.isKeyConfigured ? "#a7f3d0" : "#fde68a"}`,
                  }}
                >
                  {config?.isKeyConfigured ? "Connected" : "Simulated"}
                </span>
              </div>

              <div style={{ display: "grid", gap: "0.75rem", fontSize: "0.85rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>API Key Status:</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>
                    {config?.isKeyConfigured ? "re_••••••••PARGG (Loaded)" : "Not Configured"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Active Sender:</span>
                  <code style={{ fontSize: "0.8rem", backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#0f172a" }}>
                    {config?.senderAddress || "onboarding@resend.dev"}
                  </code>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Reply-To:</span>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{config?.replyToAddress || "inquiries@jhubafrica.com"}</span>
                </div>
              </div>
            </div>

            {/* Sandbox & Deliverability Mode Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "22px",
                padding: "2rem",
                boxShadow: "0 4px 20px -4px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      backgroundColor: config?.isSandboxMode ? "#fffbeb" : "#ecfdf5",
                      color: config?.isSandboxMode ? "#d97706" : "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {config?.isSandboxMode ? <ShieldAlert size={22} /> : <CheckCircle2 size={22} />}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                      Sandbox & Dev Mailbox
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Phase 2 Safety Handling</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "0.35rem 0.8rem",
                    borderRadius: "9999px",
                    backgroundColor: config?.isSandboxMode ? "#fef3c7" : "#ecfdf5",
                    color: config?.isSandboxMode ? "#d97706" : "#059669",
                    border: `1px solid ${config?.isSandboxMode ? "#fde68a" : "#a7f3d0"}`,
                  }}
                >
                  {config?.isSandboxMode ? "Dev Fallback Active" : "Verified Domain"}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: "0.84rem", color: "#475569", lineHeight: 1.6, borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                When sending to unverified recipients in local development, the system avoids crashes or 403 API drops by safely
                simulating delivery and saving an instant HTML snapshot to <code style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "0.78rem" }}>backend/temp/emails/</code>.
              </p>
            </div>
          </div>

          {/* Departmental Lead Routing Matrix */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              padding: "2.5rem",
              boxShadow: "0 4px 20px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 900, color: "#0f172a" }}>
                Departmental Lead Routing Architecture
              </h3>
              <p style={{ margin: "0.4rem 0 0 0", color: "#64748b", fontSize: "0.92rem" }}>
                Internal leads and notifications are routed specifically by operational function with automatic fallback to the secretariat.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[
                {
                  title: "Innovations & Accelerator",
                  icon: <Lightbulb size={20} className="text-amber-500" />,
                  address: config?.departmentRouting?.innovations || "innovations@jhubafrica.com",
                  scope: "Venture incubation proposals, hardware prototypes, accelerator applications.",
                },
                {
                  title: "Academy & Training",
                  icon: <BookOpen size={20} className="text-blue-500" />,
                  address: config?.departmentRouting?.courses || "training@jhubafrica.com",
                  scope: "Course registrations, cohort interest forms, student inquiries.",
                },
                {
                  title: "Strategic Partnerships",
                  icon: <Users size={20} className="text-purple-500" />,
                  address: config?.departmentRouting?.partnerships || "partnerships@jhubafrica.com",
                  scope: "Institutional partnerships, academic MoUs, university collaborations.",
                },
                {
                  title: "Funding & Sponsorship",
                  icon: <DollarSign size={20} className="text-emerald-500" />,
                  address: config?.departmentRouting?.partnerships || "partnerships@jhubafrica.com",
                  scope: "Venture investor matchmaking, grant sponsorships, resource mobilization.",
                },
                {
                  title: "Events & Summits",
                  icon: <Calendar size={20} className="text-rose-500" />,
                  address: config?.departmentRouting?.events || "events@jhubafrica.com",
                  scope: "RSVP guest registrations, workshop attendees, conference participation.",
                },
                {
                  title: "JHUB Secretariat (Fallback)",
                  icon: <Mail size={20} className="text-slate-600" />,
                  address: config?.departmentRouting?.secretariat || "inquiries@jhubafrica.com",
                  scope: "General contact inquiries, public queries, consolidated alert fallback.",
                },
              ].map((dept, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                      {dept.icon}
                      <h4 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#0f172a" }}>
                        {dept.title}
                      </h4>
                    </div>
                    <code
                      style={{
                        display: "inline-block",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.3rem 0.6rem",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {dept.address}
                    </code>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>
                      {dept.scope}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TAB 3: LIVE / SIMULATED DIAGNOSTIC DISPATCHER ────────────── */}
      {activeTab === "dispatcher" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 540px) 1fr", gap: "2rem", alignItems: "start" }}>
          {/* Dispatch Form Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              padding: "2.5rem",
              boxShadow: "0 8px 30px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 900, color: "#0f172a" }}>
                Send Diagnostic Test Email
              </h3>
              <p style={{ margin: "0.4rem 0 0 0", color: "#64748b", fontSize: "0.88rem" }}>
                Dispatches a formatted test message via Resend with timestamp and system telemetry.
              </p>
            </div>

            <form onSubmit={handleSendTest} style={{ display: "grid", gap: "1.25rem" }}>
              <InputField
                required
                type="email"
                label="Destination Recipient Email"
                placeholder="your.email@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className={styles["input-style"]}
              />

              <button
                type="submit"
                className="btn-primary"
                disabled={sending || !testEmail.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  opacity: sending ? 0.65 : 1,
                  cursor: sending ? "not-allowed" : "pointer",
                  padding: "0.95rem 1.6rem",
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                }}
              >
                {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                <span>{sending ? "Dispatching Message..." : "Send Test Email"}</span>
              </button>
            </form>

            {resultMsg && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.25rem",
                  borderRadius: "14px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  backgroundColor:
                    resultMsg.type === "success" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                  border: `1.5px solid ${resultMsg.type === "success" ? "#10b981" : "#ef4444"}`,
                  color: resultMsg.type === "success" ? "#065f46" : "#991b1b",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  {resultMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  <span style={{ fontWeight: 800 }}>
                    {resultMsg.type === "success" ? "Dispatch Completed" : "Dispatch Notice"}
                  </span>
                </div>
                <div>{resultMsg.text}</div>
                {resultMsg.details?.id && (
                  <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "#64748b", fontFamily: "monospace" }}>
                    Resend Message ID: {resultMsg.details.id}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Local Dev Mailbox Information Card */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              padding: "2.5rem",
            }}
          >
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              How Local Testing Works in Phase 2
            </h4>

            <div style={{ display: "grid", gap: "1rem", fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", flexShrink: 0 }}>
                  1
                </span>
                <div>
                  <strong>Registered Account Owner:</strong> Sending to <code style={{ backgroundColor: "#e2e8f0", padding: "1px 5px", borderRadius: "4px" }}>emmanuelwaweru222199@daystar.ac.ke</code> delivers live to your inbox via Resend.
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#10b981", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", flexShrink: 0 }}>
                  2
                </span>
                <div>
                  <strong>Other Recipient Addresses:</strong> Sandbox accounts only permit sending to the owner. The backend automatically captures all other test addresses into <code style={{ backgroundColor: "#e2e8f0", padding: "1px 5px", borderRadius: "4px" }}>backend/temp/emails/</code> without dropping or failing.
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#8b5cf6", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", flexShrink: 0 }}>
                  3
                </span>
                <div>
                  <strong>Instant Visual Inspection:</strong> Use the <strong>Template Studio</strong> tab above at any time to preview and verify all 11 responsive transactional templates with realistic mock data!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. TAB 4: DOMAIN DNS BLUEPRINT ──────────────────────────────── */}
      {activeTab === "dns" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            padding: "2.75rem",
            boxShadow: "0 8px 30px -4px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "0.3rem 0.75rem",
                borderRadius: "6px",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                display: "inline-block",
                marginBottom: "0.6rem",
              }}
            >
              Ready to provide to IT / Registrar
            </span>
            <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 900, color: "#0f172a" }}>
              DNS Authentication Blueprint for <span style={{ color: "#3b82f6" }}>jhubafrica.com</span>
            </h3>
            <p style={{ margin: "0.5rem 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>
              When access to the domain registrar (Cloudflare, cPanel, GoDaddy, Route 53) is available, add these exact records to unlock live worldwide deliverability.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {[
              {
                id: "dkim1",
                type: "CNAME",
                name: "resend._domainkey.jhubafrica.com",
                value: "dkim.resend.com",
                desc: "Primary DKIM cryptographic signature",
              },
              {
                id: "dkim2",
                type: "CNAME",
                name: "resend2._domainkey.jhubafrica.com",
                value: "dkim2.resend.com",
                desc: "Secondary rotated DKIM signature",
              },
              {
                id: "spf",
                type: "TXT",
                name: "@ (or jhubafrica.com)",
                value: "v=spf1 include:resend.com ~all",
                desc: "SPF authorization for Resend sending servers",
              },
              {
                id: "dmarc",
                type: "TXT",
                name: "_dmarc.jhubafrica.com",
                value: "v=DMARC1; p=none; sp=none; rua=mailto:dmarc@jhubafrica.com; pct=100",
                desc: "DMARC anti-spoofing policy & reporting",
              },
              {
                id: "mx",
                type: "MX",
                name: "bounces.jhubafrica.com",
                value: "10 feedback-smtp.resend.com",
                desc: "Custom return-path bounce domain",
              },
            ].map((rec) => (
              <div
                key={rec.id}
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "6px",
                        fontWeight: 900,
                        fontSize: "0.72rem",
                        backgroundColor: "#0f172a",
                        color: "#ffffff",
                      }}
                    >
                      {rec.type}
                    </span>
                    <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>{rec.name}</strong>
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.82rem" }}>{rec.desc}</div>
                  <code
                    style={{
                      display: "inline-block",
                      marginTop: "0.4rem",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "0.3rem 0.6rem",
                      fontSize: "0.82rem",
                      color: "#1e40af",
                      fontWeight: 600,
                    }}
                  >
                    {rec.value}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyDns(rec.id, rec.value)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 0.95rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: copiedRecord === rec.id ? "#059669" : "#334155",
                    cursor: "pointer",
                  }}
                >
                  {copiedRecord === rec.id ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedRecord === rec.id ? "Copied" : "Copy Value"}</span>
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "2rem",
              padding: "1.25rem",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "16px",
              color: "#1e3a8a",
              fontSize: "0.88rem",
              lineHeight: 1.6,
            }}
          >
            <strong>Complete Reference Guide:</strong> Full registrar instructions for Cloudflare, cPanel, and GoDaddy are documented in <code style={{ backgroundColor: "#dbeafe", padding: "2px 6px", borderRadius: "4px" }}>Docs/EMAIL_DOMAIN_CONFIGURATION.md</code>.
          </div>
        </div>
      )}
    </section>
  );
}
