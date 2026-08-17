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
        date: today,
        body: "",
        excerpt: "",
        color: "g",
        titleColor: "green",
        image: "",
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

    const submit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (!draft.title.trim() || !draft.body.trim() || !draft.excerpt.trim()) return;

            setSubmitting(true);
            setMsg("Saving...");

            try {
                if ("id" in draft && draft.id) {
                    await updateNews(draft as NewsPost);
                } else {
                    await addNews(draft as Omit<NewsPost, "id">);
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
        setDraft(post);
        window.scrollTo({ top: 300, behavior: "smooth" });
    }, []);

    const remove = useCallback(async (id: string, bypassConfirm = false) => {
        if (!bypassConfirm && !confirm("Delete this news post?")) return;

        setMsg("Deleting...");

        try {
            await deleteNews(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting post.");
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

        setMsg("Deleting...");

        try {
            await deleteEvent(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting event.");
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

        setMsg("Deleting...");

        try {
            await deleteInnovation(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting innovation.");
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

        setMsg("Deleting...");

        try {
            await deleteCourse(id);
            await router.invalidate();
            setMsg("Deleted.");
            setTimeout(() => setMsg(""), 1500);
        } catch (err) {
            console.error(err);
            setMsg("Error deleting course.");
        }
    }, [router]);

    const resetDraft = useCallback(() => setDraft(getEmptyCourse()), []);

    return {
        draft,
        setDraft,
        msg,
        submitting,
        submit,
        edit,
        remove,
        resetDraft,
    };
}
