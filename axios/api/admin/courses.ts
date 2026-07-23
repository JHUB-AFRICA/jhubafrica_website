import { api } from "../../axios.ts";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  image?: string;
  isActive: boolean;
}

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

export const createCourse = async (course: Omit<Course, "id">): Promise<Course> => {
  const response = await api.post<Course>("/api/v1/admin/courses", course);
  return response.data;
};

export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  const response = await api.patch<Course>(`/api/v1/admin/courses/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/courses/${id}`);
};

export const createCohort = async (courseId: string, cohort: Omit<Cohort, "id" | "courseId">): Promise<Cohort> => {
  const response = await api.post<Cohort>(`/api/v1/admin/courses/${courseId}/cohorts`, cohort);
  return response.data;
};

export const createLesson = async (courseId: string, lesson: Omit<Lesson, "id" | "courseId">): Promise<Lesson> => {
  const response = await api.post<Lesson>(`/api/v1/admin/courses/${courseId}/lessons`, lesson);
  return response.data;
};
