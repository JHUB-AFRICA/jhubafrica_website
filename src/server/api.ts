import { Router } from "nitro";
import { createTransport } from "nodemailer";
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
    addApplication,
} from "./db";

const EMAIL_TO = process.env.EMAIL_TO || "info.jhub@jkuat.ac.ke";
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@jhub.africa";

function getEmailTransport() {
    const host = process.env.SMTP_HOST;
    if (!host) return null;

    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    return createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
    });
}

async function sendApplicationEmail(application: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    message: string;
    source?: string;
}) {
    const transport = getEmailTransport();
    if (!transport) {
        console.warn("SMTP not configured; skipping application email send.");
        return;
    }

    const subject = `JHUB application from ${application.fullName}`;
    const bodyLines = [
        `Name: ${application.fullName}`,
        `Email: ${application.email}`,
        `Phone: ${application.phone}`,
        `Role: ${application.role}`,
        `Source: ${application.source ?? "Unknown"}`,
        "",
        "Message:",
        application.message,
    ];

    await transport.sendMail({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject,
        text: bodyLines.join("\n"),
        html: `<p><strong>Name:</strong> ${application.fullName}</p><p><strong>Email:</strong> ${application.email}</p><p><strong>Phone:</strong> ${application.phone}</p><p><strong>Role:</strong> ${application.role}</p><p><strong>Source:</strong> ${application.source ?? "Unknown"}</p><hr /><p>${application.message.replace(/\n/g, "<br />")}</p>`,
    });
}

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

    // POST /api/applications
    if (pathname === "/api/applications" && method === "POST") {
        const body = await readBody(event);
        const { action, application } = body;

        if (action === "add") {
            const saved = addApplication(application);
            await sendApplicationEmail(application);
            return saved;
        }

        throw createError({
            statusCode: 400,
            statusMessage: "Invalid action",
        });
    }

    throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
    });
});
