import { api } from "../../axios.ts";
import { InnovationItem } from "../../../src/types/innovations.ts";

export interface InnovationSubmission extends InnovationItem {
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNotes?: string;
  isFeatured: boolean;
  createdAt: string;
}

export const updateInnovationStatus = async (
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  reviewNotes?: string
): Promise<InnovationSubmission> => {
  const response = await api.patch<InnovationSubmission>(`/api/v1/admin/innovations/${id}/status`, {
    status,
    reviewNotes,
  });
  return response.data;
};

export const toggleInnovationFeatured = async (id: string): Promise<{ success: boolean; isFeatured: boolean }> => {
  const response = await api.patch<{ success: boolean; isFeatured: boolean }>(`/api/v1/admin/innovations/${id}/feature`);
  return response.data;
};
