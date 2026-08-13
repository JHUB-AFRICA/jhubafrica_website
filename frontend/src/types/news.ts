export interface NewsPost {
    id: string;
    tag: string;
    title: string;
    date: string;
    body: string;
    color: "g" | "b" | "p";
    titleColor: "" | "green" | "red";
    image?: string;
}
