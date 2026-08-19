import { api } from "../axios";
import { CourseItem } from "../../src/types/courses";

const getCategoryDetails = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("software") || cat.includes("web") || cat.includes("dev")) {
    return { tag: "Software", color: "g" as const, titleColor: "green" as const };
  }
  if (cat.includes("data") || cat.includes("analyt") || cat.includes("science")) {
    return { tag: "Data", color: "b" as const, titleColor: "blue" as const };
  }
  return { tag: "Emerging Tech", color: "p" as const, titleColor: "purple" as const };
};

export const mapCourse = (item: any): CourseItem => {
  const catDetails = getCategoryDetails(item.category || "Emerging Tech");

  let mode = "Online";
  if (item.delivery_mode === "IN_PERSON" || item.deliveryMode === "IN_PERSON") {
    mode = "In-Person";
  } else if (item.delivery_mode === "HYBRID" || item.deliveryMode === "HYBRID") {
    mode = "Hybrid";
  }

  let cohortStatus = "Closed";
  const cohorts = item.cohorts || [];
  if (cohorts.some((c: any) => c.status === "OPEN" || c.status === "OPEN_REGISTRATION")) {
    cohortStatus = "Open";
  } else if (cohorts.some((c: any) => c.status === "UPCOMING")) {
    cohortStatus = "Upcoming";
  } else if (cohorts.some((c: any) => c.status === "IN_PROGRESS")) {
    cohortStatus = "Ongoing";
  }

  return {
    id: item.id,
    tag: catDetails.tag,
    title: item.title,
    desc: item.description || "",
    level: item.prerequisites ? `Prereq: ${item.prerequisites}` : "Beginner → Intermediate",
    duration: item.duration_weeks || item.durationWeeks ? `${item.duration_weeks || item.durationWeeks} weeks` : "Self-paced",
    mode,
    cohort: cohortStatus,
    cert: "Certificate of completion",
    color: catDetails.color,
    titleColor: catDetails.titleColor,
    prerequisites: item.prerequisites || "",
    durationWeeks: item.duration_weeks || item.durationWeeks || undefined,
    deliveryMode: item.delivery_mode || item.deliveryMode || "ONLINE",
    isFeatured: item.is_featured || item.isFeatured || false,
    isPublished: item.is_published || item.isPublished || false,
    category: item.category || "",
  };
};

export const getPublicCourses = async (): Promise<CourseItem[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/courses");
  return response.data.data.map(mapCourse);
};
