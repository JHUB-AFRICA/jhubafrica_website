import { api, adminApi } from "../axios";
import { InnovationItem } from "../../src/types/innovations";

const STAGE_MAP_FE_TO_BE: Record<string, "IDEA" | "PROTOTYPE" | "PILOT" | "SCALING" | "MATURE"> = {
  "Concept": "IDEA",
  "Prototype": "PROTOTYPE",
  "Pilot": "PILOT",
  "Market entry": "SCALING",
  "Scale": "MATURE",
  "IDEA": "IDEA",
  "PROTOTYPE": "PROTOTYPE",
  "PILOT": "PILOT",
  "SCALING": "SCALING",
  "MATURE": "MATURE"
};

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

const mapInnovation = (item: any): InnovationItem => ({
  id: item.id,
  title: item.title,
  sector: item.sector,
  stage: STAGE_MAP_BE_TO_FE[item.stage] || "Concept",
  need: item.support_required || item.supportRequired || "",
  problem: item.problem || "",
  solution: item.solution || "",
  slug: item.slug || "",
  tagline: item.tagline || "",
  description: item.description || "",
  status: item.status,
  isFeatured: item.is_featured || item.isFeatured || false,
  coverImageUrl: item.cover_image_url || item.coverImageUrl || "",
  traction: item.traction || "",
  impactEvidence: item.impact_evidence || item.impactEvidence || "",
  beneficiaries: item.beneficiaries || "",
  teamMembers: (item.team_members || item.teamMembers || []).map((m: any) => ({
    name: m.name,
    role: m.role,
  })),
  mediaUrls: item.media_urls || item.mediaUrls || [],
  website: item.website || item.project_links || item.projectLinks || item.demo_url || "",
  projectLinks: item.project_links || item.projectLinks || item.website || item.demo_url || "",
});

export const getInnovations = async (): Promise<InnovationItem[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/innovations");
  return response.data.data.map(mapInnovation);
};

export const getFeaturedInnovations = async (): Promise<InnovationItem[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/innovations/featured");
  return response.data.data.map(mapInnovation);
};

export const getInnovationBySlug = async (slug: string): Promise<InnovationItem> => {
  const response = await api.get<{ data: any }>(`/api/v1/innovations/${slug}`);
  return mapInnovation(response.data.data);
};

const getOwnerIdFromToken = (): string => {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!raw) return '00000000-0000-0000-0000-000000000000';
    const payload = JSON.parse(atob(raw.split('.')[1]));
    return payload.sub || payload.id || '00000000-0000-0000-0000-000000000000';
  } catch {
    return '00000000-0000-0000-0000-000000000000';
  }
};

export const addInnovation = async (innovation: Omit<InnovationItem, "id">): Promise<InnovationItem> => {
  const stage = STAGE_MAP_FE_TO_BE[innovation.stage] || "IDEA";
  const ownerId = getOwnerIdFromToken();
  const payload = {
    title: innovation.title,
    sector: innovation.sector,
    stage,
    description: innovation.description || "",
    problem: innovation.problem.length >= 10 ? innovation.problem : innovation.problem.padEnd(10, " "),
    solution: innovation.solution.length >= 10 ? innovation.solution : innovation.solution.padEnd(10, " "),
    categories: ["General"],
    supportRequired: innovation.need || "None",
    ownerId,
    teamMembers: innovation.teamMembers || [],
    coverImageUrl: innovation.coverImageUrl || "",
  };
  const response = await adminApi.post<{ data: any }>("/api/v1/innovations", payload);
  const created = response.data.data;

  const targetStatus = ("status" in innovation && innovation.status) ? innovation.status : "APPROVED";

  try {
    const approveResponse = await adminApi.patch<{ data: any }>(`/api/v1/admin/innovations/${created.id}/status`, {
      status: targetStatus
    });
    return mapInnovation(approveResponse.data.data);
  } catch (err) {
    console.warn("Failed to auto-approve new innovation status, returning draft:", err);
    return mapInnovation(created);
  }
};

export const updateInnovation = async (innovation: InnovationItem): Promise<InnovationItem> => {
  const stage = STAGE_MAP_FE_TO_BE[innovation.stage] || "IDEA";
  const ownerId = getOwnerIdFromToken();
  const payload = {
    title: innovation.title,
    sector: innovation.sector,
    stage,
    description: innovation.description || "",
    problem: innovation.problem.length >= 10 ? innovation.problem : innovation.problem.padEnd(10, " "),
    solution: innovation.solution.length >= 10 ? innovation.solution : innovation.solution.padEnd(10, " "),
    categories: ["General"],
    supportRequired: innovation.need || "None",
    ownerId,
    teamMembers: innovation.teamMembers || [],
    coverImageUrl: innovation.coverImageUrl || "",
  };
  const response = await adminApi.patch<{ data: any }>(`/api/v1/innovations/${innovation.id}`, payload);
  const updated = response.data.data;

  if ("status" in innovation && innovation.status) {
    try {
      const statusResponse = await adminApi.patch<{ data: any }>(`/api/v1/admin/innovations/${innovation.id}/status`, {
        status: innovation.status
      });
      return mapInnovation(statusResponse.data.data);
    } catch (err) {
      console.warn("Failed to update status on edit, returning updated details:", err);
    }
  }

  return mapInnovation(updated);
};

export const deleteInnovation = async (id: string): Promise<void> => {
  try {
    await adminApi.delete(`/api/v1/admin/innovations/${id}`);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      await adminApi.delete(`/api/v1/innovations/${id}`);
    } else {
      throw err;
    }
  }
};
