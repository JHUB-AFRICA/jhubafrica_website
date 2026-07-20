import { Router } from "nitro";
import {
    getNews,
    addNews,
    updateNews,
    deleteNews,
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getInnovations,
    addInnovation,
    updateInnovation,
    deleteInnovation,
} from "./db";

export default defineEventHandler(async (event) => {
    const pathname = new URL(event.node.req.url || "", "http://localhost").pathname;
    const method = event.node.req.method;

    // GET /api/news
    if (pathname === "/api/news" && method === "GET") {
        return getNews();
    }

    // GET /api/events
    if (pathname === "/api/events" && method === "GET") {
        return getEvents();
    }

    // GET /api/innovations
    if (pathname === "/api/innovations" && method === "GET") {
        return getInnovations();
    }

    // POST /api/news
    if (pathname === "/api/news" && method === "POST") {
        const body = await readBody(event);
        const { action, post } = body;

        if (action === "add") {
            return addNews(post);
        } else if (action === "update") {
            return updateNews(post);
        } else if (action === "delete") {
            deleteNews(post.id);
            return { success: true };
        } else {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid action",
            });
        }
    }

    // POST /api/events
    if (pathname === "/api/events" && method === "POST") {
        const body = await readBody(event);
        const { action, event: eventData } = body;

        if (action === "add") {
            return addEvent(eventData);
        } else if (action === "update") {
            return updateEvent(eventData);
        } else if (action === "delete") {
            deleteEvent(eventData.id);
            return { success: true };
        } else {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid action",
            });
        }
    }

    // POST /api/innovations
    if (pathname === "/api/innovations" && method === "POST") {
        const body = await readBody(event);
        const { action, innovation: innovationData } = body;

        if (action === "add") {
            return addInnovation(innovationData);
        } else if (action === "update") {
            return updateInnovation(innovationData);
        } else if (action === "delete") {
            deleteInnovation(innovationData.id);
            return { success: true };
        } else {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid action",
            });
        }
    }

    throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
    });
});
