import { api } from "../axios";
import { NewsPost } from "../../src/types/news";

export const getNews = async (): Promise<NewsPost[]> => {
  const response = await api.get<{ data: NewsPost[] }>("/api/v1/news");
  return response.data.data;
};

export const addNews = async (post: Omit<NewsPost, "id">): Promise<NewsPost> => {
  const response = await api.post<{ data: NewsPost }>("/api/v1/admin/posts", post);
  return response.data.data;
};

export const updateNews = async (post: NewsPost): Promise<NewsPost> => {
  const response = await api.patch<{ data: NewsPost }>(`/api/v1/admin/posts/${post.id}`, post);
  return response.data.data;
};

export const deleteNews = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/posts/${id}`);
};
