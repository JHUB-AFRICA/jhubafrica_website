import { api } from "../../axios.ts";

export interface PartnerProfile {
  id: string;
  name: string;
  type: "INDUSTRY" | "ACADEMIC" | "GOVERNMENT" | "NGO" | "FUNDER" | "MEDIA";
  logoUrl?: string;
  website?: string;
  description?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface PartnerApplication {
  id: string;
  organizationName: string;
  partnershipType: string;
  sector: string;
  proposedCollaboration: string;
  expectedTimeline: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNotes?: string;
  createdAt: string;
}

export interface Sponsorship {
  id: string;
  partnerId: string;
  innovationId: string;
  amount?: number;
  currency: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export const createPartner = async (partner: Omit<PartnerProfile, "id">): Promise<PartnerProfile> => {
  const response = await api.post<PartnerProfile>("/api/v1/admin/partners", partner);
  return response.data;
};

export const getPartnerApplications = async (): Promise<PartnerApplication[]> => {
  const response = await api.get<PartnerApplication[]>("/api/v1/admin/partners/applications");
  return response.data;
};

export const getPartnerApplicationById = async (id: string): Promise<PartnerApplication> => {
  const response = await api.get<PartnerApplication>(`/api/v1/admin/partners/applications/${id}`);
  return response.data;
};

export const updatePartnerApplicationStatus = async (
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  reviewNotes?: string
): Promise<PartnerApplication> => {
  const response = await api.patch<PartnerApplication>(`/api/v1/admin/partners/applications/${id}`, {
    status,
    reviewNotes,
  });
  return response.data;
};

export const updatePartner = async (id: string, partner: Partial<PartnerProfile>): Promise<PartnerProfile> => {
  const response = await api.patch<PartnerProfile>(`/api/v1/admin/partners/${id}`, partner);
  return response.data;
};

export const deletePartner = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/partners/${id}`);
};

export const createSponsorship = async (
  partnerId: string,
  sponsorship: Omit<Sponsorship, "id" | "partnerId">
): Promise<Sponsorship> => {
  const response = await api.post<Sponsorship>(`/api/v1/admin/partners/${partnerId}/sponsorships`, sponsorship);
  return response.data;
};
