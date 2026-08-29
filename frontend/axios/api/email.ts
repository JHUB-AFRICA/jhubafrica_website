import { adminApi } from "../axios";

export interface TestEmailResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const adminSendTestEmail = async (to: string): Promise<TestEmailResponse> => {
  const res = await adminApi.post<TestEmailResponse>("/api/v1/admin/email/test", { to });
  return res.data;
};
