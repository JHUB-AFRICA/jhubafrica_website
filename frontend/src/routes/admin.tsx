import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import { adminLogin, adminLogout, requestPasswordReset, submitPasswordReset } from "../../axios/api/admin/auth";
import { getAdminUsers, createAdminUser, AdminAccountItem } from "../../axios/api/admin/users";
import { getAccessToken, setAccessToken, refreshSession } from "../../axios/axios";
import { getAdminNews } from "../../axios/api/news";
import { getEvents } from "../../axios/api/events";
import { getAdminInnovations } from "../../axios/api/admin/innovations";
import { getAdminCourses } from "../../axios/api/admin/courses";
import { getTeamMembers } from "../../axios/api/team";
import { NewsPost } from "../types/news";
import { EventItem } from "../types/events";
import { InnovationItem } from "../types/innovations";
import { CourseItem } from "../types/courses";
import { JHubTeamMember } from "../types/team";
import {
  dateToLocalYmd,
  localYmdToDate,
  useEventAdmin,
  useInnovationAdmin,
  useNewsAdmin,
  useCourseAdmin,
  useTeamAdmin,
} from "@/features/admin/useAdminContent";
import { AdminFormActions } from "@/features/admin/components/AdminFormActions";
import { AdminImageUpload } from "@/features/admin/components/AdminImageUpload";
import { MultiImageManager } from "@/features/admin/components/MultiImageManager";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { InputField } from "@/features/admin/components/InputField";
import { TextareaField } from "@/features/admin/components/TextareaField";
import { SelectField } from "@/features/admin/components/SelectField";
import { EmailAdmin } from "@/features/admin/components/EmailAdmin";
import { AdminUsersManager } from "@/features/admin/components/AdminUsersManager";
import styles from "../styles/Admin.module.css";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — JHUB Africa" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Internal admin area for JHUB Africa staff.",
      },
    ],
  }),
  loader: async () => {
    let token = getAccessToken();
    if (!token && typeof window !== "undefined") {
      try {
        token = await refreshSession();
      } catch (err) {
        console.warn("Silent refresh failed on route load:", err);
      }
    }

    if (!token) {
      return { news: [], events: [], innovations: [], courses: [], team: [] };
    }

    try {
      const [news, events, innovations, courses, team] = await Promise.all([
        getAdminNews(),
        getEvents(),
        getAdminInnovations(),
        getAdminCourses(),
        getTeamMembers(),
      ]);
      return { news, events, innovations, courses, team };
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setAccessToken(null);
      }
      return { news: [], events: [], innovations: [], courses: [], team: [] };
    }
  },
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const { news, events, innovations, courses, team } = Route.useLoaderData();

  useEffect(() => {
    if (getAccessToken()) {
      setUnlocked(true);
    } else {
      refreshSession().then((token) => {
        if (token) {
          setUnlocked(true);
          router.invalidate();
        }
      });
    }

    // Check for resetToken in query parameters
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("resetToken");
      if (token) {
        setResetToken(token);
        setAuthMode("reset");
      }
    }
  }, []);

  async function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccessMsg("");
    try {
      const response = await adminLogin(email, password);
      setAccessToken(response.token);
      setUnlocked(true);
      setErr("");
      await router.invalidate();
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Invalid email or password.";
      setErr(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccessMsg("");
    setDevResetUrl(null);
    try {
      const response = await requestPasswordReset(email);
      setSuccessMsg(response.message || "Password reset instructions have been sent.");
      if (response.devResetUrl) {
        setDevResetUrl(response.devResetUrl);
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Failed to request password reset.";
      setErr(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteReset(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSuccessMsg("");

    if (newPassword.length < 8) {
      setErr("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    if (!resetToken) {
      setErr("Reset token is missing. Please request a new password reset link.");
      return;
    }

    setLoading(true);
    try {
      const response = await submitPasswordReset(resetToken, newPassword);
      setSuccessMsg(response.message || "Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setTimeout(() => {
        setAuthMode("login");
        setResetToken(null);
      }, 2500);
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Failed to reset password. The link may have expired.";
      setErr(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function lock() {
    try {
      await adminLogout();
    } catch (e) {
      console.warn("Sign out request failed:", e);
    }
    setAccessToken(null);
    setUnlocked(false);
    setEmail("");
    setPassword("");
    setAuthMode("login");
    await router.invalidate();
  }

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    onConfirm: async () => {},
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (confirmDelete.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [confirmDelete.isOpen]);

  const requestDelete = (title: string, onConfirm: () => Promise<void>) => {
    setConfirmDelete({
      isOpen: true,
      title,
      onConfirm,
    });
  };

  if (!unlocked) {
    if (authMode === "forgot") {
      return (
        <>
          <header className="page-header">
            <h1>
              Reset <span style={{ color: "var(--jhub-green)" }}>Password</span>
            </h1>
            <p>
              Enter your administrator email to receive a secure link to reset your password.
            </p>
          </header>
          <section
            className="content-section"
            style={{ maxWidth: 460, margin: "0 auto" }}
          >
            {successMsg ? (
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                  textAlign: "center",
                  display: "grid",
                  gap: "1rem",
                }}
              >
                <div style={{ color: "#166534", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  {successMsg}
                </div>
                {devResetUrl && (
                  <div style={{ marginTop: "0.5rem", padding: "0.75rem", backgroundColor: "#dcfce7", borderRadius: "8px", fontSize: "0.85rem" }}>
                    <div style={{ fontWeight: 700, marginBottom: "0.25rem", color: "#14532d" }}>Dev Quick Link:</div>
                    <a href={devResetUrl} style={{ color: "#15803d", wordBreak: "break-all" }}>
                      Click here to reset password directly
                    </a>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setErr("");
                    setSuccessMsg("");
                  }}
                  className="btn-outline"
                  style={{ justifySelf: "center", marginTop: "0.5rem" }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleRequestReset}
                style={{ display: "grid", gap: "1rem" }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--jhub-blue)", marginBottom: "0.4rem" }}>
                    Administrator Email Address
                  </label>
                  <input
                    autoFocus
                    required
                    type="email"
                    placeholder="admin@jhub.africa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles['input-style']}
                    style={{ width: "100%" }}
                    aria-label="Admin email"
                  />
                </div>

                {err && (
                  <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{err}</div>
                )}

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.5rem" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      opacity: loading ? 0.65 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading && <Loader2 className="animate-spin" size={16} />}
                    <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErr("");
                      setSuccessMsg("");
                    }}
                    className="btn-outline"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                </div>
              </form>
            )}
          </section>
        </>
      );
    }

    if (authMode === "reset") {
      return (
        <>
          <header className="page-header">
            <h1>
              Set New <span style={{ color: "var(--jhub-green)" }}>Password</span>
            </h1>
            <p>
              Choose a strong, secure password for your administrator account.
            </p>
          </header>
          <section
            className="content-section"
            style={{ maxWidth: 460, margin: "0 auto" }}
          >
            {successMsg ? (
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                  textAlign: "center",
                  display: "grid",
                  gap: "1rem",
                }}
              >
                <div style={{ color: "#166534", fontSize: "1rem", fontWeight: 700 }}>
                  {successMsg}
                </div>
                <p style={{ color: "#15803d", fontSize: "0.9rem", margin: 0 }}>
                  Redirecting you to sign in...
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setResetToken(null);
                    setErr("");
                    setSuccessMsg("");
                  }}
                  className="btn-primary"
                  style={{ justifySelf: "center", marginTop: "0.5rem" }}
                >
                  Sign In Now
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleCompleteReset}
                style={{ display: "grid", gap: "1rem" }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--jhub-blue)", marginBottom: "0.4rem" }}>
                    New Password (min. 8 characters)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      autoFocus
                      required
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles['input-style']}
                      style={{ paddingRight: "2.75rem", width: "100%" }}
                      aria-label="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748b",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--jhub-blue)", marginBottom: "0.4rem" }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles['input-style']}
                      style={{ paddingRight: "2.75rem", width: "100%" }}
                      aria-label="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748b",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {err && (
                  <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{err}</div>
                )}

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.5rem" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      opacity: loading ? 0.65 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading && <Loader2 className="animate-spin" size={16} />}
                    <span>{loading ? "Updating password..." : "Update Password"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setErr("");
                      setSuccessMsg("");
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </>
      );
    }

    // Default: Login View
    return (
      <>
        <header className="page-header">
          <h1>
            Admin <span style={{ color: "var(--jhub-green)" }}>Access</span>
          </h1>
          <p>
            Sign in with your email and password to manage news, events and innovations.
          </p>
        </header>
        <section
          className="content-section"
          style={{ maxWidth: 460, margin: "0 auto" }}
        >
          {successMsg && (
            <div
              style={{
                padding: "0.85rem 1.25rem",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                color: "#166534",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              {successMsg}
            </div>
          )}

          <form
            onSubmit={tryUnlock}
            style={{ display: "grid", gap: "1rem" }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--jhub-blue)", marginBottom: "0.4rem" }}>
                Admin Email
              </label>
              <input
                autoFocus
                required
                type="email"
                placeholder="admin@jhub.africa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles['input-style']}
                style={{ width: "100%" }}
                aria-label="Admin email"
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--jhub-blue)" }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("forgot");
                    setErr("");
                    setSuccessMsg("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--jhub-green)",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles['input-style']}
                  style={{ paddingRight: "2.75rem", width: "100%" }}
                  aria-label="Admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {err && (
              <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{err}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                justifySelf: "start",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "0.25rem",
              }}
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1>
          Manage <span style={{ color: "var(--jhub-green)" }}>Content</span>
        </h1>
        <p>
          Add, edit or remove news posts, events and innovations. Changes save
          to the server database instantly.
        </p>
        <button
          onClick={lock}
          className="btn-outline"
          style={{ marginTop: "0.75rem" }}
        >
          Lock admin
        </button>
      </header>

      <NewsAdmin items={news} onDeleteRequest={requestDelete} />
      <EventsAdmin items={events} onDeleteRequest={requestDelete} />
      <InnovationsAdmin items={innovations} onDeleteRequest={requestDelete} />
      <CoursesAdmin items={courses} onDeleteRequest={requestDelete} />
      <TeamAdmin items={team} onDeleteRequest={requestDelete} />
      <AdminUsersManager />
      <EmailAdmin />

      {confirmDelete.isOpen && (
        <div className={styles['modal-overlay-style']}>
          <div className={styles['modal-content-style']}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#1e293b", fontSize: "1.25rem", fontWeight: 700 }}>Confirm Deletion</h3>
            <p style={{ margin: "0 0 1.5rem 0", color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>{confirmDelete.title}</strong>? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                className="btn-outline"
                type="button"
                disabled={isDeleting}
                onClick={() => !isDeleting && setConfirmDelete({ ...confirmDelete, isOpen: false })}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.65 : 1,
                  fontSize: "0.9rem",
                  transition: "opacity 0.2s ease",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    const scrollPos = typeof window !== "undefined" ? window.scrollY : 0;
                    await confirmDelete.onConfirm();
                    setConfirmDelete({ ...confirmDelete, isOpen: false });
                    setTimeout(() => {
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: scrollPos, behavior: "instant" });
                      }
                    }, 50);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.5rem 1.25rem",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.65 : 1,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "opacity 0.2s ease",
                }}
              >
                {isDeleting && <Loader2 className="animate-spin" size={16} />}
                <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- News admin ---------- */

interface NewsAdminProps {
  items: NewsPost[];
  onDeleteRequest: (title: string, onConfirm: () => Promise<void>) => void;
}

function NewsAdmin({ items, onDeleteRequest }: NewsAdminProps) {
  const {
    draft,
    setDraft,
    msg,
    submitting,
    deletingId,
    submit,
    edit,
    remove,
    resetDraft,
  } = useNewsAdmin();

  return (
    <section id="admin-news-section" className="content-section">
      <h2 style={{ marginBottom: "1rem" }}>News posts</h2>

      <form onSubmit={submit} className={styles['form-grid']}>
        <InputField
          required
          label="Title"
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={styles['input-style']}
        />
        <InputField
          required
          type="date"
          label="Publish Date"
          value={(() => {
            if (!draft.date) return "";
            const d = new Date(draft.date);
            return isNaN(d.getTime()) ? "" : dateToLocalYmd(d);
          })()}
          className={styles['input-style']}
          onChange={(e) => {
            if (e.target.value) {
              const d = localYmdToDate(e.target.value);
              const formatted = d.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });
              setDraft({ ...draft, date: formatted });
            }
          }}
        />
        <InputField
          required
          label="Tag"
          placeholder="Tag (e.g. Announcement)"
          value={draft.tag}
          onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
          className={styles['input-style']}
        />
        <InputField
          label="Author (Written By)"
          placeholder="e.g. Dr. Jane Mwangi or JHUB Editorial Team"
          value={draft.author || ""}
          onChange={(e) => setDraft({ ...draft, author: e.target.value })}
          className={styles['input-style']}
        />
        <InputField
          type="date"
          label="Publication Date"
          value={draft.publishedAt || ""}
          onChange={(e) => {
            const ymd = e.target.value;
            const d = new Date(ymd);
            const formatted = isNaN(d.getTime())
              ? ymd
              : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            setDraft({ ...draft, publishedAt: ymd, date: formatted });
          }}
          className={styles['input-style']}
        />
        <SelectField
          label="Publication Status"
          value={draft.status || "PUBLISHED"}
          onChange={(e) =>
            setDraft({
              ...draft,
              status: e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
            })
          }
          className={styles['input-style']}
        >
          <option value="PUBLISHED">Status: Published (Visible to public)</option>
          <option value="DRAFT">Status: Draft (Hidden from public)</option>
          <option value="ARCHIVED">Status: Archived</option>
        </SelectField>
        <SelectField
          label="Tag Color"
          value={draft.color}
          onChange={(e) =>
            setDraft({ ...draft, color: e.target.value as NewsPost["color"] })
          }
          className={styles['input-style']}
        >
          <option value="g">Tag: Green</option>
          <option value="b">Tag: Blue</option>
          <option value="p">Tag: Pink/Red</option>
        </SelectField>
        <SelectField
          label="Title Color"
          value={draft.titleColor}
          onChange={(e) =>
            setDraft({
              ...draft,
              titleColor: e.target.value as NewsPost["titleColor"],
            })
          }
          className={styles['input-style']}
        >
          <option value="">Title: Default</option>
          <option value="green">Title: Green</option>
          <option value="red">Title: Red (Featured)</option>
        </SelectField>
        {/* TipTap Rich Text Editor for Content Story */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.95rem" }}>
            Full Story (Rich Content)
          </label>
          <RichTextEditor
            content={draft.body}
            jsonContent={draft.contentJson}
            onChange={(html, json) => {
              // Auto-generate excerpt if excerpt is empty or unmodified
              const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
              const autoExcerpt = plain.length > 140 ? plain.substring(0, 140).trim() + "..." : plain;

              setDraft((prev: any) => ({
                ...prev,
                body: html,
                contentJson: json,
                excerpt: (!prev.excerpt || prev.isExcerptAuto) ? autoExcerpt : prev.excerpt,
                isExcerptAuto: !prev.excerpt || prev.isExcerptAuto,
              }));
            }}
            placeholder="Write the full story, add subheadings, quotes, lists..."
          />
        </div>

        {/* Auto-extracted Summary Excerpt Field */}
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
            <label style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
              Summary / Excerpt <span style={{ fontWeight: 400, color: "#64748b", fontSize: "0.85rem" }}>(Auto-extracted from story for card display)</span>
            </label>
            <button
              type="button"
              onClick={() => {
                const plain = (draft.body || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
                const autoExcerpt = plain.length > 140 ? plain.substring(0, 140).trim() + "..." : plain;
                setDraft((prev: any) => ({ ...prev, excerpt: autoExcerpt, isExcerptAuto: true }));
              }}
              style={{
                fontSize: "0.8rem",
                color: "var(--jhub-blue, #0f2d59)",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                padding: "3px 10px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              🔄 Auto-extract from story
            </button>
          </div>
          <textarea
            rows={2}
            placeholder="Auto-extracted snippet from full story (max 150 chars)..."
            value={draft.excerpt}
            onChange={(e) => setDraft((prev: any) => ({ ...prev, excerpt: e.target.value, isExcerptAuto: false }))}
            className={styles['input-style']}
            style={{ width: "100%", resize: "vertical" }}
          />
        </div>

        {/* Multi-Image Gallery & Upload Manager */}
        <MultiImageManager
          images={draft.images && draft.images.length > 0 ? draft.images : (draft.image ? [draft.image] : [])}
          bucket="post-images"
          label="Post Images & Gallery"
          helperText="Upload 1 or more images. Drag to reorder. The first photo (#1) is the main hero cover."
          onChange={(newImages) => {
            setDraft({
              ...draft,
              images: newImages,
              image: newImages[0]?.url || "",
            });
          }}
        />

        <AdminFormActions
          submitting={submitting}
          submitLabel={"id" in draft && draft.id ? "Update post" : "Add post"}
          isEditing={Boolean("id" in draft && draft.id)}
          onCancel={resetDraft}
        >
          {msg && (
            <span style={{ color: "var(--jhub-green)", fontSize: "0.9rem" }}>
              {msg}
            </span>
          )}
        </AdminFormActions>
      </form>

      <ul className={styles['list-style']}>
        {items.map((p) => (
          <li key={p.id} className={styles['row-style']}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <strong>{p.title}</strong>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor: p.status === "DRAFT" ? "#fef3c7" : p.status === "ARCHIVED" ? "#f1f5f9" : "#dcfce7",
                    color: p.status === "DRAFT" ? "#92400e" : p.status === "ARCHIVED" ? "#475569" : "#166534",
                  }}
                >
                  {p.status || "PUBLISHED"}
                </span>
                {p.images && p.images.length > 1 && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 600,
                      backgroundColor: "#e0f2fe",
                      color: "#0369a1",
                    }}
                  >
                    📷 {p.images.length} images
                  </span>
                )}
              </div>
              <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>
                · {p.date} · {p.tag}
              </span>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: 4 }}>
                <strong>Summary:</strong> {p.excerpt}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className="btn-outline" onClick={() => edit(p)} disabled={deletingId === p.id}>
                Edit
              </button>
              <button
                className="btn-outline"
                disabled={deletingId === p.id}
                onClick={() => onDeleteRequest(p.title, () => remove(p.id, true))}
                style={{
                  color: "#b91c1c",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  opacity: deletingId === p.id ? 0.65 : 1,
                  cursor: deletingId === p.id ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s ease",
                }}
              >
                {deletingId === p.id && <Loader2 className="animate-spin" size={14} />}
                <span>{deletingId === p.id ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Events admin ---------- */

interface EventsAdminProps {
  items: EventItem[];
  onDeleteRequest: (title: string, onConfirm: () => Promise<void>) => void;
}

function EventsAdmin({ items, onDeleteRequest }: EventsAdminProps) {
  const {
    draft,
    setDraft,
    msg,
    submitting,
    deletingId,
    submit,
    edit,
    remove,
    handleImageUpload,
    resetDraft,
  } = useEventAdmin();

  return (
    <section id="admin-events-section" className="content-section">
      <h2 style={{ marginBottom: "1rem" }}>Events</h2>

      <form onSubmit={submit} className={styles['form-grid']}>
        <InputField
          required
          label="Title"
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={styles['input-style']}
        />
        <InputField
          label="Venue / Location"
          placeholder="e.g. JKUAT Assembly Hall & Maker Space"
          value={draft.location || ""}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          className={styles['input-style']}
        />
        <InputField
          required
          type="date"
          label="Event Date"
          value={(() => {
            if (!draft.startDateISO) return "";
            const d = new Date(draft.startDateISO);
            return isNaN(d.getTime()) ? "" : dateToLocalYmd(d);
          })()}
          className={styles['input-style']}
          onChange={(e) => {
            if (e.target.value) {
              const d = localYmdToDate(e.target.value);
              const day = d.getDate().toString().padStart(2, "0");
              const month = d.toLocaleDateString("en-US", { month: "short" });
              setDraft({ ...draft, day, month, startDateISO: d.toISOString() });
            }
          }}
        />
        <SelectField
          label="Theme Color"
          value={draft.titleColor}
          onChange={(e) =>
            setDraft({
              ...draft,
              titleColor: e.target.value as EventItem["titleColor"],
            })
          }
          className={styles['input-style']}
        >
          <option value="">Title: Default</option>
          <option value="green">Title: Green</option>
          <option value="red">Title: Red</option>
        </SelectField>
        <TextareaField
          required
          rows={3}
          label="Description"
          placeholder="Description"
          value={draft.desc}
          onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
          className={styles['input-style']} style={{ gridColumn: "1 / -1", resize: "vertical" }}
        />
        <AdminImageUpload
          onFileSelected={(file) => {
            void handleImageUpload(file);
          }}
          previewUrl={draft.image}
        />
        <AdminFormActions
          submitting={submitting}
          submitLabel={"id" in draft && draft.id ? "Update event" : "Add event"}
          isEditing={Boolean("id" in draft && draft.id)}
          onCancel={resetDraft}
        >
          {msg && (
            <span style={{ color: "var(--jhub-green)", fontSize: "0.9rem" }}>
              {msg}
            </span>
          )}
        </AdminFormActions>
      </form>

      <ul className={styles['list-style']}>
        {items.map((p) => (
          <li key={p.id} className={styles['row-style']}>
            <div>
              <strong>
                {p.day} {p.month}
              </strong>{" "}
              — <strong>{p.title}</strong>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: 4 }}>
                {p.desc}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className="btn-outline" onClick={() => edit(p)} disabled={deletingId === p.id}>
                Edit
              </button>
              <button
                className="btn-outline"
                disabled={deletingId === p.id}
                onClick={() => onDeleteRequest(p.title, () => remove(p.id, true))}
                style={{
                  color: "#b91c1c",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  opacity: deletingId === p.id ? 0.65 : 1,
                  cursor: deletingId === p.id ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s ease",
                }}
              >
                {deletingId === p.id && <Loader2 className="animate-spin" size={14} />}
                <span>{deletingId === p.id ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Innovations admin ---------- */

interface InnovationsAdminProps {
  items: InnovationItem[];
  onDeleteRequest: (title: string, onConfirm: () => Promise<void>) => void;
}

function InnovationsAdmin({ items, onDeleteRequest }: InnovationsAdminProps) {
  const { draft, setDraft, msg, submitting, deletingId, submit, edit, remove, handleImageUpload, resetDraft } =
    useInnovationAdmin();

  return (
    <section id="admin-innovations-section" className="content-section">
      <h2 style={{ marginBottom: "1rem" }}>Innovations</h2>

      <form onSubmit={submit} className={styles['form-grid']}>
        <InputField
          required
          label="Title"
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={styles['input-style']}
        />
        <SelectField
          label="Sector"
          value={draft.sector || "Big AI Ideas"}
          onChange={(e) => setDraft({ ...draft, sector: e.target.value })}
          className={styles['input-style']}
        >
          <option value="Big AI Ideas">Big AI Ideas</option>
          <option value="Climate Smart Agriculture">Climate Smart Agriculture</option>
          <option value="Digital Trade">Digital Trade</option>
          <option value="Digital Tranformation">Digital Tranformation</option>
          <option value="Digital Twin Models">Digital Twin Models</option>
          <option value="Gaming">Gaming</option>
          <option value="Green Digital Innovationt">Green Digital Innovationt</option>
        </SelectField>
        <SelectField
          label="Development Stage"
          value={draft.stage}
          onChange={(e) =>
            setDraft({
              ...draft,
              stage: e.target.value as InnovationItem["stage"],
            })
          }
          className={styles['input-style']}
        >
          <option value="Concept">Concept</option>
          <option value="Prototype">Prototype</option>
          <option value="Pilot">Pilot</option>
          <option value="Market entry">Market entry</option>
          <option value="Scale">Scale</option>
        </SelectField>
        <SelectField
          label="Approval Status"
          value={draft.status || "APPROVED"}
          onChange={(e) =>
            setDraft({
              ...draft,
              status: e.target.value,
            })
          }
          className={styles['input-style']}
        >
          <option value="DRAFT">Status: Draft</option>
          <option value="PENDING">Status: Pending</option>
          <option value="UNDER_REVIEW">Status: Under Review</option>
          <option value="APPROVED">Status: Approved</option>
          <option value="REJECTED">Status: Rejected</option>
        </SelectField>
        <InputField
          required
          label="Support Need"
          placeholder="Support need"
          value={draft.need}
          onChange={(e) => setDraft({ ...draft, need: e.target.value })}
          className={styles['input-style']}
        />
        <TextareaField
          required
          rows={3}
          label="Description"
          placeholder="Short project description for the card overview"
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          className={styles['input-style']} style={{ gridColumn: "1 / -1", resize: "vertical" }}
        />
        <TextareaField
          required
          rows={3}
          label="Problem Statement"
          placeholder="Problem"
          value={draft.problem}
          onChange={(e) => setDraft({ ...draft, problem: e.target.value })}
          className={styles['input-style']} style={{ gridColumn: "1 / -1", resize: "vertical" }}
        />
        <TextareaField
          required
          rows={3}
          label="Proposed Solution"
          placeholder="Solution"
          value={draft.solution}
          onChange={(e) => setDraft({ ...draft, solution: e.target.value })}
          className={styles['input-style']} style={{ gridColumn: "1 / -1", resize: "vertical" }}
        />
        <AdminImageUpload
          onFileSelected={(file) => {
            void handleImageUpload(file);
          }}
          previewUrl={draft.coverImageUrl}
        />

        {/* Team Members Editor Section */}
        <div style={{ gridColumn: "1 / -1", border: "1px solid var(--border-color)", padding: "1.5rem", borderRadius: "10px", backgroundColor: "#ffffff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#111" }}>Team Members</h3>
            <button
              type="button"
              onClick={() => {
                const members = draft.teamMembers || [];
                setDraft({
                  ...draft,
                  teamMembers: [...members, { name: "", role: "" }],
                });
              }}
              style={{
                backgroundColor: "var(--jhub-green)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.4rem 0.8rem",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              + Add Member
            </button>
          </div>

          {(draft.teamMembers || []).length === 0 ? (
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#666", fontStyle: "italic" }}>
              No team members added yet. Specify team members here to showcase them on the project details view page.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(draft.teamMembers || []).map((m, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={m.name}
                    onChange={(e) => {
                      const updated = [...(draft.teamMembers || [])];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setDraft({ ...draft, teamMembers: updated });
                    }}
                    className={styles['input-style']}
                    style={{
                      flex: 1,
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                    }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Role (e.g. Lead Developer)"
                    value={m.role}
                    onChange={(e) => {
                      const updated = [...(draft.teamMembers || [])];
                      updated[idx] = { ...updated[idx], role: e.target.value };
                      setDraft({ ...draft, teamMembers: updated });
                    }}
                    className={styles['input-style']}
                    style={{
                      flex: 1,
                      padding: "0.5rem 0.75rem",
                      borderRadius: "6px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (draft.teamMembers || []).filter((_, i) => i !== idx);
                      setDraft({ ...draft, teamMembers: updated });
                    }}
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#991b1b",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Remove Member"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AdminFormActions
          submitting={submitting}
          submitLabel={
            "id" in draft && draft.id ? "Update innovation" : "Add innovation"
          }
          isEditing={Boolean("id" in draft && draft.id)}
          onCancel={resetDraft}
        >
          {msg && (
            <span style={{ color: "var(--jhub-green)", fontSize: "0.9rem" }}>
              {msg}
            </span>
          )}
        </AdminFormActions>
      </form>

      <ul className={styles['list-style']}>
        {items.map((item) => (
          <li key={item.id} className={styles['row-style']}>
            <div>
              <strong>{item.title}</strong>{" "}
              <span style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "999px",
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
                fontWeight: 600,
                display: "inline-block",
                verticalAlign: "middle",
                backgroundColor: 
                  item.status === "APPROVED" ? "#dcfce7" :
                  item.status === "REJECTED" ? "#fee2e2" :
                  item.status === "PENDING" ? "#fef9c3" :
                  item.status === "UNDER_REVIEW" ? "#dbeafe" :
                  "#f1f5f9",
                color:
                  item.status === "APPROVED" ? "#166534" :
                  item.status === "REJECTED" ? "#991b1b" :
                  item.status === "PENDING" ? "#854d0e" :
                  item.status === "UNDER_REVIEW" ? "#1e40af" :
                  "#475569"
              }}>
                {item.status || "DRAFT"}
              </span>{" "}
              <span style={{ opacity: 0.6 }}>
                · {item.sector} · {item.stage}
              </span>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: 4 }}>
                {item.problem}
              </div>
              {item.teamMembers && item.teamMembers.length > 0 && (
                <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: 8, display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>Team:</span>
                  {item.teamMembers.map((m, idx) => (
                    <span key={idx} style={{ background: "#f1f5f9", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                      {m.name} ({m.role})
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className="btn-outline" onClick={() => edit(item)} disabled={deletingId === item.id}>
                Edit
              </button>
              <button
                className="btn-outline"
                disabled={deletingId === item.id}
                onClick={() => onDeleteRequest(item.title, () => remove(item.id, true))}
                style={{
                  color: "#b91c1c",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  opacity: deletingId === item.id ? 0.65 : 1,
                  cursor: deletingId === item.id ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s ease",
                }}
              >
                {deletingId === item.id && <Loader2 className="animate-spin" size={14} />}
                <span>{deletingId === item.id ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Courses admin ---------- */

interface CoursesAdminProps {
  items: CourseItem[];
  onDeleteRequest: (title: string, onConfirm: () => Promise<void>) => void;
}

function CoursesAdmin({ items, onDeleteRequest }: CoursesAdminProps) {
  const { draft, setDraft, msg, submitting, deletingId, submit, edit, remove, resetDraft } =
    useCourseAdmin();

  return (
    <section id="admin-courses-section" className="content-section">
      <h2 style={{ marginBottom: "1rem" }}>Courses</h2>

      <form onSubmit={submit} className={styles['form-grid']}>
        <InputField
          required
          label="Course Title"
          placeholder="Course Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={styles['input-style']}
        />
        <InputField
          required
          label="Category"
          placeholder="Category (e.g. Software, Data)"
          value={draft.category || ""}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          className={styles['input-style']}
        />
        <SelectField
          label="Delivery Mode"
          value={draft.deliveryMode || "ONLINE"}
          onChange={(e) =>
            setDraft({
              ...draft,
              deliveryMode: e.target.value as CourseItem["deliveryMode"],
            })
          }
          className={styles['input-style']}
        >
          <option value="ONLINE">Delivery: Online</option>
          <option value="IN_PERSON">Delivery: In-Person</option>
          <option value="HYBRID">Delivery: Hybrid</option>
        </SelectField>
        <InputField
          required
          type="number"
          label="Duration (Weeks)"
          placeholder="Duration (Weeks)"
          value={draft.durationWeeks || ""}
          onChange={(e) => setDraft({ ...draft, durationWeeks: Number(e.target.value) })}
          className={styles['input-style']}
        />
        <InputField
          label="Prerequisites"
          placeholder="Prerequisites"
          value={draft.prerequisites || ""}
          onChange={(e) => setDraft({ ...draft, prerequisites: e.target.value })}
          className={styles['input-style']}
        />
        <SelectField
          label="Publication Status"
          value={draft.isPublished ? "true" : "false"}
          onChange={(e) =>
            setDraft({
              ...draft,
              isPublished: e.target.value === "true",
            })
          }
          className={styles['input-style']}
        >
          <option value="true">Status: Published</option>
          <option value="false">Status: Draft (Hidden)</option>
        </SelectField>
        <SelectField
          label="Featured Status"
          value={draft.isFeatured ? "true" : "false"}
          onChange={(e) =>
            setDraft({
              ...draft,
              isFeatured: e.target.value === "true",
            })
          }
          className={styles['input-style']}
        >
          <option value="false">Featured: No</option>
          <option value="true">Featured: Yes</option>
        </SelectField>
        <TextareaField
          required
          rows={3}
          label="Course Description"
          placeholder="Course Description"
          value={draft.desc}
          onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
          className={styles['input-style']} style={{ gridColumn: "1 / -1", resize: "vertical" }}
        />
        <AdminFormActions
          submitting={submitting}
          submitLabel={
            "id" in draft && draft.id ? "Update course" : "Add course"
          }
          isEditing={Boolean("id" in draft && draft.id)}
          onCancel={resetDraft}
        >
          {msg && (
            <span style={{ color: "var(--jhub-green)", fontSize: "0.9rem" }}>
              {msg}
            </span>
          )}
        </AdminFormActions>
      </form>

      <ul className={styles['list-style']}>
        {items.map((item) => (
          <li key={item.id} className={styles['row-style']}>
            <div>
              <strong>{item.title}</strong>{" "}
              <span style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "999px",
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
                fontWeight: 600,
                display: "inline-block",
                verticalAlign: "middle",
                backgroundColor: item.isPublished ? "#dcfce7" : "#fee2e2",
                color: item.isPublished ? "#166534" : "#991b1b"
              }}>
                {item.isPublished ? "PUBLISHED" : "DRAFT"}
              </span>{" "}
              {item.isFeatured && (
                <span style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "999px",
                  marginRight: "0.5rem",
                  fontWeight: 600,
                  display: "inline-block",
                  verticalAlign: "middle",
                  backgroundColor: "#dbeafe",
                  color: "#1e40af"
                }}>
                  FEATURED
                </span>
              )}
              <span style={{ opacity: 0.6 }}>
                · {item.category} · {item.mode} · {item.duration}
              </span>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: 4 }}>
                {item.desc}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className="btn-outline" onClick={() => edit(item)} disabled={deletingId === item.id}>
                Edit
              </button>
              <button
                className="btn-outline"
                disabled={deletingId === item.id}
                onClick={() => onDeleteRequest(item.title, () => remove(item.id, true))}
                style={{
                  color: "#b91c1c",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  opacity: deletingId === item.id ? 0.65 : 1,
                  cursor: deletingId === item.id ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s ease",
                }}
              >
                {deletingId === item.id && <Loader2 className="animate-spin" size={14} />}
                <span>{deletingId === item.id ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Team Members admin ---------- */

interface TeamAdminProps {
  items: JHubTeamMember[];
  onDeleteRequest: (title: string, onConfirm: () => Promise<void>) => void;
}

function TeamAdmin({ items, onDeleteRequest }: TeamAdminProps) {
  const {
    draft,
    setDraft,
    msg,
    submitting,
    deletingId,
    submit,
    edit,
    remove,
    resetDraft,
  } = useTeamAdmin();

  return (
    <section id="admin-team-section" className="content-section">
      <h2 style={{ marginBottom: "0.5rem" }}>Team Members</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
        Manage leadership, staff, mentors and advisors displayed in the About page "Meet Our Team" section.
      </p>

      <form onSubmit={submit} className={styles['form-grid']}>
        <InputField
          required
          label="Full Name"
          placeholder="e.g. Dr. Lawrence Nderu"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className={styles['input-style']}
        />

        <InputField
          required
          label="Role / Title"
          placeholder="e.g. Founder and Project Lead"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={styles['input-style']}
        />

        <SelectField
          label="Category"
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value as any })}
          className={styles['select-style']}
        >
          <option value="EXECUTIVE">Executive Leadership</option>
          <option value="ADVISORY_BOARD">Advisory Board</option>
          <option value="SECRETARIAT">Secretariat / Management</option>
          <option value="DEV_TEAM">Dev Team / Engineering</option>
          <option value="MENTORS">Mentors & Partners</option>
        </SelectField>

        <InputField
          type="number"
          label="Display Order (lower numbers appear first)"
          placeholder="0"
          value={draft.order ?? 0}
          onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
          className={styles['input-style']}
        />

        <div style={{ gridColumn: "1 / -1", display: "grid", gap: "0.5rem" }}>
          <InputField
            label="Profile Photo URL (Large)"
            placeholder="https://... or upload below"
            value={draft.avatarUrl || ""}
            onChange={(e) => setDraft({ ...draft, avatarUrl: e.target.value, avatarThumb: draft.avatarThumb || e.target.value })}
            className={styles['input-style']}
          />
          <AdminImageUpload
            previewUrl={draft.avatarUrl || undefined}
            onFileSelected={async (file: File | null) => {
              if (!file) return;
              try {
                const { adminUploadTeamImage } = await import("../../axios/api/team");
                const uploaded = await adminUploadTeamImage(file);
                if (uploaded?.url) {
                  setDraft({ ...draft, avatarUrl: uploaded.url, avatarThumb: draft.avatarThumb || uploaded.url });
                }
              } catch (e) {
                console.error("Image upload failed:", e);
              }
            }}
          />
        </div>

        <div style={{ gridColumn: "1 / -1", display: "grid", gap: "0.5rem" }}>
          <InputField
            label="Thumbnail Photo URL (Optional 150x150)"
            placeholder="https://... or upload below"
            value={draft.avatarThumb || ""}
            onChange={(e) => setDraft({ ...draft, avatarThumb: e.target.value })}
            className={styles['input-style']}
          />
          <AdminImageUpload
            previewUrl={draft.avatarThumb || undefined}
            onFileSelected={async (file: File | null) => {
              if (!file) return;
              try {
                const { adminUploadTeamImage } = await import("../../axios/api/team");
                const uploaded = await adminUploadTeamImage(file);
                if (uploaded?.url) {
                  setDraft({ ...draft, avatarThumb: uploaded.url });
                }
              } catch (e) {
                console.error("Image upload failed:", e);
              }
            }}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <TextareaField
            label="Biographical Profile"
            placeholder="Detailed background, expertise and achievements..."
            value={draft.bio || ""}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            className={styles['textarea-style']}
            rows={4}
          />
        </div>

        <AdminFormActions
          isEditing={Boolean(draft.id)}
          submitting={submitting}
          submitLabel={draft.id ? "Update Member" : "Add Member"}
          onCancel={resetDraft}
        >
          {msg && (
            <span style={{ fontSize: "0.9rem", color: msg.includes("Error") ? "#dc2626" : "var(--jhub-green)", fontWeight: 600 }}>
              {msg}
            </span>
          )}
        </AdminFormActions>
      </form>

      <h3 style={{ marginTop: "2.5rem", marginBottom: "1rem" }}>
        Existing Team Members ({items.length})
      </h3>

      <ul className={styles['list-style']}>
        {items.map((item) => (
          <li key={item.id} className={styles['list-item-style']}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {item.avatarUrl ? (
                <img
                  src={item.avatarThumb || item.avatarUrl}
                  alt={item.name}
                  style={{ width: 50, height: 50, borderRadius: "10px", objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: 50, height: 50, borderRadius: "10px", backgroundColor: "#e2e8f0", display: "grid", placeItems: "center", fontWeight: 700, color: "#64748b" }}>
                  {item.name.charAt(0)}
                </div>
              )}
              <div>
                <strong style={{ fontSize: "1.05rem", color: "var(--jhub-blue)" }}>{item.name}</strong>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    marginLeft: "0.5rem",
                    fontWeight: 700,
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    color: "var(--jhub-green)",
                  }}
                >
                  {item.category.replace(/_/g, " ")}
                </span>
                <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {item.title} {item.order !== undefined && <span style={{ opacity: 0.6 }}>· Order: {item.order}</span>}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className="btn-outline" onClick={() => edit(item)} disabled={deletingId === item.id}>
                Edit
              </button>
              <button
                className="btn-outline"
                disabled={deletingId === item.id}
                onClick={() => onDeleteRequest(item.name, () => remove(item.id, true))}
                style={{
                  color: "#b91c1c",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  opacity: deletingId === item.id ? 0.65 : 1,
                  cursor: deletingId === item.id ? "not-allowed" : "pointer",
                }}
              >
                {deletingId === item.id && <Loader2 className="animate-spin" size={14} />}
                <span>{deletingId === item.id ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}




