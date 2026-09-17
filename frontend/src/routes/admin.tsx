import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  Newspaper,
  Calendar,
  Lightbulb,
  GraduationCap,
  Users,
  ShieldCheck,
  Mail,
  Trash2,
  LogOut,
  ExternalLink,
  Sparkles,
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { adminLogin, adminLogout, requestPasswordReset, submitPasswordReset } from "../../axios/api/admin/auth";
import { getAdminUsers, createAdminUser, AdminAccountItem } from "../../axios/api/admin/users";
import { getAccessToken, setAccessToken, refreshSession } from "../../axios/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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

function getDraftTeamMemberKey(m: any, idx: number): string {
  return m.id || `draft-member-${idx}`;
}

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
      toast.success("Welcome back! Signed in as administrator.");
      await router.invalidate();
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Invalid email or password.";
      setErr(errMsg);
      toast.error(errMsg);
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
      const msg = response.message || "Password reset instructions have been sent.";
      setSuccessMsg(msg);
      toast.success(msg);
      if (response.devResetUrl) {
        setDevResetUrl(response.devResetUrl);
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.response?.data?.error || "Failed to request password reset.";
      setErr(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteReset(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSuccessMsg("");

    if (newPassword.length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setErr(msg);
      toast.error(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match.";
      setErr(msg);
      toast.error(msg);
      return;
    }

    if (!resetToken) {
      const msg = "Reset token is missing. Please request a new password reset link.";
      setErr(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const response = await submitPasswordReset(resetToken, newPassword);
      const msg = response.message || "Password updated successfully!";
      setSuccessMsg(msg);
      toast.success(msg);
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
      toast.error(errMsg);
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
    toast.info("Admin session locked.");
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
  const [activeTab, setActiveTab] = useState<string>("news");

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
        <div className={styles.authShell}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={styles.authIconWrapper}>
                <ShieldCheck size={26} />
              </div>
              <h1 className={styles.authTitle}>
                Reset <span style={{ color: "#10b981" }}>Password</span>
              </h1>
              <p className={styles.authSubtitle}>
                Enter your administrator email to receive a secure password reset link.
              </p>
            </div>

            {successMsg ? (
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "14px",
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
                  className={styles.authSecondaryBtn}
                  style={{ justifySelf: "center", marginTop: "0.5rem" }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestReset} className={styles.authForm}>
                <div className={styles.authField}>
                  <label htmlFor="forgot-email" className={styles.authLabel}>
                    Administrator Email Address
                  </label>
                  <div className={styles.authInputWrapper}>
                    <input
                      id="forgot-email"
                      autoFocus
                      required
                      type="email"
                      placeholder="admin@jhub.africa"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.authInput}
                      aria-label="Admin email"
                    />
                  </div>
                </div>

                {err && (
                  <div className={styles.authErrorBanner}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{err}</span>
                  </div>
                )}

                <div className={styles.authActionsGroup}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.authSubmitBtn}
                    style={{ flex: 1, marginTop: 0 }}
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
                    className={styles.authSecondaryBtn}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    }

    if (authMode === "reset") {
      return (
        <div className={styles.authShell}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <div className={styles.authIconWrapper}>
                <ShieldCheck size={26} />
              </div>
              <h1 className={styles.authTitle}>
                Set New <span style={{ color: "#10b981" }}>Password</span>
              </h1>
              <p className={styles.authSubtitle}>
                Choose a strong, secure password for your administrator account.
              </p>
            </div>

            {successMsg ? (
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "14px",
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
                  className={styles.authSubmitBtn}
                  style={{ justifySelf: "center", marginTop: "0.5rem" }}
                >
                  Sign In Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleCompleteReset} className={styles.authForm}>
                <div className={styles.authField}>
                  <label htmlFor="new-password" className={styles.authLabel}>
                    New Password (min. 8 characters)
                  </label>
                  <div className={styles.authInputWrapper}>
                    <input
                      id="new-password"
                      autoFocus
                      required
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.authInput}
                      style={{ paddingRight: "2.85rem" }}
                      aria-label="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={styles.authEyeBtn}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      title={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.authField}>
                  <label htmlFor="confirm-password" className={styles.authLabel}>
                    Confirm New Password
                  </label>
                  <div className={styles.authInputWrapper}>
                    <input
                      id="confirm-password"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.authInput}
                      style={{ paddingRight: "2.85rem" }}
                      aria-label="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={styles.authEyeBtn}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {err && (
                  <div className={styles.authErrorBanner}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{err}</span>
                  </div>
                )}

                <div className={styles.authActionsGroup}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.authSubmitBtn}
                    style={{ flex: 1, marginTop: 0 }}
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
                    className={styles.authSecondaryBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      );
    }

    // Default: Login View (Main Sign In Admin Page)
    return (
      <div className={styles.authShell}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authIconWrapper}>
              <ShieldCheck size={28} />
            </div>
            <h1 className={styles.authTitle}>
              Admin <span style={{ color: "#10b981" }}>Access</span>
            </h1>
            <p className={styles.authSubtitle}>
              Sign in with your administrator credentials to manage news, events, and platform operations.
            </p>
          </div>

          {successMsg && (
            <div className={styles.authSuccessBanner} style={{ marginBottom: "1.25rem" }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={tryUnlock} className={styles.authForm}>
            <div className={styles.authField}>
              <label htmlFor="admin-email" className={styles.authLabel}>
                Admin Email
              </label>
              <div className={styles.authInputWrapper}>
                <input
                  id="admin-email"
                  autoFocus
                  required
                  type="email"
                  placeholder="admin@jhub.africa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.authInput}
                  aria-label="Admin email"
                />
              </div>
            </div>

            <div className={styles.authField}>
              <div className={styles.authLabelRow}>
                <label htmlFor="admin-password" className={styles.authLabel}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("forgot");
                    setErr("");
                    setSuccessMsg("");
                  }}
                  className={styles.authForgotBtn}
                >
                  Forgot password?
                </button>
              </div>
              <div className={styles.authInputWrapper}>
                <input
                  id="admin-password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.authInput}
                  style={{ paddingRight: "2.85rem" }}
                  aria-label="Admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.authEyeBtn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {err && (
              <div className={styles.authErrorBanner}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.authSubmitBtn}
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              <span>{loading ? "Signing in..." : "Sign In to Admin"}</span>
            </button>
          </form>

          <Link to="/" className={styles.authFooterLink}>
            <ArrowLeft size={14} />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminShell}>
      <div className={styles.adminContainer}>
        {/* Executive Command Header Card */}
        <header className={styles.adminHeaderCard}>
          {/* Top Row: Status Group on Left, Quick Actions on Right */}
          <div className={styles.adminHeaderCardTop}>
            <div className={styles.adminStatusGroup}>
              <span className={styles.adminStatusBadge}>
                <span className={styles.adminStatusDot}></span>
                JHUB Engine • Active Session
              </span>
              <span style={{ color: "#cbd5e1" }}>•</span>
              <span className={styles.adminGovernanceTag}>JKUAT Tech Hub Governance</span>
            </div>

            <div className={styles.adminHeaderActions}>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.adminLiveSiteLink}
                title="Open public website in a new tab"
              >
                <ExternalLink size={16} />
                <span>View Live Site</span>
              </Link>

              <div className={styles.adminProfileChip}>
                <div className={styles.adminProfileAvatar}>
                  <ShieldCheck size={16} />
                </div>
                <div className={styles.adminProfileText}>
                  <span className={styles.adminProfileName}>
                    {email ? email.split("@")[0] : "Administrator"}
                  </span>
                  <span className={styles.adminProfileRole}>Active Session</span>
                </div>
              </div>

              <button
                onClick={lock}
                className={styles.adminLockBtn}
                aria-label="Lock administrator session"
                title="Lock session and return to sign in"
              >
                <LogOut size={16} />
                <span>Lock Session</span>
              </button>
            </div>
          </div>

          {/* Middle Row: Prominent Title and Subtitle with clear separation */}
          <div className={styles.adminHeaderMain}>
            <h1 className={styles.adminHeaderTitle}>
              Manage <span className={styles.adminHeaderTitleAccent}>Content &amp; Systems</span>
            </h1>
            <p className={styles.adminHeaderSubtitle}>
              Publish news stories, schedule events, showcase innovations, oversee training tracks, and govern platform security.
            </p>
          </div>

          {/* Bottom Row: Spacious Interactive Metric Buttons */}
          <div className={styles.adminMetricsRail}>
            <button
              type="button"
              onClick={() => setActiveTab("news")}
              className={`${styles.adminMetricButton} ${activeTab === "news" ? styles.adminMetricButtonActive : ""}`}
              title="Switch to News Posts"
            >
              <div className={styles.adminMetricIcon} style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
                <Newspaper size={22} />
              </div>
              <div className={styles.adminMetricContent}>
                <span className={styles.adminMetricValue}>{news.length}</span>
                <span className={styles.adminMetricLabel}>News Posts</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`${styles.adminMetricButton} ${activeTab === "events" ? styles.adminMetricButtonActive : ""}`}
              title="Switch to Events"
            >
              <div className={styles.adminMetricIcon} style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                <Calendar size={22} />
              </div>
              <div className={styles.adminMetricContent}>
                <span className={styles.adminMetricValue}>{events.length}</span>
                <span className={styles.adminMetricLabel}>Events</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("innovations")}
              className={`${styles.adminMetricButton} ${activeTab === "innovations" ? styles.adminMetricButtonActive : ""}`}
              title="Switch to Innovations"
            >
              <div className={styles.adminMetricIcon} style={{ backgroundColor: "#fffbeb", color: "#d97706" }}>
                <Lightbulb size={22} />
              </div>
              <div className={styles.adminMetricContent}>
                <span className={styles.adminMetricValue}>{innovations.length}</span>
                <span className={styles.adminMetricLabel}>Innovations</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("courses")}
              className={`${styles.adminMetricButton} ${activeTab === "courses" ? styles.adminMetricButtonActive : ""}`}
              title="Switch to Courses"
            >
              <div className={styles.adminMetricIcon} style={{ backgroundColor: "#faf5ff", color: "#9333ea" }}>
                <GraduationCap size={22} />
              </div>
              <div className={styles.adminMetricContent}>
                <span className={styles.adminMetricValue}>{courses.length}</span>
                <span className={styles.adminMetricLabel}>Courses</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("team")}
              className={`${styles.adminMetricButton} ${activeTab === "team" ? styles.adminMetricButtonActive : ""}`}
              title="Switch to Team Directory"
            >
              <div className={styles.adminMetricIcon} style={{ backgroundColor: "#eef2ff", color: "#4f46e5" }}>
                <Users size={22} />
              </div>
              <div className={styles.adminMetricContent}>
                <span className={styles.adminMetricValue}>{team.length}</span>
                <span className={styles.adminMetricLabel}>Team</span>
              </div>
            </button>
          </div>
        </header>

        {/* The Body: Workspace & Tabs Dock */}
        <div className={styles.adminWorkspace}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* The Row above the Section: Spacious Executive Navigation Dock */}
            <div className={styles.adminNavContainer}>
              <TabsList className={styles.adminNavList}>
                <TabsTrigger value="news" className={styles.adminNavTrigger}>
                  <Newspaper size={18} />
                  <span>News</span>
                  <span className={styles.adminNavBadge}>{news.length}</span>
                </TabsTrigger>

                <TabsTrigger value="events" className={styles.adminNavTrigger}>
                  <Calendar size={18} />
                  <span>Events</span>
                  <span className={styles.adminNavBadge}>{events.length}</span>
                </TabsTrigger>

                <TabsTrigger value="innovations" className={styles.adminNavTrigger}>
                  <Lightbulb size={18} />
                  <span>Innovations</span>
                  <span className={styles.adminNavBadge}>{innovations.length}</span>
                </TabsTrigger>

                <TabsTrigger value="courses" className={styles.adminNavTrigger}>
                  <GraduationCap size={18} />
                  <span>Courses</span>
                  <span className={styles.adminNavBadge}>{courses.length}</span>
                </TabsTrigger>

                <TabsTrigger value="team" className={styles.adminNavTrigger}>
                  <Users size={18} />
                  <span>Team</span>
                  <span className={styles.adminNavBadge}>{team.length}</span>
                </TabsTrigger>

                <TabsTrigger value="users" className={styles.adminNavTrigger}>
                  <ShieldCheck size={18} />
                  <span>Admin Accounts</span>
                </TabsTrigger>

                <TabsTrigger value="email" className={styles.adminNavTrigger}>
                  <Mail size={18} />
                  <span>Email System</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="news" className="outline-none focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 transition-opacity duration-200">
              <NewsAdmin items={news} onDeleteRequest={requestDelete} />
            </TabsContent>

            <TabsContent value="events" className="outline-none focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 transition-opacity duration-200">
              <EventsAdmin items={events} onDeleteRequest={requestDelete} />
            </TabsContent>

            <TabsContent value="innovations" className="outline-none focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 transition-opacity duration-200">
              <InnovationsAdmin items={innovations} onDeleteRequest={requestDelete} />
            </TabsContent>

            <TabsContent value="courses" className="outline-none focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 transition-opacity duration-200">
              <CoursesAdmin items={courses} onDeleteRequest={requestDelete} />
            </TabsContent>

            <TabsContent value="team" className="outline-none focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 transition-opacity duration-200">
              <TeamAdmin items={team} onDeleteRequest={requestDelete} />
            </TabsContent>

            <TabsContent value="users" className="outline-none focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 transition-opacity duration-200">
              <AdminUsersManager />
            </TabsContent>

            <TabsContent value="email" className="outline-none focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:slide-in-from-bottom-1 transition-opacity duration-200">
              <EmailAdmin />
            </TabsContent>
          </Tabs>
        </div>

        <AlertDialog
          open={confirmDelete.isOpen}
          onOpenChange={(open) => {
            if (!isDeleting) {
              setConfirmDelete((prev) => ({ ...prev, isOpen: open }));
            }
          }}
        >
          <AlertDialogContent className="sm:max-w-[480px]">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <Trash2 size={20} />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold text-slate-900">
                    Confirm Deletion
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-slate-500 mt-1">
                    This action cannot be undone.
                  </AlertDialogDescription>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">
                Are you sure you want to delete <strong className="text-slate-900">{confirmDelete.title}</strong>? This item will be permanently removed from the database.
              </p>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-5 gap-2">
              <AlertDialogCancel
                disabled={isDeleting}
                onClick={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))}
                className="rounded-lg border-slate-300 hover:bg-slate-100 text-slate-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    setIsDeleting(true);
                    const targetTitle = confirmDelete.title;
                    await confirmDelete.onConfirm();
                    toast.success(`"${targetTitle}" deleted successfully.`);
                    setConfirmDelete((prev) => ({ ...prev, isOpen: false }));
                  } catch (err: any) {
                    const errorMsg = err?.response?.data?.error || err?.message || "Failed to delete item.";
                    toast.error(errorMsg);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm"
              >
                {isDeleting && <Loader2 className="animate-spin mr-2" size={16} />}
                <span>{isDeleting ? "Deleting..." : "Yes, Delete Permanently"}</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
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
      <div className={styles.adminSectionHeader}>
        <div className={styles.adminSectionTitleGroup}>
          <div className={styles.adminSectionHeadingRow}>
            <div className={styles.adminSectionIconBadge} style={{ backgroundColor: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}>
              <Newspaper size={24} />
            </div>
            <h2 className={styles.adminSectionTitle}>News &amp; Editorial Posts</h2>
          </div>
          <p className={styles.adminSectionSubtitle}>
            Draft, edit, and publish stories with TipTap rich content, multiple images, and automatic summaries.
          </p>
        </div>
        <span className={styles.adminSectionCountBadge} style={{ backgroundColor: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" }}>
          {items.length} Published Posts
        </span>
      </div>

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
          <span style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.95rem" }}>
            Full Story (Rich Content)
          </span>
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
            <label htmlFor="admin-news-excerpt" style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
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
            id="admin-news-excerpt"
            aria-label="Summary / Excerpt"
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
      <div className={styles.adminSectionHeader}>
        <div className={styles.adminSectionTitleGroup}>
          <div className={styles.adminSectionHeadingRow}>
            <div className={styles.adminSectionIconBadge} style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
              <Calendar size={24} />
            </div>
            <h2 className={styles.adminSectionTitle}>Events &amp; Programs Schedule</h2>
          </div>
          <p className={styles.adminSectionSubtitle}>
            Create, update, and manage upcoming hackathons, tech workshops, and innovation challenges.
          </p>
        </div>
        <span className={styles.adminSectionCountBadge} style={{ backgroundColor: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" }}>
          {items.length} Total Events
        </span>
      </div>

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
      <div className={styles.adminSectionHeader}>
        <div className={styles.adminSectionTitleGroup}>
          <div className={styles.adminSectionHeadingRow}>
            <div className={styles.adminSectionIconBadge} style={{ backgroundColor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}>
              <Lightbulb size={24} />
            </div>
            <h2 className={styles.adminSectionTitle}>Innovations &amp; Venture Directory</h2>
          </div>
          <p className={styles.adminSectionSubtitle}>
            Manage student and researcher innovations across AI, climate smart agriculture, and digital transformation.
          </p>
        </div>
        <span className={styles.adminSectionCountBadge} style={{ backgroundColor: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" }}>
          {items.length} Total Innovations
        </span>
      </div>

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
                <div key={getDraftTeamMemberKey(m, idx)} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    aria-label={`Team member ${idx + 1} full name`}
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
                    aria-label={`Team member ${idx + 1} role`}
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
      <div className={styles.adminSectionHeader}>
        <div className={styles.adminSectionTitleGroup}>
          <div className={styles.adminSectionHeadingRow}>
            <div className={styles.adminSectionIconBadge} style={{ backgroundColor: "#faf5ff", color: "#9333ea", border: "1px solid #e9d5ff" }}>
              <GraduationCap size={24} />
            </div>
            <h2 className={styles.adminSectionTitle}>Short Courses &amp; Skills Catalog</h2>
          </div>
          <p className={styles.adminSectionSubtitle}>
            Publish courses, set category tracks, duration, and delivery modes (Online, In-Person, Hybrid).
          </p>
        </div>
        <span className={styles.adminSectionCountBadge} style={{ backgroundColor: "#faf5ff", color: "#6b21a8", border: "1px solid #e9d5ff" }}>
          {items.length} Total Courses
        </span>
      </div>

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
      <div className={styles.adminSectionHeader}>
        <div className={styles.adminSectionTitleGroup}>
          <div className={styles.adminSectionHeadingRow}>
            <div className={styles.adminSectionIconBadge} style={{ backgroundColor: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe" }}>
              <Users size={24} />
            </div>
            <h2 className={styles.adminSectionTitle}>JHUB Team &amp; Faculty Directory</h2>
          </div>
          <p className={styles.adminSectionSubtitle}>
            Manage leadership, staff, mentors, and advisors displayed in the About page "Meet Our Team" section.
          </p>
        </div>
        <span className={styles.adminSectionCountBadge} style={{ backgroundColor: "#eef2ff", color: "#3730a3", border: "1px solid #c7d2fe" }}>
          {items.length} Staff Profiles
        </span>
      </div>

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




