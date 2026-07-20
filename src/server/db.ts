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

export interface InnovationItem {
    id: string;
    title: string;
    sector: string;
    stage: "Concept" | "Prototype" | "Pilot" | "Market entry" | "Scale";
    need: string;
    problem: string;
    solution: string;
}

export interface Database {
    news: NewsPost[];
    events: EventItem[];
    innovations: InnovationItem[];
}

const DB_PATH = join(process.cwd(), "data", "db.json");

const DEFAULT_INNOVATIONS: InnovationItem[] = [
    {
        id: "i_default_1",
        title: "Smart Irrigation for Smallholders",
        sector: "Climate Smart Agriculture",
        stage: "Pilot",
        need: "Pilot funding",
        problem: "Smallholder farms lose yields to inconsistent water supply.",
        solution: "Low-cost IoT controllers cutting water use by up to 35%.",
    },
    {
        id: "i_default_2",
        title: "Swahili Voice Assistant",
        sector: "Big AI Ideas",
        stage: "Prototype",
        need: "Compute & data",
        problem: "Voice tools exclude Swahili and code-switching speakers.",
        solution: "Speech models tuned for Kenyan Swahili and mixed-language input.",
    },
    {
        id: "i_default_3",
        title: "Cross-border SME Marketplace",
        sector: "Digital Trade",
        stage: "Market entry",
        need: "Mentorship",
        problem: "SMEs lack compliant pathways to regional buyers.",
        solution: "B2B marketplace with AfCFTA-aware compliance tooling.",
    },
];

export function readDatabase(): Database {
    try {
        const data = JSON.parse(readFileSync(DB_PATH, "utf-8"));
        return {
            news: Array.isArray(data.news) ? data.news : [],
            events: Array.isArray(data.events) ? data.events : [],
            innovations: Array.isArray(data.innovations) ? data.innovations : [],
        };
    } catch {
        return { news: [], events: [], innovations: [] };
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

export function getInnovations(): InnovationItem[] {
    const db = readDatabase();
    return db.innovations.length > 0 ? db.innovations : DEFAULT_INNOVATIONS;
}

export function addInnovation(innovation: Omit<InnovationItem, "id">): InnovationItem {
    const db = readDatabase();
    const newInnovation: InnovationItem = {
        ...innovation,
        id: `i_${Date.now()}`,
    };
    db.innovations.unshift(newInnovation);
    writeDatabase(db);
    return newInnovation;
}

export function updateInnovation(innovation: InnovationItem): InnovationItem {
    const db = readDatabase();
    db.innovations = db.innovations.map((item) => (item.id === innovation.id ? innovation : item));
    writeDatabase(db);
    return innovation;
}

export function deleteInnovation(id: string): void {
    const db = readDatabase();
    db.innovations = db.innovations.filter((item) => item.id !== id);
    writeDatabase(db);
}
