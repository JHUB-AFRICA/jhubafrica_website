// CHANGED: import adminApi instead of api — every call here requires
// auth + cookies + CSRF header.
import { adminApi } from "../../axios.ts";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string;
  email_verified: boolean;
}

export interface AdminAuthResponse {
  token: string;
  refreshToken: string;
  user: AdminUser;
}

export const adminLogin = async (email: string, password: string): Promise<AdminAuthResponse> => {
  // CHANGED: api -> adminApi
  const response = await adminApi.post<AdminAuthResponse>("/api/v1/auth/admin/login", {
    email,
    password,
  });
  return response.data;
};

export const adminLogout = async (): Promise<void> => {
  // CHANGED: api -> adminApi
  await adminApi.post("/api/v1/auth/admin/logout");
};

export const adminGetMe = async (): Promise<AdminUser> => {
  // CHANGED: api -> adminApi
  const response = await adminApi.get<AdminUser>("/api/v1/auth/me");
  return response.data;
};

export const adminRefresh = async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
  // CHANGED: api -> adminApi
  const response = await adminApi.post<{ token: string; refreshToken: string }>("/api/v1/auth/refresh", {
    refreshToken,
  });
  return response.data;
};

export const requestPasswordReset = async (email: string): Promise<{ message: string; devResetUrl?: string }> => {
  const response = await adminApi.post<{ message: string; devResetUrl?: string }>("/api/v1/auth/forgot-password", {
    email,
  });
  return response.data;
};

export const submitPasswordReset = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await adminApi.post<{ message: string }>("/api/v1/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};