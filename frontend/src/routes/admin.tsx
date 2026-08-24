import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminLogin, adminLogout } from "../../axios/api/admin/auth";
import { getAccessToken, setAccessToken, refreshSession } from "../../axios/axios";
import { getAdminNews } from "../../axios/api/news";
import { getEvents } from "../../axios/api/events";
import { getAdminInnovations } from "../../axios/api/admin/innovations";
import { getAdminCourses } from "../../axios/api/admin/courses";
import { NewsPost } from "../types/news";
import { EventItem } from "../types/events";
import { InnovationItem } from "../types/innovations";
import { CourseItem } from "../types/courses";
import {
  dateToLocalYmd,
  localYmdToDate,
  useEventAdmin,
  useInnovationAdmin,
  useNewsAdmin,
  useCourseAdmin,
} from "@/features/admin/useAdminContent";
import { AdminFormActions } from "@/features/admin/components/AdminFormActions";
import { AdminImageUpload } from "@/features/admin/components/AdminImageUpload";
import { MultiImageManager } from "@/features/admin/components/MultiImageManager";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { InputField } from "@/features/admin/components/InputField";
import { TextareaField } from "@/features/admin/components/TextareaField";
import { SelectField } from "@/features/admin/components/SelectField";
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
      return { news: [], events: [], innovations: [], courses: [] };
    }

    try {
      const [news, events, innovations, courses] = await Promise.all([
        getAdminNews(),
        getEvents(),
        getAdminInnovations(),
        getAdminCourses(),
      ]);
      return { news, events, innovations, courses };
    } catch (error: any) {
      console.warn("Loader failed to load admin content:", error);
      if (error?.response?.status === 401) {
        setAccessToken(null);
      }
      return { news: [], events: [], innovations: [], courses: [] };
    }
  },
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { news, events, innovations, courses } = Route.useLoaderData();

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
  }, []);

  async function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
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

  const requestDelete = (title: string, onConfirm: () => Promise<void>) => {
    setConfirmDelete({
      isOpen: true,
      title,
      onConfirm,
    });
  };

  if (!unlocked) {
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
          <form
            onSubmit={tryUnlock}
            style={{ display: "grid", gap: "0.85rem" }}
          >
            <input
              autoFocus
              required
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles['input-style']}
              aria-label="Admin email"
            />
            <input
              required
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles['input-style']}
              aria-label="Admin password"
            />
            {err && (
              <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{err}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifySelf: "start" }}
            >
              {loading ? "Signing in..." : "Sign In"}
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
                onClick={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await confirmDelete.onConfirm();
                  setConfirmDelete({ ...confirmDelete, isOpen: false });
                }}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.5rem 1.25rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Yes, Delete
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
    submit,
    edit,
    remove,
    resetDraft,
  } = useNewsAdmin();

  return (
    <section className="content-section">
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
        <TextareaField
          required
          rows={2}
          label="Summary (Excerpt)"
          placeholder="Brief summary displayed on the card (max 150 chars)"
          value={draft.excerpt}
          onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          className={styles['input-style']} style={{ gridColumn: "1 / -1", resize: "vertical" }}
        />

        {/* TipTap Rich Text Editor for Content Story */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#1e293b", fontSize: "0.95rem" }}>
            Full Story (Rich Content)
          </label>
          <RichTextEditor
            content={draft.body}
            jsonContent={draft.contentJson}
            onChange={(html, json) => {
              setDraft({
                ...draft,
                body: html,
                contentJson: json,
              });
            }}
            placeholder="Write the full story, add subheadings, quotes, lists..."
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
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-outline" onClick={() => edit(p)}>
                Edit
              </button>
              <button
                className="btn-outline"
                onClick={() => onDeleteRequest(p.title, () => remove(p.id, true))}
                style={{ color: "#b91c1c" }}
              >
                Delete
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
    submit,
    edit,
    remove,
    handleImageUpload,
    resetDraft,
  } = useEventAdmin();

  return (
    <section className="content-section">
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
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-outline" onClick={() => edit(p)}>
                Edit
              </button>
              <button
                className="btn-outline"
                onClick={() => onDeleteRequest(p.title, () => remove(p.id, true))}
                style={{ color: "#b91c1c" }}
              >
                Delete
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
  const { draft, setDraft, msg, submitting, submit, edit, remove, handleImageUpload, resetDraft } =
    useInnovationAdmin();

  return (
    <section className="content-section">
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
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-outline" onClick={() => edit(item)}>
                Edit
              </button>
              <button
                className="btn-outline"
                onClick={() => onDeleteRequest(item.title, () => remove(item.id, true))}
                style={{ color: "#b91c1c" }}
              >
                Delete
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
  const { draft, setDraft, msg, submitting, submit, edit, remove, resetDraft } =
    useCourseAdmin();

  return (
    <section className="content-section">
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
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-outline" onClick={() => edit(item)}>
                Edit
              </button>
              <button
                className="btn-outline"
                onClick={() => onDeleteRequest(item.title, () => remove(item.id, true))}
                style={{ color: "#b91c1c" }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

