import { useEffect, useState } from "react";

export type NewsPost = {
    id: string;
    tag: string;
    title: string;
    date: string;
    body: string;
    color: "g" | "b" | "p";
    titleColor: "" | "green" | "red";
    image?: string;
};

export type EventItem = {
    id: string;
    day: string;
    month: string;
    title: string;
    desc: string;
    titleColor: "" | "green" | "red";
    image?: string;
};

export const DEFAULT_NEWS: NewsPost[] = [
    { id: "n1", tag: "Announcement", title: "New Cohort Applications Open", date: "June 2026", body: "Applications are now open for our incoming startup cohort. Selected teams receive mentorship, workspace and seed support.", color: "g", titleColor: "green" },
    { id: "n2", tag: "Partnership", title: "JHUB Africa Signs MoU with Industry Partner", date: "May 2026", body: "A new partnership to accelerate applied research projects in fintech and agritech.", color: "b", titleColor: "" },
    { id: "n3", tag: "Story", title: "Alumni Startup Closes Pre-Seed Round", date: "April 2026", body: "A JHUB-incubated startup secures pre-seed funding to scale across East Africa.", color: "p", titleColor: "red" },
];

export const DEFAULT_EVENTS: EventItem[] = [
    { id: "e1", day: "12", month: "Jul", title: "Innovation Demo Day", desc: "Cohort showcase of student-led startups pitching to investors and partners.", titleColor: "" },
    { id: "e2", day: "24", month: "Jul", title: "AI for Africa Hackathon", desc: "48-hour hackathon focused on applied AI solutions for local industries.", titleColor: "green" },
    { id: "e3", day: "09", month: "Aug", title: "Founders Fireside", desc: "Conversations with African founders on building and scaling ventures.", titleColor: "red" },
    { id: "e4", day: "21", month: "Aug", title: "Women in Tech Meetup", desc: "Network, mentorship and lightning talks for women in technology.", titleColor: "" },
];

const NEWS_KEY = "jhub_admin_news_v1";
const EVENTS_KEY = "jhub_admin_events_v1";

function read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as T) : fallback;
    } catch {
        return fallback;
    }
}

export function loadNews(): NewsPost[] { return read(NEWS_KEY, DEFAULT_NEWS); }
export function loadEvents(): EventItem[] { return read(EVENTS_KEY, DEFAULT_EVENTS); }

export function saveNews(items: NewsPost[]) {
    window.localStorage.setItem(NEWS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("jhub-content-change"));
}
export function saveEvents(items: EventItem[]) {
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("jhub-content-change"));
}

export function useNews() {
    const [items, setItems] = useState<NewsPost[]>(DEFAULT_NEWS);
    useEffect(() => {
        setItems(loadNews());
        const h = () => setItems(loadNews());
        window.addEventListener("jhub-content-change", h);
        window.addEventListener("storage", h);
        return () => {
            window.removeEventListener("jhub-content-change", h);
            window.removeEventListener("storage", h);
        };
    }, []);
    return items;
}

export function useEvents() {
    const [items, setItems] = useState<EventItem[]>(DEFAULT_EVENTS);
    useEffect(() => {
        setItems(loadEvents());
        const h = () => setItems(loadEvents());
        window.addEventListener("jhub-content-change", h);
        window.addEventListener("storage", h);
        return () => {
            window.removeEventListener("jhub-content-change", h);
            window.removeEventListener("storage", h);
        };
    }, []);
    return items;
}

export const ADMIN_PASSWORD = "google cloud";
export const ADMIN_SESSION_KEY = "jhub_admin_unlocked_v1";