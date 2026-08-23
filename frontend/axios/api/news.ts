// CHANGED: import both — getNews/getNewsBySlug are public, the rest are
// admin-only writes.
import { api, adminApi } from "../axios";
import { NewsPost } from "../../src/types/news";

const mapNews = (item: any): NewsPost => {
  const publishedAt = item.published_at || item.publishedAt;
  const dateObj = new Date(publishedAt);
  const formattedDate = isNaN(dateObj.getTime())
    ? "Recent"
    : dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const categoryToTag: Record<string, string> = {
    news: "News",
    "impact-story": "Story",
    "partner-story": "Partnership",
    "project-update": "Update",
    announcement: "Announcement",
  };

  const tagToColor: Record<string, "g" | "b" | "p"> = {
    News: "b",
    Story: "p",
    Partnership: "g",
    Update: "b",
    Announcement: "g",
  };

  const tag = categoryToTag[item.category] || "Announcement";
  const color = tagToColor[tag] || "g";

  return {
    id: item.id,
    slug: item.slug || "",
    tag,
    title: item.title,
    date: formattedDate,
    body: item.content || "",
    excerpt: item.excerpt || "",
    color,
    titleColor: item.is_featured ? "red" : "",
    image: item.cover_image_url || item.coverImageUrl || "",
  };
};

const mapToBackendNews = (post: Omit<NewsPost, "id">) => {
  const tagToCategory: Record<string, string> = {
    News: "news",
    Story: "impact-story",
    Partnership: "partner-story",
    Update: "project-update",
    Announcement: "announcement",
  };

  const category = tagToCategory[post.tag] || "announcement";

  const coverImageUrl = post.image || "";

  return {
    title: post.title,
    content: post.body.length >= 10 ? post.body : post.body.padEnd(10, " "),
    excerpt: post.excerpt || "",
    category,
    isPublished: true,
    isFeatured: post.titleColor === "red",
    coverImageUrl,
  };
};

export const getNews = async (): Promise<NewsPost[]> => {
  // UNCHANGED: public read, stays on api
  const response = await api.get<{ data: any[] }>("/api/v1/news");
  return response.data.data.map(mapNews);
};

export const addNews = async (post: Omit<NewsPost, "id">): Promise<NewsPost> => {
  const payload = mapToBackendNews(post);
  // CHANGED: api -> adminApi (writes to /api/v1/admin/news)
  const response = await adminApi.post<{ data: any }>("/api/v1/admin/news", payload);
  return mapNews(response.data.data);
};

export const updateNews = async (post: NewsPost): Promise<NewsPost> => {
  const payload = mapToBackendNews(post);
  // CHANGED: api -> adminApi
  const response = await adminApi.patch<{ data: any }>(`/api/v1/admin/news/${post.id}`, payload);
  return mapNews(response.data.data);
};

export const deleteNews = async (id: string): Promise<void> => {
  // CHANGED: api -> adminApi
  await adminApi.delete(`/api/v1/admin/news/${id}`);
};

export const getNewsBySlug = async (slug: string): Promise<NewsPost> => {
  // UNCHANGED: public read, stays on api
  const response = await api.get<{ data: any }>(`/api/v1/news/${slug}`);
  return mapNews(response.data.data);
};