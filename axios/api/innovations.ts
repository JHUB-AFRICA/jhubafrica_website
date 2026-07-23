import { api } from "../axios";
import { InnovationItem } from "../../src/types/innovations";

export const getInnovations = async (): Promise<InnovationItem[]> => {
  const response = await api.get<{ data: InnovationItem[] }>("/api/v1/innovations");
  return response.data.data;
};

export const addInnovation = async (innovation: Omit<InnovationItem, "id">): Promise<InnovationItem> => {
  const response = await api.post<{ data: InnovationItem }>("/api/v1/innovations", innovation);
  return response.data.data;
};

export const updateInnovation = async (innovation: InnovationItem): Promise<InnovationItem> => {
  const response = await api.patch<{ data: InnovationItem }>(`/api/v1/innovations/${innovation.id}`, innovation);
  return response.data.data;
};

export const deleteInnovation = async (id: string): Promise<void> => {
  console.warn("Delete innovation is not supported directly in backend API endpoints.");
};
