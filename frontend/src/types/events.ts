export interface EventItem {
    id: string;
    day: string;
    month: string;
    startDateISO: string;
    title: string;
    desc: string;
    titleColor: "" | "green" | "red";
    image?: string;
    location?: string;
    slug?: string;
    type?: string;
    meetingUrl?: string;
    isOnline?: boolean;
    registrationUrl?: string;
}
