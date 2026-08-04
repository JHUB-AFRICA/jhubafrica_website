export interface ApplicationRequest {
    fullName: string;
    email: string;
    phone: string;
    role: "Student" | "Innovator" | "Partner" | "Sponsor" | "Volunteer";
    message: string;
    source?: string;
    innovationTitle?: string;
    sector?: string;
    stage?: string;
    problem?: string;
    solution?: string;
    need?: string;
}

export interface ApplicationItem extends ApplicationRequest {
    id: string;
    date: string;
}
