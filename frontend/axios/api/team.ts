import { api } from "../axios";
import { JHubTeamMember, JHubTeamCategory } from "../../src/types/team";

export const getTeamMembers = async (category?: JHubTeamCategory): Promise<JHubTeamMember[]> => {
  const params: Record<string, string> = {};
  if (category) {
    params.category = category;
  }
  const res = await api.get("/team-members", { params });
  return (res.data?.data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    title: item.title,
    bio: item.bio || "",
    avatarUrl: item.avatar_url || item.avatarUrl || "",
    category: item.category as JHubTeamCategory,
  }));
};
