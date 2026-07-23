export interface ApplicationRequest {
    fullName: string;
    email: string;
    phone: string;
    role: "Student" | "Innovator" | "Partner" | "Sponsor" | "Volunteer";
    message: string;
    source?: string;
}

export interface ApplicationItem extends ApplicationRequest {
    id: string;
    date: string;
}
