import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminLogin, adminLogout } from "../../axios/api/admin/auth";
import { getNews } from "../../axios/api/news";
import { getEvents } from "../../axios/api/events";
import { getAdminInnovations } from "../../axios/api/admin/innovations";
import { NewsPost } from "../types/news";
import { EventItem } from "../types/events";
import { InnovationItem } from "../types/innovations";
import {
  dateToLocalYmd,
  localYmdToDate,
  useEventAdmin,
  useInnovationAdmin,
  useNewsAdmin,
} from "@/features/admin/useAdminContent";
import { AdminFormActions } from "@/features/admin/components/AdminFormActions";
import { AdminImageUpload } from "@/features/admin/components/AdminImageUpload";
import { InputField } from "@/features/admin/components/InputField";
import { TextareaField } from "@/features/admin/components/TextareaField";
import { SelectField } from "@/features/admin/components/SelectField";

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
    const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("jhub_admin_token"));
    if (!hasToken) {
      return { news: [], events: [], innovations: [] };
    }

    try {
      const [news, events, innovations] = await Promise.all([
        getNews(),
        getEvents(),
        getAdminInnovations(),
      ]);
      return { news, events, innovations };
    } catch (error: any) {
      console.warn("Loader failed to load admin content, likely expired session:", error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("jhub_admin_token");
        localStorage.removeItem("jhub_admin_refresh_token");
      }
      return { news: [], events: [], innovations: [] };
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
  const { news, events, innovations } = Route.useLoaderData();

  useEffect(() => {
    if (localStorage.getItem("jhub_admin_token")) setUnlocked(true);
  }, []);

  async function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const response = await adminLogin(email, password);
      localStorage.setItem("jhub_admin_token", response.token);
      localStorage.setItem("jhub_admin_refresh_token", response.refreshToken);
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
    localStorage.removeItem("jhub_admin_token");
    localStorage.removeItem("jhub_admin_refresh_token");
    setUnlocked(false);
    setEmail("");
    setPassword("");
    await router.invalidate();
  }

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
              style={inputStyle}
              aria-label="Admin email"
            />
            <input
              required
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
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

      <NewsAdmin items={news} />
      <EventsAdmin items={events} />
      <InnovationsAdmin items={innovations} />
    </>
  );
}

/* ---------- News admin ---------- */

interface NewsAdminProps {
  items: NewsPost[];
}

function NewsAdmin({ items }: NewsAdminProps) {
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
  } = useNewsAdmin();

  return (
    <section className="content-section">
      <h2 style={{ marginBottom: "1rem" }}>News posts</h2>

      <form onSubmit={submit} style={formGrid}>
        <InputField
          required
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          style={inputStyle}
        />
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Publish Date
          </label>
          <input
            required
            type="date"
            value={(() => {
              if (!draft.date) return "";
              const d = new Date(draft.date);
              return isNaN(d.getTime()) ? "" : dateToLocalYmd(d);
            })()}
            style={inputStyle}
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
        </div>
        <InputField
          required
          placeholder="Tag (e.g. Announcement)"
          value={draft.tag}
          onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
          style={inputStyle}
        />
        <SelectField
          value={draft.color}
          onChange={(e) =>
            setDraft({ ...draft, color: e.target.value as NewsPost["color"] })
          }
          style={inputStyle}
        >
          <option value="g">Tag: Green</option>
          <option value="b">Tag: Blue</option>
          <option value="p">Tag: Pink/Red</option>
        </SelectField>
        <select
          value={draft.titleColor}
          onChange={(e) =>
            setDraft({
              ...draft,
              titleColor: e.target.value as NewsPost["titleColor"],
            })
          }
          style={inputStyle}
        >
          <option value="">Title: Default</option>
          <option value="green">Title: Green</option>
          <option value="red">Title: Red</option>
        </select>
        <TextareaField
          required
          rows={4}
          placeholder="Body"
          value={draft.body}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }}
        />
        <AdminImageUpload
          onFileSelected={(file) => {
            void handleImageUpload(file);
          }}
          previewUrl={draft.image}
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

      <ul style={listStyle}>
        {items.map((p) => (
          <li key={p.id} style={rowStyle}>
            <div>
              <strong>{p.title}</strong>{" "}
              <span style={{ opacity: 0.6 }}>
                · {p.date} · {p.tag}
              </span>
              <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: 4 }}>
                {p.body}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-outline" onClick={() => edit(p)}>
                Edit
              </button>
              <button
                className="btn-outline"
                onClick={() => remove(p.id)}
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
}

function EventsAdmin({ items }: EventsAdminProps) {
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

      <form onSubmit={submit} style={formGrid}>
        <InputField
          required
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          style={inputStyle}
        />
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <label
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Event Date
          </label>
          <input
            required
            type="date"
            value={(() => {
              if (!draft.day || !draft.month) return "";
              const currentYear = new Date().getFullYear();
              const d = new Date(`${draft.month} ${draft.day}, ${currentYear}`);
              return isNaN(d.getTime()) ? "" : dateToLocalYmd(d);
            })()}
            style={inputStyle}
            onChange={(e) => {
              if (e.target.value) {
                const d = localYmdToDate(e.target.value);
                const day = d.getDate().toString().padStart(2, "0");
                const month = d.toLocaleDateString("en-US", { month: "short" });
                setDraft({ ...draft, day, month });
              }
            }}
          />
        </div>
        <SelectField
          value={draft.titleColor}
          onChange={(e) =>
            setDraft({
              ...draft,
              titleColor: e.target.value as EventItem["titleColor"],
            })
          }
          style={inputStyle}
        >
          <option value="">Title: Default</option>
          <option value="green">Title: Green</option>
          <option value="red">Title: Red</option>
        </SelectField>
        <TextareaField
          required
          rows={3}
          placeholder="Description"
          value={draft.desc}
          onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
          style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }}
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

      <ul style={listStyle}>
        {items.map((p) => (
          <li key={p.id} style={rowStyle}>
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
                onClick={() => remove(p.id)}
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
}

function InnovationsAdmin({ items }: InnovationsAdminProps) {
  const { draft, setDraft, msg, submitting, submit, edit, remove, resetDraft } =
    useInnovationAdmin();

  return (
    <section className="content-section">
      <h2 style={{ marginBottom: "1rem" }}>Innovations</h2>

      <form onSubmit={submit} style={formGrid}>
        <InputField
          required
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          style={inputStyle}
        />
        <InputField
          required
          placeholder="Sector"
          value={draft.sector}
          onChange={(e) => setDraft({ ...draft, sector: e.target.value })}
          style={inputStyle}
        />
        <SelectField
          value={draft.stage}
          onChange={(e) =>
            setDraft({
              ...draft,
              stage: e.target.value as InnovationItem["stage"],
            })
          }
          style={inputStyle}
        >
          <option value="Concept">Concept</option>
          <option value="Prototype">Prototype</option>
          <option value="Pilot">Pilot</option>
          <option value="Market entry">Market entry</option>
          <option value="Scale">Scale</option>
        </SelectField>
        <SelectField
          value={draft.status || "APPROVED"}
          onChange={(e) =>
            setDraft({
              ...draft,
              status: e.target.value,
            })
          }
          style={inputStyle}
        >
          <option value="DRAFT">Status: Draft</option>
          <option value="PENDING">Status: Pending</option>
          <option value="UNDER_REVIEW">Status: Under Review</option>
          <option value="APPROVED">Status: Approved</option>
          <option value="REJECTED">Status: Rejected</option>
        </SelectField>
        <InputField
          required
          placeholder="Support need"
          value={draft.need}
          onChange={(e) => setDraft({ ...draft, need: e.target.value })}
          style={inputStyle}
        />
        <TextareaField
          required
          rows={3}
          placeholder="Problem"
          value={draft.problem}
          onChange={(e) => setDraft({ ...draft, problem: e.target.value })}
          style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }}
        />
        <TextareaField
          required
          rows={3}
          placeholder="Solution"
          value={draft.solution}
          onChange={(e) => setDraft({ ...draft, solution: e.target.value })}
          style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }}
        />
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

      <ul style={listStyle}>
        {items.map((item) => (
          <li key={item.id} style={rowStyle}>
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
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-outline" onClick={() => edit(item)}>
                Edit
              </button>
              <button
                className="btn-outline"
                onClick={() => remove(item.id)}
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

/* ---------- styles ---------- */

const inputStyle: React.CSSProperties = {
  padding: "0.7rem 0.9rem",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  fontSize: "0.95rem",
  fontFamily: "inherit",
  background: "#fff",
  color: "var(--text-main)",
  outline: "none",
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  padding: "1.25rem",
  border: "1px solid var(--border-color)",
  borderRadius: 12,
  background: "#fafafa",
  marginBottom: "1.5rem",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "0.6rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  padding: "0.85rem 1rem",
  border: "1px solid var(--border-color)",
  borderRadius: 10,
  background: "#fff",
};
