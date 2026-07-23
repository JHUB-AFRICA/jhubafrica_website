import { api } from "../axios";
import { EventItem } from "../../src/types/events";

export const getEvents = async (): Promise<EventItem[]> => {
  const response = await api.get<EventItem[]>("/api/v1/events");
  return response.data;
};

export const addEvent = async (event: Omit<EventItem, "id">): Promise<EventItem> => {
  const response = await api.post<EventItem>("/api/v1/admin/events", event);
  return response.data;
};

export const updateEvent = async (event: EventItem): Promise<EventItem> => {
  const response = await api.patch<EventItem>(`/api/v1/admin/events/${event.id}`, event);
  return response.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/events/${id}`);
};
