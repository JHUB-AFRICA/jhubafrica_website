import { CSSProperties, ReactNode } from "react";

export const ROLES = ["Student", "Innovator", "Partner", "Sponsor", "Volunteer"] as const;
export type RoleOption = (typeof ROLES)[number];

export interface ApplyDialogProps {
  triggerText: string;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost";
  triggerClassName?: string;
  triggerStyle?: CSSProperties;
  source?: string;
}

export interface ApplyFormData {
  fullName: string;
  email: string;
  phone: string;
  role: RoleOption;
  message: string;
  innovationTitle?: string;
  sector?: string;
  stage?: "Concept" | "Prototype" | "Pilot" | "Market entry" | "Scale";
  problem?: string;
  solution?: string;
  need?: string;
}

export const initialForm: ApplyFormData = {
  fullName: "",
  email: "",
  phone: "",
  role: "Student",
  message: "",
  innovationTitle: "",
  sector: "Big AI Ideas",
  stage: "Concept",
  problem: "",
  solution: "",
  need: "",
};
