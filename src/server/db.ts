import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

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

export interface EventItem {
    id: string;
    day: string;
    month: string;
    title: string;
    desc: string;
    titleColor: "" | "green" | "red";
    image?: string;
}

export interface Database {
    news: NewsPost[];
    events: EventItem[];
}

const DB_PATH = join(process.cwd(), "data", "db.json");

export function readDatabase(): Database {
    try {
        const data = readFileSync(DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return { news: [], events: [] };
    }
}

export function writeDatabase(data: Database): void {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function getNews(): NewsPost[] {
    const db = readDatabase();
    return db.news;
}

export function addNews(post: Omit<NewsPost, "id">): NewsPost {
    const db = readDatabase();
    const newPost: NewsPost = {
        ...post,
        id: `n_${Date.now()}`,
    };
    db.news.unshift(newPost);
    writeDatabase(db);
    return newPost;
}

export function updateNews(post: NewsPost): NewsPost {
    const db = readDatabase();
    db.news = db.news.map((n) => (n.id === post.id ? post : n));
    writeDatabase(db);
    return post;
}

export function deleteNews(id: string): void {
    const db = readDatabase();
    db.news = db.news.filter((n) => n.id !== id);
    writeDatabase(db);
}

export function getEvents(): EventItem[] {
    const db = readDatabase();
    return db.events;
}

export function addEvent(event: Omit<EventItem, "id">): EventItem {
    const db = readDatabase();
    const newEvent: EventItem = {
        ...event,
        id: `e_${Date.now()}`,
    };
    db.events.push(newEvent);
    writeDatabase(db);
    return newEvent;
}

export function updateEvent(event: EventItem): EventItem {
    const db = readDatabase();
    db.events = db.events.map((e) => (e.id === event.id ? event : e));
    writeDatabase(db);
    return event;
}

export function deleteEvent(id: string): void {
    const db = readDatabase();
    db.events = db.events.filter((e) => e.id !== id);
    writeDatabase(db);
}
