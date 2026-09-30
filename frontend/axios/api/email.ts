import { adminApi } from "../axios";

export interface TestEmailResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface EmailConfigResponse {
  status: string;
  environment: string;
  provider: string;
  isKeyConfigured: boolean;
  senderAddress: string;
  replyToAddress: string;
  isSandboxMode: boolean;
  sandboxNotice: string;
  departmentRouting: {
    innovations: string;
    courses: string;
    partnerships: string;
    events: string;
    secretariat: string;
  };
}

export interface EmailTemplateInfo {
  id: string;
  name: string;
  category: 'User Receipt' | 'Internal Lead' | 'Authentication' | 'Diagnostic';
  description: string;
}

export interface EmailTemplatesResponse {
  templates: EmailTemplateInfo[];
}

export const adminSendTestEmail = async (to: string): Promise<TestEmailResponse> => {
  const res = await adminApi.post<TestEmailResponse>("/api/v1/admin/email/test", { to });
  return res.data;
};

export const adminGetEmailConfig = async (): Promise<EmailConfigResponse> => {
  const res = await adminApi.get<EmailConfigResponse>("/api/v1/admin/email/config");
  return res.data;
};

export const adminGetEmailTemplates = async (): Promise<EmailTemplatesResponse> => {
  const res = await adminApi.get<EmailTemplatesResponse>("/api/v1/admin/email/templates");
  return res.data;
};

export const adminGetTemplatePreviewHtml = async (templateId: string): Promise<string> => {
  const res = await adminApi.get<string>(`/api/v1/admin/email/preview/${templateId}`, {
    responseType: "text",
  });
  return res.data;
};
