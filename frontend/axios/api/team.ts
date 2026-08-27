import { api, adminApi } from "../axios";
import { JHubTeamMember, JHubTeamCategory } from "../../src/types/team";

export const getTeamMembers = async (category?: JHubTeamCategory | "ALL"): Promise<JHubTeamMember[]> => {
  const params: Record<string, string> = {};
  if (category && category !== "ALL") {
    params.category = category;
  }
  const res = await api.get<{ data: any[] }>("/api/v1/team-members", { params });
  return (res.data?.data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    bio: item.bio || "",
    avatarUrl: item.avatar_url || item.avatarUrl || "",
    avatarThumb: item.avatar_thumb || item.avatarThumb || item.avatar_url || item.avatarUrl || "",
    category: item.category as JHubTeamCategory,
    order: item.order ?? 0,
  }));
};

export const getTeamMember = async (id: string): Promise<JHubTeamMember> => {
  const res = await api.get<{ data: any }>(`/api/v1/team-members/${id}`);
  const item = res.data?.data;
  return {
    id: item.id,
    name: item.name,
    title: item.title,
    bio: item.bio || "",
    avatarUrl: item.avatar_url || item.avatarUrl || "",
    avatarThumb: item.avatar_thumb || item.avatarThumb || item.avatar_url || item.avatarUrl || "",
    category: item.category as JHubTeamCategory,
    order: item.order ?? 0,
  };
};

export const adminGetTeamMembers = async (category?: string): Promise<JHubTeamMember[]> => {
  const params: Record<string, string> = {};
  if (category && category !== "ALL") {
    params.category = category;
  }
  const res = await adminApi.get<{ data: any[] }>("/api/v1/admin/team-members", { params });
  return (res.data?.data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    bio: item.bio || "",
    avatarUrl: item.avatar_url || item.avatarUrl || "",
    avatarThumb: item.avatar_thumb || item.avatarThumb || item.avatar_url || item.avatarUrl || "",
    category: item.category as JHubTeamCategory,
    order: item.order ?? 0,
  }));
};

export const adminCreateTeamMember = async (payload: Partial<JHubTeamMember>): Promise<JHubTeamMember> => {
  const res = await adminApi.post<{ data: any }>("/api/v1/admin/team-members", payload);
  return res.data?.data;
};

export const adminUpdateTeamMember = async (id: string, payload: Partial<JHubTeamMember>): Promise<JHubTeamMember> => {
  const res = await adminApi.put<{ data: any }>(`/api/v1/admin/team-members/${id}`, payload);
  return res.data?.data;
};

export const adminDeleteTeamMember = async (id: string): Promise<{ success: boolean }> => {
  const res = await adminApi.delete<{ success: boolean }>(`/api/v1/admin/team-members/${id}`);
  return res.data;
};

export const adminUploadTeamImage = async (file: File): Promise<{ url: string; path: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", "post-images");
  formData.append("folder", "team-members");

  const res = await adminApi.post<{ url: string; path: string }>("/api/v1/admin/uploads/direct", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
