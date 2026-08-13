import { api } from "../../axios.ts";
import { CourseItem } from "../../../src/types/courses";
import { mapCourse } from "../courses";

export interface Cohort {
  id: string;
  courseId: string;
  name: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  durationMinutes?: number;
  order: number;
}

export const getAdminCourses = async (): Promise<CourseItem[]> => {
  const response = await api.get<{ data: any[] }>("/api/v1/admin/courses");
  return response.data.data.map(mapCourse);
};

export const createCourse = async (course: Omit<CourseItem, "id">): Promise<CourseItem> => {
  const payload = {
    title: course.title,
    description: course.desc,
    category: course.category || "Software",
    deliveryMode: course.deliveryMode || "ONLINE",
    durationWeeks: course.durationWeeks || undefined,
    prerequisites: course.prerequisites || "",
    coverImageUrl: course.coverImageUrl || undefined,
    isFeatured: course.isFeatured || false,
    isPublished: course.isPublished || false,
  };
  const response = await api.post<{ data: any }>("/api/v1/admin/courses", payload);
  return mapCourse(response.data.data);
};

export const updateCourse = async (id: string, course: Partial<CourseItem>): Promise<CourseItem> => {
  const payload = {
    title: course.title,
    description: course.desc,
    category: course.category,
    deliveryMode: course.deliveryMode,
    durationWeeks: course.durationWeeks,
    prerequisites: course.prerequisites,
    coverImageUrl: course.coverImageUrl || undefined,
    isFeatured: course.isFeatured,
    isPublished: course.isPublished,
  };
  const response = await api.patch<{ data: any }>(`/api/v1/admin/courses/${id}`, payload);
  return mapCourse(response.data.data);
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/courses/${id}`);
};

export const createCohort = async (courseId: string, cohort: Omit<Cohort, "id" | "courseId">): Promise<Cohort> => {
  const response = await api.post<{ data: Cohort }>(`/api/v1/admin/courses/${courseId}/cohorts`, cohort);
  return response.data.data;
};

export const createLesson = async (courseId: string, lesson: Omit<Lesson, "id" | "courseId">): Promise<Lesson> => {
  const response = await api.post<{ data: Lesson }>(`/api/v1/admin/courses/${courseId}/lessons`, lesson);
  return response.data.data;
};
