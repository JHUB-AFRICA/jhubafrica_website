// CHANGED: import adminApi instead of api — all endpoints here are under
// /api/v1/admin/*, which require auth.
import { adminApi } from "../../axios.ts";
import { InnovationItem } from "../../../src/types/innovations.ts";

export interface InnovationSubmission extends InnovationItem {
  status: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT" | "SUBMITTED" | "UNDER_REVIEW";
  reviewNotes?: string;
  isFeatured: boolean;
  createdAt: string;
}

const STAGE_MAP_BE_TO_FE: Record<string, "Concept" | "Prototype" | "Pilot" | "Market entry" | "Scale"> = {
  "IDEA": "Concept",
  "PROTOTYPE": "Prototype",
  "PILOT": "Pilot",
  "SCALING": "Market entry",
  "MATURE": "Scale",
  "Concept": "Concept",
  "Prototype": "Prototype",
  "Pilot": "Pilot",
  "Market entry": "Market entry",
  "Scale": "Scale"
};

const mapInnovation = (item: any): InnovationSubmission => ({
  id: item.id,
  title: item.title,
  sector: item.sector,
  stage: STAGE_MAP_BE_TO_FE[item.stage] || "Concept",
  need: item.support_required || item.supportRequired || "",
  problem: item.problem || "",
  solution: item.solution || "",
  status: item.status,
  isFeatured: item.is_featured || item.isFeatured || false,
  createdAt: item.created_at || item.createdAt || "",
  slug: item.slug || "",
  coverImageUrl: item.cover_image_url || item.coverImageUrl || "",
  teamMembers: item.team_members || [],
});

export const getAdminInnovations = async (): Promise<InnovationSubmission[]> => {
  // CHANGED: api -> adminApi
  const response = await adminApi.get<{ data: any[] }>("/api/v1/admin/innovations");
  return response.data.data.map(mapInnovation);
};

export const updateInnovationStatus = async (
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT" | "SUBMITTED" | "UNDER_REVIEW",
  reviewNotes?: string
): Promise<InnovationSubmission> => {
  // CHANGED: api -> adminApi
  const response = await adminApi.patch<{ data: InnovationSubmission }>(`/api/v1/admin/innovations/${id}/status`, {
    status,
    reviewNotes,
  });
  return response.data.data;
};

export const toggleInnovationFeatured = async (id: string): Promise<{ success: boolean; isFeatured: boolean }> => {
  // CHANGED: api -> adminApi
  const response = await adminApi.patch<{ data: { success: boolean; isFeatured: boolean } }>(`/api/v1/admin/innovations/${id}/feature`);
  return response.data.data;
};

export const deleteAdminInnovation = async (id: string): Promise<void> => {
  await adminApi.delete(`/api/v1/admin/innovations/${id}`);
};