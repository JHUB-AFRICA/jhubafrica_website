import { Lightbulb, Loader2 } from "lucide-react";
import type { InnovationItem } from "../../../types/innovations";
import { useInnovationAdmin } from "../useAdminContent";
import { InputField } from "./InputField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { AdminImageUpload } from "./AdminImageUpload";
import { AdminFormActions } from "./AdminFormActions";
import styles from "../../../styles/Admin.module.css";

function getDraftTeamMemberKey(m: any, idx: number): string {
  return m.id || `draft-member-${idx}`;
}

export interface InnovationsAdminProps {
  items: InnovationItem[];
  onDeleteRequest: (title: string, onConfirm: () => Promise<void>) => void;
}

export function InnovationsAdmin({ items, onDeleteRequest }: InnovationsAdminProps) {
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
