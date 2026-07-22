import { api } from "../axios.ts";

interface AdminAuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string;
    email_verified: boolean;
  };
}

export const adminLogin = async (email: string, password: string) => {
  const response = await api.post<AdminAuthResponse>("/admin/login", {
    email,
    password,
  });
  return response.data;
};
