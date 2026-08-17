export interface NewsPost {
    id: string;
    slug: string;
    tag: string;
    title: string;
    date: string;
    body: string;
    excerpt: string;
    color: "g" | "b" | "p";
    titleColor: "" | "green" | "red";
    image?: string;
}
