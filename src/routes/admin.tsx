import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
    ADMIN_PASSWORD,
    ADMIN_SESSION_KEY,
    type EventItem,
    type NewsPost,
} from "@/lib/adminContent";
import {
    getNews,
    getEvents,
    addNews,
    updateNews,
    deleteNews,
    addEvent,
    updateEvent,
    deleteEvent,
} from "@/lib/api";

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

// Timezone-safe date helper to get YYYY-MM-DD local format
function dateToLocalYmd(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Convert local YYYY-MM-DD input value to a Date object without timezone offset shifting
function localYmdToDate(ymd: string): Date {
    const [year, month, day] = ymd.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export const Route = createFileRoute("/admin")({
    head: () => ({
        meta: [
            { title: "Admin — JHUB Africa" },
            { name: "robots", content: "noindex, nofollow" },
            { name: "description", content: "Internal admin area for JHUB Africa staff." },
        ],
    }),
    loader: async () => {
        const [news, events] = await Promise.all([getNews(), getEvents()]);
        return { news, events };
    },
    component: AdminPage,
});

function AdminPage() {
    const [unlocked, setUnlocked] = useState(false);
    const [pw, setPw] = useState("");
    const [err, setErr] = useState("");
    const { news, events } = Route.useLoaderData();

    useEffect(() => {
        if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "1") setUnlocked(true);
    }, []);

    function tryUnlock(e: React.FormEvent) {
        e.preventDefault();
        if (pw === ADMIN_PASSWORD) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
            setUnlocked(true);
            setErr("");
        } else {
            setErr("Incorrect password.");
        }
    }

    function lock() {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setUnlocked(false);
        setPw("");
    }

    if (!unlocked) {
        return (
            <>
                <header className="page-header">
                    <h1>Admin <span style={{ color: "var(--jhub-green)" }}>Access</span></h1>
                    <p>Enter the admin password to manage news and events.</p>
                </header>
                <section className="content-section" style={{ maxWidth: 460, margin: "0 auto" }}>
                    <form onSubmit={tryUnlock} style={{ display: "grid", gap: "0.85rem" }}>
                        <input
                            autoFocus
                            type="password"
                            placeholder="Admin password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            style={inputStyle}
                            aria-label="Admin password"
                        />
                        {err && <div style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{err}</div>}
                        <button type="submit" className="btn-primary" style={{ justifySelf: "start" }}>
                            Unlock
                        </button>
                    </form>
                </section>
            </>
        );
    }

    return (
        <>
            <header className="page-header">
                <h1>Manage <span style={{ color: "var(--jhub-green)" }}>Content</span></h1>
                <p>Add, edit or remove news posts and events. Changes save to the server database instantly.</p>
                <button onClick={lock} className="btn-outline" style={{ marginTop: "0.75rem" }}>
                    Lock admin
                </button>
            </header>

            <NewsAdmin items={news} />
            <EventsAdmin items={events} />
        </>
    );
}

/* ---------- News admin ---------- */

function getEmptyNews(): Omit<NewsPost, "id"> {
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return {
        tag: "Announcement", title: "", date: today, body: "", color: "g", titleColor: "green", image: "",
    };
}

interface NewsAdminProps {
    items: NewsPost[];
}

function NewsAdmin({ items }: NewsAdminProps) {
    const router = useRouter();
    const [draft, setDraft] = useState<NewsPost | (Omit<NewsPost, "id"> & { id?: string })>(getEmptyNews());
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!draft.title.trim() || !draft.body.trim()) return;
        setSubmitting(true);
        setMsg("Saving...");
        try {
            if ("id" in draft && draft.id) {
                await updateNews(draft as NewsPost);
            } else {
                await addNews(draft as Omit<NewsPost, "id">);
            }
            await router.invalidate();
            setDraft(getEmptyNews());
            setMsg("Saved.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error saving changes.");
        } finally {
            setSubmitting(false);
        }
    }

    function edit(p: NewsPost) { setDraft(p); window.scrollTo({ top: 300, behavior: "smooth" }); }

    async function remove(id: string) {
        if (!confirm("Delete this news post?")) return;
        setMsg("Deleting...");
        try {
            await deleteNews(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting post.");
        }
    }

    return (
        <section className="content-section">
            <h2 style={{ marginBottom: "1rem" }}>News posts</h2>

            <form onSubmit={submit} style={formGrid}>
                <input required placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={inputStyle} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Publish Date</label>
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
                                const formatted = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                                setDraft({ ...draft, date: formatted });
                            }
                        }}
                    />
                </div>
                <input required placeholder="Tag (e.g. Announcement)" value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} style={inputStyle} />
                <select value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value as NewsPost["color"] })} style={inputStyle}>
                    <option value="g">Tag: Green</option>
                    <option value="b">Tag: Blue</option>
                    <option value="p">Tag: Pink/Red</option>
                </select>
                <select value={draft.titleColor} onChange={(e) => setDraft({ ...draft, titleColor: e.target.value as NewsPost["titleColor"] })} style={inputStyle}>
                    <option value="">Title: Default</option>
                    <option value="green">Title: Green</option>
                    <option value="red">Title: Red</option>
                </select>
                <textarea required rows={4} placeholder="Body" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }} />
                <label style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            if (e.target.files?.[0]) {
                                const base64 = await fileToBase64(e.target.files[0]);
                                setDraft({ ...draft, image: base64 });
                            }
                        }}
                        style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.9rem" }}>Upload image (optional)</span>
                </label>
                {draft.image && (
                    <div style={{ gridColumn: "1 / -1" }}>
                        <img src={draft.image} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
                    </div>
                )}
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? "Saving..." : ("id" in draft && draft.id ? "Update post" : "Add post")}
                    </button>
                    {"id" in draft && draft.id && (
                        <button type="button" className="btn-outline" onClick={() => setDraft(getEmptyNews())} disabled={submitting}>Cancel edit</button>
                    )}
                    {msg && <span style={{ color: "var(--jhub-green)", fontSize: "0.9rem" }}>{msg}</span>}
                </div>
            </form>

            <ul style={listStyle}>
                {items.map((p) => (
                    <li key={p.id} style={rowStyle}>
                        <div>
                            <strong>{p.title}</strong> <span style={{ opacity: 0.6 }}>· {p.date} · {p.tag}</span>
                            <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: 4 }}>{p.body}</div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn-outline" onClick={() => edit(p)}>Edit</button>
                            <button className="btn-outline" onClick={() => remove(p.id)} style={{ color: "#b91c1c" }}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

/* ---------- Events admin ---------- */

function getEmptyEvent(): Omit<EventItem, "id"> {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleDateString("en-US", { month: "short" });
    return {
        day, month, title: "", desc: "", titleColor: "", image: "",
    };
}

interface EventsAdminProps {
    items: EventItem[];
}

function EventsAdmin({ items }: EventsAdminProps) {
    const router = useRouter();
    const [draft, setDraft] = useState<EventItem | (Omit<EventItem, "id"> & { id?: string })>(getEmptyEvent());
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!draft.title.trim() || !draft.day.trim() || !draft.month.trim()) return;
        setSubmitting(true);
        setMsg("Saving...");
        try {
            if ("id" in draft && draft.id) {
                await updateEvent(draft as EventItem);
            } else {
                await addEvent(draft as Omit<EventItem, "id">);
            }
            await router.invalidate();
            setDraft(getEmptyEvent());
            setMsg("Saved.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error saving changes.");
        } finally {
            setSubmitting(false);
        }
    }

    function edit(p: EventItem) { setDraft(p); window.scrollTo({ top: 300, behavior: "smooth" }); }

    async function remove(id: string) {
        if (!confirm("Delete this event?")) return;
        setMsg("Deleting...");
        try {
            await deleteEvent(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting event.");
        }
    }

    return (
        <section className="content-section">
            <h2 style={{ marginBottom: "1rem" }}>Events</h2>

            <form onSubmit={submit} style={formGrid}>
                <input required placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={inputStyle} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Event Date</label>
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
                <select value={draft.titleColor} onChange={(e) => setDraft({ ...draft, titleColor: e.target.value as EventItem["titleColor"] })} style={inputStyle}>
                    <option value="">Title: Default</option>
                    <option value="green">Title: Green</option>
                    <option value="red">Title: Red</option>
                </select>
                <textarea required rows={3} placeholder="Description" value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }} />
                <label style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            if (e.target.files?.[0]) {
                                const base64 = await fileToBase64(e.target.files[0]);
                                setDraft({ ...draft, image: base64 });
                            }
                        }}
                        style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.9rem" }}>Upload image (optional)</span>
                </label>
                {draft.image && (
                    <div style={{ gridColumn: "1 / -1" }}>
                        <img src={draft.image} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
                    </div>
                )}
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? "Saving..." : ("id" in draft && draft.id ? "Update event" : "Add event")}
                    </button>
                    {"id" in draft && draft.id && (
                        <button type="button" className="btn-outline" onClick={() => setDraft(getEmptyEvent())} disabled={submitting}>Cancel edit</button>
                    )}
                    {msg && <span style={{ color: "var(--jhub-green)", fontSize: "0.9rem" }}>{msg}</span>}
                </div>
            </form>

            <ul style={listStyle}>
                {items.map((p) => (
                    <li key={p.id} style={rowStyle}>
                        <div>
                            <strong>{p.day} {p.month}</strong> — <strong>{p.title}</strong>
                            <div style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: 4 }}>{p.desc}</div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn-outline" onClick={() => edit(p)}>Edit</button>
                            <button className="btn-outline" onClick={() => remove(p.id)} style={{ color: "#b91c1c" }}>Delete</button>
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
