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

export interface ApplicationRequest {
    fullName: string;
    email: string;
    phone: string;
    role: "Student" | "Innovator" | "Partner" | "Sponsor" | "Volunteer";
    message: string;
    source?: string;
    // optional innovation details
    innovationTitle?: string;
    sector?: string;
    stage?: "Concept" | "Prototype" | "Pilot" | "Market entry" | "Scale";
    problem?: string;
    solution?: string;
    need?: string;
}

export interface ApplicationItem extends ApplicationRequest {
    id: string;
    date: string;
}

export async function getNews(): Promise<NewsPost[]> {
    const res = await fetch("/api/news");
    if (!res.ok) throw new Error("Failed to fetch news");
    return res.json();
}

export async function addNews(post: Omit<NewsPost, "id">): Promise<NewsPost> {
    const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", post }),
    });
    if (!res.ok) throw new Error("Failed to add news");
    return res.json();
}

export async function updateNews(post: NewsPost): Promise<NewsPost> {
    const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", post }),
    });
    if (!res.ok) throw new Error("Failed to update news");
    return res.json();
}

export async function deleteNews(id: string): Promise<void> {
    const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", post: { id } }),
    });
    if (!res.ok) throw new Error("Failed to delete news");
}

export async function getEvents(): Promise<EventItem[]> {
    const res = await fetch("/api/events");
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
}

export async function addEvent(event: Omit<EventItem, "id">): Promise<EventItem> {
    const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", event }),
    });
    if (!res.ok) throw new Error("Failed to add event");
    return res.json();
}

export async function updateEvent(event: EventItem): Promise<EventItem> {
    const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", event }),
    });
    if (!res.ok) throw new Error("Failed to update event");
    return res.json();
}

export async function deleteEvent(id: string): Promise<void> {
    const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", event: { id } }),
    });
    if (!res.ok) throw new Error("Failed to delete event");
}

export async function getInnovations(): Promise<InnovationItem[]> {
    const res = await fetch("/api/innovations");
    if (!res.ok) throw new Error("Failed to fetch innovations");
    return res.json();
}

export async function addInnovation(innovation: Omit<InnovationItem, "id">): Promise<InnovationItem> {
    const res = await fetch("/api/innovations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", innovation }),
    });
    if (!res.ok) throw new Error("Failed to add innovation");
    return res.json();
}

export async function updateInnovation(innovation: InnovationItem): Promise<InnovationItem> {
    const res = await fetch("/api/innovations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", innovation }),
    });
    if (!res.ok) throw new Error("Failed to update innovation");
    return res.json();
}

export async function deleteInnovation(id: string): Promise<void> {
    const res = await fetch("/api/innovations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", innovation: { id } }),
    });
    if (!res.ok) throw new Error("Failed to delete innovation");
}

export async function submitApplication(application: ApplicationRequest): Promise<ApplicationItem> {
    const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", application }),
    });
    if (!res.ok) throw new Error("Failed to submit application");
    return res.json();
}
