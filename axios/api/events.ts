import { api } from "../axios";
import { EventItem } from "../../src/types/events";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

const mapEvent = (item: any): EventItem => {
  const date = new Date(item.start_date || item.startDate);
  const day = isNaN(date.getTime()) ? "01" : date.getDate().toString().padStart(2, "0");
  const month = isNaN(date.getTime()) ? "Jan" : MONTHS[date.getMonth()];
  
  return {
    id: item.id,
    day,
    month,
    startDateISO: item.start_date || item.startDate || new Date().toISOString(),
    title: item.title,
    desc: item.description || item.desc || "",
    titleColor: item.titleColor || "",
    image: item.cover_image_url || item.coverImageUrl || "",
  };
};

const mapToBackendEvent = (event: Omit<EventItem, "id">) => {
  const year = new Date().getFullYear();
  const monthName = (event.month || "Jan").toLowerCase().substring(0, 3);
  const monthIndex = MONTH_MAP[monthName] ?? 0;
  const dayNum = parseInt(event.day || "1", 10) || 1;
  const startDate = new Date(Date.UTC(year, monthIndex, dayNum, 9, 0, 0)).toISOString();

  // Smartly determine event type based on title keywords
  let eventType: "HACKATHON" | "WORKSHOP" | "SEMINAR" | "CONFERENCE" | "WEBINAR" | "NETWORKING" | "OTHER" = "OTHER";
  const titleLower = (event.title || "").toLowerCase();
  if (titleLower.includes("hackathon")) {
    eventType = "HACKATHON";
  } else if (titleLower.includes("workshop")) {
    eventType = "WORKSHOP";
  } else if (titleLower.includes("seminar")) {
    eventType = "SEMINAR";
  } else if (titleLower.includes("conference")) {
    eventType = "CONFERENCE";
  } else if (titleLower.includes("webinar")) {
    eventType = "WEBINAR";
  } else if (titleLower.includes("meetup") || titleLower.includes("networking")) {
    eventType = "NETWORKING";
  }

  // Ensure coverImageUrl is a valid URL or empty string (Zod URL validation)
  let coverImageUrl = event.image || "";
  if (coverImageUrl && !coverImageUrl.startsWith("http://") && !coverImageUrl.startsWith("https://")) {
    // If it's a local/base64 asset, default to empty to satisfy backend Zod URL validation
    coverImageUrl = "";
  }

  return {
    title: event.title,
    description: event.desc.length >= 10 ? event.desc : event.desc.padEnd(10, " "),
    type: eventType,
    status: "PUBLISHED", // Sets it active so it renders on public feed
    startDate,
    coverImageUrl,
  };
};

export const getEvents = async (): Promise<EventItem[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/events");
  return response.data.data.map(mapEvent);
};

export const addEvent = async (event: Omit<EventItem, "id">): Promise<EventItem> => {
  const payload = mapToBackendEvent(event);
  const response = await api.post<{ data: any }>("/api/v1/admin/events", payload);
  return mapEvent(response.data.data);
};

export const updateEvent = async (event: EventItem): Promise<EventItem> => {
  const payload = mapToBackendEvent(event);
  const response = await api.patch<{ data: any }>(`/api/v1/admin/events/${event.id}`, payload);
  return mapEvent(response.data.data);
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/events/${id}`);
};
