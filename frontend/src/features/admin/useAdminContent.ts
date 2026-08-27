import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "@tanstack/react-router";
import { addNews, updateNews, deleteNews } from "../../../axios/api/news";
import { addEvent, updateEvent, deleteEvent } from "../../../axios/api/events";
import { addInnovation, updateInnovation, deleteInnovation } from "../../../axios/api/innovations";
import { createCourse, updateCourse, deleteCourse } from "../../../axios/api/admin/courses";
import { NewsPost } from "../../types/news";
import { EventItem } from "../../types/events";
import { InnovationItem } from "../../types/innovations";
import { CourseItem } from "../../types/courses";
import { JHubTeamMember } from "../../types/team";

export type NewsDraft = NewsPost | (Omit<NewsPost, "id"> & { id?: string });
export type EventDraft = EventItem | (Omit<EventItem, "id"> & { id?: string });
export type InnovationDraft = InnovationItem | (Omit<InnovationItem, "id"> & { id?: string });
export type CourseDraft = CourseItem | (Omit<CourseItem, "id"> & { id?: string });

export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

export function dateToLocalYmd(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function localYmdToDate(ymd: string): Date {
    const [year, month, day] = ymd.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function getEmptyNews(): Omit<NewsPost, "id"> {
    const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return {
        tag: "Announcement",
        title: "",
        author: "JHUB Editorial Team",
        date: today,
        publishedAt: new Date().toISOString().split("T")[0],
        body: "",
        contentJson: null,
        excerpt: "",
        slug: "",
        color: "g",
        titleColor: "green",
        status: "PUBLISHED",
        image: "",
        images: [],
    };
}

export function getEmptyEvent(): Omit<EventItem, "id"> {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.toLocaleDateString("en-US", { month: "short" });

    return {
        day,
        month,
        startDateISO: today.toISOString(),
        title: "",
        desc: "",
        titleColor: "",
        image: "",
        location: "",
    };
}

export function getEmptyInnovation(): Omit<InnovationItem, "id"> {
    return {
        title: "",
        sector: "Big AI Ideas",
        stage: "Concept",
        need: "",
        problem: "",
        solution: "",
        description: "",
        status: "APPROVED",
        coverImageUrl: "",
        teamMembers: [],
    };
}

export function getEmptyCourse(): Omit<CourseItem, "id"> {
    return {
        tag: "Software",
        title: "",
        desc: "",
        level: "Beginner → Intermediate",
        duration: "12 weeks",
        mode: "Hybrid",
        cohort: "Open",
        cert: "Certificate of completion",
        color: "g",
        titleColor: "green",
        prerequisites: "",
        durationWeeks: 12,
        deliveryMode: "HYBRID",
        isFeatured: false,
        isPublished: true,
        category: "Software",
    };
}

export function useNewsAdmin() {
    const router = useRouter();
    const [draft, setDraft] = useState<NewsDraft>(getEmptyNews());
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const submit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (!draft.title.trim() || !draft.body.trim()) return;

            // Auto-generate clean excerpt if left empty
            let effectiveExcerpt = draft.excerpt.trim();
            if (!effectiveExcerpt) {
                const plain = draft.body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
                effectiveExcerpt = plain.length > 140 ? plain.substring(0, 140).trim() + "..." : plain;
            }

            setSubmitting(true);
            setMsg("Saving...");

            try {
                const payload = {
                    ...draft,
                    author: draft.author && draft.author.trim() ? draft.author.trim() : "JHUB Editorial Team",
                    excerpt: effectiveExcerpt,
                };

                if ("id" in draft && draft.id) {
                    await updateNews(payload as NewsPost);
                } else {
                    await addNews(payload as Omit<NewsPost, "id">);
                }

                await router.invalidate();
                setDraft(getEmptyNews());
                setMsg("Saved.");
                setTimeout(() => setMsg(""), 1500);
            } catch (err) {
                console.error(err);
                setMsg("Error saving changes.");
            } finally {
                setSubmitting(false);
            }
        },
        [draft, router],
    );

    const edit = useCallback((post: NewsPost) => {
        const rawImages: any[] = post.images && post.images.length > 0
            ? post.images
            : (post.image ? [{ id: "img-0", url: post.image, order: 0 }] : []);

        let formattedYmd = "";
        if (post.publishedAt) {
            formattedYmd = post.publishedAt.split("T")[0];
        } else if (post.date) {
            const d = new Date(post.date);
            if (!isNaN(d.getTime())) formattedYmd = d.toISOString().split("T")[0];
        }

        setDraft({
            ...post,
            author: post.author || "JHUB Editorial Team",
            publishedAt: formattedYmd || new Date().toISOString().split("T")[0],
            images: rawImages,
            image: rawImages[0]?.url || post.image || "",
        });
        window.scrollTo({ top: 300, behavior: "smooth" });
    }, []);

    const remove = useCallback(async (id: string, bypassConfirm = false) => {
        if (!bypassConfirm && !confirm("Delete this news post?")) return;

        setDeletingId(id);
        setMsg("Deleting...");

        try {
            await deleteNews(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting post.");
        } finally {
            setDeletingId(null);
        }
    }, [router]);

    const handleImageUpload = useCallback(async (file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        setDraft((prev) => ({ ...prev, image: base64 }));
    }, []);

    const resetDraft = useCallback(() => setDraft(getEmptyNews()), []);

    return {
        draft,
        setDraft,
        msg,
        submitting,
        deletingId,
        submit,
        edit,
        remove,
        handleImageUpload,
        resetDraft,
    };
}

export function useEventAdmin() {
    const router = useRouter();
    const [draft, setDraft] = useState<EventDraft>(getEmptyEvent());
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const submit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (!draft.title.trim() || !draft.day.trim() || !draft.month.trim()) return;

            setSubmitting(true);
            setMsg("Saving...");

            try {
                if ("id" in draft && draft.id) {
                    await updateEvent(draft as EventItem);
                } else {
                    await addEvent(draft as Omit<EventItem, "id">);
                }

                await router.invalidate();
                setDraft(getEmptyEvent());
                setMsg("Saved.");
                setTimeout(() => setMsg(""), 1500);
            } catch (err) {
                console.error(err);
                setMsg("Error saving changes.");
            } finally {
                setSubmitting(false);
            }
        },
        [draft, router],
    );

    const edit = useCallback((event: EventItem) => {
        setDraft(event);
        window.scrollTo({ top: 300, behavior: "smooth" });
    }, []);

    const remove = useCallback(async (id: string, bypassConfirm = false) => {
        if (!bypassConfirm && !confirm("Delete this event?")) return;

        setDeletingId(id);
        setMsg("Deleting...");

        try {
            await deleteEvent(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting event.");
        } finally {
            setDeletingId(null);
        }
    }, [router]);

    const handleImageUpload = useCallback(async (file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        setDraft((prev) => ({ ...prev, image: base64 }));
    }, []);

    const resetDraft = useCallback(() => setDraft(getEmptyEvent()), []);

    return {
        draft,
        setDraft,
        msg,
        submitting,
        deletingId,
        submit,
        edit,
        remove,
        handleImageUpload,
        resetDraft,
    };
}

export function useInnovationAdmin() {
    const router = useRouter();
    const [draft, setDraft] = useState<InnovationDraft>(getEmptyInnovation());
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const submit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (!draft.title.trim() || !draft.sector.trim() || !draft.problem.trim() || !draft.solution.trim()) return;

            setSubmitting(true);
            setMsg("Saving...");

            try {
                if ("id" in draft && draft.id) {
                    await updateInnovation(draft as InnovationItem);
                } else {
                    await addInnovation(draft as Omit<InnovationItem, "id">);
                }

                await router.invalidate();
                setDraft(getEmptyInnovation());
                setMsg("Saved.");
                setTimeout(() => setMsg(""), 1500);
            } catch (err) {
                console.error(err);
                setMsg("Error saving changes.");
            } finally {
                setSubmitting(false);
            }
        },
        [draft, router],
    );

    const edit = useCallback((item: InnovationItem) => {
        setDraft(item);
        window.scrollTo({ top: 300, behavior: "smooth" });
    }, []);

    const remove = useCallback(async (id: string, bypassConfirm = false) => {
        if (!bypassConfirm && !confirm("Delete this innovation?")) return;

        setDeletingId(id);
        setMsg("Deleting...");

        try {
            await deleteInnovation(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting innovation.");
        } finally {
            setDeletingId(null);
        }
    }, [router]);

    const handleImageUpload = useCallback(async (file: File | null) => {
        if (!file) return;
        const base64 = await fileToBase64(file);
        setDraft((prev) => ({ ...prev, coverImageUrl: base64 }));
    }, []);

    const resetDraft = useCallback(() => setDraft(getEmptyInnovation()), []);

    return {
        draft,
        setDraft,
        msg,
        submitting,
        deletingId,
        submit,
        edit,
        remove,
        handleImageUpload,
        resetDraft,
    };
}

export function useCourseAdmin() {
    const router = useRouter();
    const [draft, setDraft] = useState<CourseDraft>(getEmptyCourse());
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const submit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (!draft.title.trim() || !draft.desc.trim()) return;

            setSubmitting(true);
            setMsg("Saving...");

            try {
                if ("id" in draft && draft.id) {
                    await updateCourse(draft.id, draft as CourseItem);
                } else {
                    await createCourse(draft as Omit<CourseItem, "id">);
                }

                await router.invalidate();
                setDraft(getEmptyCourse());
                setMsg("Saved.");
                setTimeout(() => setMsg(""), 1500);
            } catch (err) {
                console.error(err);
                setMsg("Error saving changes.");
            } finally {
                setSubmitting(false);
            }
        },
        [draft, router],
    );

    const edit = useCallback((course: CourseItem) => {
        setDraft(course);
        window.scrollTo({ top: 300, behavior: "smooth" });
    }, []);

    const remove = useCallback(async (id: string, bypassConfirm = false) => {
        if (!bypassConfirm && !confirm("Delete this course?")) return;

        setDeletingId(id);
        setMsg("Deleting...");

        try {
            await deleteCourse(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting course.");
        } finally {
            setDeletingId(null);
        }
    }, [router]);

    const resetDraft = useCallback(() => setDraft(getEmptyCourse()), []);

    return {
        draft,
        setDraft,
        msg,
        submitting,
        deletingId,
        submit,
        edit,
        remove,
        resetDraft,
    };
}

/* ---------- Team admin hook ---------- */

export type TeamMemberDraft = JHubTeamMember | (Omit<JHubTeamMember, "id"> & { id?: string });

export function getEmptyTeamMember(): Omit<JHubTeamMember, "id"> {
    return {
        name: "",
        title: "",
        bio: "",
        avatarUrl: "",
        avatarThumb: "",
        category: "EXECUTIVE",
        order: 0,
    };
}

export function useTeamAdmin() {
    const router = useRouter();
    const [draft, setDraft] = useState<TeamMemberDraft>(getEmptyTeamMember());
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const resetDraft = useCallback(() => {
        setDraft(getEmptyTeamMember());
        setMsg("");
    }, []);

    const edit = useCallback((item: JHubTeamMember) => {
        setDraft(item);
        setMsg("");
        window.scrollTo({ top: 400, behavior: "smooth" });
    }, []);

    const submit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            setSubmitting(true);
            setMsg("Saving team member...");

            try {
                if (draft.id) {
                    await (await import("../../../axios/api/team")).adminUpdateTeamMember(draft.id, draft);
                    setMsg("Team member updated successfully.");
                } else {
                    await (await import("../../../axios/api/team")).adminCreateTeamMember(draft);
                    setMsg("Team member created successfully.");
                }
                resetDraft();
                await router.invalidate();
                setTimeout(() => setMsg(""), 2000);
            } catch (err: any) {
                console.error(err);
                setMsg(err?.response?.data?.error || "Error saving team member.");
            } finally {
                setSubmitting(false);
            }
        },
        [draft, resetDraft, router],
    );

    const remove = useCallback(
        async (id: string, bypassConfirm = false) => {
            if (!bypassConfirm && !confirm("Delete this team member?")) return;

            setDeletingId(id);
            setMsg("Deleting...");

            try {
                await (await import("../../../axios/api/team")).adminDeleteTeamMember(id);
                if (draft.id === id) resetDraft();
                await router.invalidate();
                setMsg("Deleted.");
                setTimeout(() => setMsg(""), 1500);
            } catch (err: any) {
                console.error(err);
                setMsg(err?.response?.data?.error || "Error deleting team member.");
            } finally {
                setDeletingId(null);
            }
        },
        [draft.id, resetDraft, router],
    );

    return {
        draft,
        setDraft,
        msg,
        submitting,
        deletingId,
        submit,
        edit,
        remove,
        resetDraft,
    };
}

