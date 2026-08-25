import { api, adminApi } from "../axios";
import { NewsPost, PostImageItem } from "../../src/types/news";

const mapNews = (item: any): NewsPost => {
  const rawPublishedAt = item.published_at || item.publishedAt;
  let formattedDate = "";
  
  if (rawPublishedAt) {
    const dateObj = new Date(rawPublishedAt);
    formattedDate = isNaN(dateObj.getTime())
      ? rawPublishedAt
      : dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } else {
    formattedDate = item.date || "Recent";
  }

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

  const rawImages: any[] = item.images || item.post_images || [];
  const normalizedImages: PostImageItem[] = rawImages
    .map((img: any, idx: number) => {
      if (typeof img === "string") {
        return { id: `img-${idx}`, url: img, order: idx };
      }
      return {
        id: img.id,
        url: img.url,
        order: typeof img.order === "number" ? img.order : idx,
      };
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const coverImageUrl = item.cover_image_url || item.coverImageUrl || normalizedImages[0]?.url || "";

  return {
    id: item.id,
    slug: item.slug || "",
    tag,
    title: item.title,
    author: item.author || item.author_name || "JHUB Editorial Team",
    date: formattedDate,
    publishedAt: rawPublishedAt || undefined,
    body: item.content || "",
    contentJson: item.content_json || item.contentJson || null,
    excerpt: item.excerpt || "",
    color,
    titleColor: item.is_featured ? "red" : "",
    status: item.status || (item.is_published ? "PUBLISHED" : "DRAFT"),
    image: coverImageUrl,
    images: normalizedImages,
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
  const coverImageUrl = post.image || post.images?.[0]?.url || "";
  const status = post.status || "PUBLISHED";

  // Parse ISO date from post.publishedAt or post.date
  let publishedAtISO: string | null = null;
  if (post.publishedAt) {
    const d = new Date(post.publishedAt);
    if (!isNaN(d.getTime())) publishedAtISO = d.toISOString();
  } else if (post.date) {
    const d = new Date(post.date);
    if (!isNaN(d.getTime())) publishedAtISO = d.toISOString();
  }

  return {
    title: post.title,
    author: post.author || "JHUB Editorial Team",
    content: post.body && post.body.length >= 10 ? post.body : (post.body || "").padEnd(10, " "),
    contentJson: post.contentJson || null,
    excerpt: post.excerpt || "",
    category,
    status,
    isPublished: status === "PUBLISHED",
    isFeatured: post.titleColor === "red",
    publishedAt: publishedAtISO,
    coverImageUrl,
    images: (post.images || []).map((img, idx) => ({
      url: typeof img === "string" ? img : img.url,
      order: typeof img === "object" && typeof img.order === "number" ? img.order : idx,
    })),
  };
};

export const getNews = async (): Promise<NewsPost[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/news");
  return response.data.data.map(mapNews);
};

export const getAdminNews = async (): Promise<NewsPost[]> => {
  const response = await adminApi.get<{ data: any[] }>("/api/v1/admin/news");
  return response.data.data.map(mapNews);
};

export const addNews = async (post: Omit<NewsPost, "id">): Promise<NewsPost> => {
  const payload = mapToBackendNews(post);
  const response = await adminApi.post<{ data: any }>("/api/v1/admin/news", payload);
  return mapNews(response.data.data);
};

export const updateNews = async (post: NewsPost): Promise<NewsPost> => {
  const payload = mapToBackendNews(post);
  const response = await adminApi.patch<{ data: any }>(`/api/v1/admin/news/${post.id}`, payload);
  return mapNews(response.data.data);
};

export const deleteNews = async (id: string): Promise<void> => {
  await adminApi.delete(`/api/v1/admin/news/${id}`);
};

export const getNewsBySlug = async (slug: string): Promise<NewsPost> => {
  const response = await api.get<{ data: any }>(`/api/v1/news/${slug}`);
  return mapNews(response.data.data);
};