import { api } from "../axios";
import { InnovationItem } from "../../src/types/innovations";

const mapInnovation = (item: any): InnovationItem => ({
  id: item.id,
  title: item.title,
  sector: item.sector,
  stage: item.stage,
  need: item.support_required || item.supportRequired || "",
  problem: item.problem || "",
  solution: item.solution || "",
});

export const getInnovations = async (): Promise<InnovationItem[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/innovations");
  return response.data.data.map(mapInnovation);
};

export const addInnovation = async (innovation: Omit<InnovationItem, "id">): Promise<InnovationItem> => {
  const payload = {
    title: innovation.title,
    sector: innovation.sector,
    stage: innovation.stage,
    support_required: innovation.need,
    problem: innovation.problem,
    solution: innovation.solution,
  };
  const response = await api.post<{ data: any }>("/api/v1/innovations", payload);
  return mapInnovation(response.data.data);
};

export const updateInnovation = async (innovation: InnovationItem): Promise<InnovationItem> => {
  const payload = {
    title: innovation.title,
    sector: innovation.sector,
    stage: innovation.stage,
    support_required: innovation.need,
    problem: innovation.problem,
    solution: innovation.solution,
  };
  const response = await api.patch<{ data: any }>(`/api/v1/innovations/${innovation.id}`, payload);
  return mapInnovation(response.data.data);
};

export const deleteInnovation = async (id: string): Promise<void> => {
  console.warn("Delete innovation is not supported directly in backend API endpoints.");
};
