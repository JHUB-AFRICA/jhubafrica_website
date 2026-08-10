import { api } from "../axios";
import { ApplicationRequest, ApplicationItem } from "../../src/types/applications";

export interface InnovationSubmissionRequest {
  contactName: string;
  contactEmail: string;
  phone: string;
  title: string;
  sector: string;
  stage: "IDEA" | "PROTOTYPE" | "PILOT" | "SCALING" | "MATURE";
  problem: string;
  solution: string;
  supportRequired: string;
  teamInfo: string;
  projectLinks?: string;
  attachmentUrl?: string;
}

export const submitInnovationSubmission = async (
  payload: InnovationSubmissionRequest
): Promise<any> => {
  const response = await api.post("/api/v1/innovations/submit", payload);
  return response.data;
};

export const submitApplication = async (application: ApplicationRequest): Promise<ApplicationItem> => {
  const categoriesMap: Record<string, string> = {
    Student: "COURSES",
    Innovator: "INNOVATION_SUBMISSION",
    Partner: "PARTNERSHIP",
    Sponsor: "FUNDING",
    Volunteer: "OTHER",
  };

  const payload = {
    name: application.fullName,
    email: application.email,
    phone: application.phone,
    category: categoriesMap[application.role] || "GENERAL",
    subject: `Connect Application - ${application.role}`,
    message: application.message.length >= 10 ? application.message : application.message.padEnd(10, " "),
    preferredResponseChannel: "email",
  };

  const response = await api.post<ApplicationItem>("/api/v1/contact", payload);
  return response.data;
};
