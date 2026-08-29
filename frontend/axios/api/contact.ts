import { api } from "../axios";

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  subject?: string;
  message: string;
  preferredResponseChannel?: "email" | "phone" | "whatsapp";
}

export interface ContactInquiryResponse {
  message: string;
  inquiryId: string;
}

export const submitContactInquiry = async (payload: ContactInquiryPayload): Promise<ContactInquiryResponse> => {
  const res = await api.post<ContactInquiryResponse>("/api/v1/contact", payload);
  return res.data;
};
