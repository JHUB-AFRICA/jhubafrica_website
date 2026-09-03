import { adminApi } from "../../axios.ts";
import { AdminUser } from "./auth.ts";

export interface CreateAdminUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "INNOVATOR" | "STUDENT" | "PARTNER" | "FUNDER";
}

interface CreateAdminUserResponse {
  message: string;
  user: AdminUser;
}

export interface AdminAccountItem {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export const getAdminUsers = async (): Promise<AdminAccountItem[]> => {
  const response = await adminApi.get<AdminAccountItem[]>("/api/v1/admin/users");
  return response.data;
};

export const createAdminUser = async (user: CreateAdminUserRequest): Promise<AdminUser> => {
  const response = await adminApi.post<CreateAdminUserResponse>("/api/v1/admin/users", user);
  return response.data.user;
};

