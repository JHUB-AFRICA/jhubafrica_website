export interface PostImageItem {
  id?: string;
  url: string;
  order?: number;
}

export interface NewsPost {
  id: string;
  slug: string;
  tag: string;
  title: string;
  author?: string;
  date: string;
  publishedAt?: string;
  body: string;
  contentJson?: any;
  excerpt: string;
  color: "g" | "b" | "p";
  titleColor: "" | "green" | "red";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  image?: string;
  images?: PostImageItem[];
}
