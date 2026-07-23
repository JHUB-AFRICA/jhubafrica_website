import { api } from "../axios";
import { InnovationItem } from "../../src/types/innovations";

export const getInnovations = async (): Promise<InnovationItem[]> => {
  const response = await api.get<InnovationItem[]>("/api/v1/innovations");
  return response.data;
};

export const addInnovation = async (innovation: Omit<InnovationItem, "id">): Promise<InnovationItem> => {
  const response = await api.post<InnovationItem>("/api/v1/innovations", innovation);
  return response.data;
};

export const updateInnovation = async (innovation: InnovationItem): Promise<InnovationItem> => {
  const response = await api.patch<InnovationItem>(`/api/v1/innovations/${innovation.id}`, innovation);
  return response.data;
};

export const deleteInnovation = async (id: string): Promise<void> => {
  console.warn("Delete innovation is not supported directly in backend API endpoints.");
};
