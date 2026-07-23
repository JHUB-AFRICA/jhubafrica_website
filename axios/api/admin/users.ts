import { api } from "../../axios.ts";
import { AdminUser } from "./auth.ts";

export interface CreateAdminUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "INNOVATOR" | "STUDENT" | "PARTNER" | "FUNDER";
}

export const createAdminUser = async (user: CreateAdminUserRequest): Promise<AdminUser> => {
  const response = await api.post<AdminUser>("/api/v1/admin/users", user);
  return response.data;
};
