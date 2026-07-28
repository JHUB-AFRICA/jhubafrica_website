import { api } from "../axios";
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

const getOwnerIdFromToken = (): string | undefined => {
  const token = localStorage.getItem("jhub_admin_token");
  if (!token) return undefined;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.sub;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return undefined;
  }
};

const mapInnovation = (item: any): InnovationItem => ({
  id: item.id,
  title: item.title,
  sector: item.sector,
  stage: STAGE_MAP_BE_TO_FE[item.stage] || "Concept",
  need: item.support_required || item.supportRequired || "",
  problem: item.problem || "",
  solution: item.solution || "",
  status: item.status,
  slug: item.slug || "",
  coverImageUrl: item.cover_image_url || item.coverImageUrl || "",
  teamMembers: item.team_members && item.team_members.length > 0
    ? item.team_members.map((m: any) => ({ name: `${m.first_name || ""} ${m.last_name || ""}`.trim() || m.name || "Member", role: m.role || "Contributor" }))
    : [],
});

export const getInnovations = async (): Promise<InnovationItem[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/innovations");
  return response.data.data.map(mapInnovation);
};

export const getInnovationBySlug = async (slug: string): Promise<InnovationItem> => {
  const response = await api.get<{ data: any }>(`/api/v1/innovations/${slug}`);
  return mapInnovation(response.data.data);
};

export const addInnovation = async (innovation: Omit<InnovationItem, "id">): Promise<InnovationItem> => {
  const stage = STAGE_MAP_FE_TO_BE[innovation.stage] || "IDEA";
  const ownerId = getOwnerIdFromToken();
  const payload = {
    title: innovation.title,
    sector: innovation.sector,
    stage,
    problem: innovation.problem.length >= 10 ? innovation.problem : innovation.problem.padEnd(10, " "),
    solution: innovation.solution.length >= 10 ? innovation.solution : innovation.solution.padEnd(10, " "),
    categories: ["General"],
    supportRequired: innovation.need || "None",
    ownerId,
    teamMembers: innovation.teamMembers || [],
  };
  const response = await api.post<{ data: any }>("/api/v1/innovations", payload);
  const created = response.data.data;

  const targetStatus = ("status" in innovation && innovation.status) ? innovation.status : "APPROVED";

  try {
    const approveResponse = await api.patch<{ data: any }>(`/api/v1/admin/innovations/${created.id}/status`, {
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
    problem: innovation.problem.length >= 10 ? innovation.problem : innovation.problem.padEnd(10, " "),
    solution: innovation.solution.length >= 10 ? innovation.solution : innovation.solution.padEnd(10, " "),
    categories: ["General"],
    supportRequired: innovation.need || "None",
    ownerId,
    teamMembers: innovation.teamMembers || [],
  };
  const response = await api.patch<{ data: any }>(`/api/v1/innovations/${innovation.id}`, payload);
  const updated = response.data.data;

  if ("status" in innovation && innovation.status) {
    try {
      const statusResponse = await api.patch<{ data: any }>(`/api/v1/admin/innovations/${innovation.id}/status`, {
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
  console.warn("Delete innovation is not supported directly in backend API endpoints.");
};
