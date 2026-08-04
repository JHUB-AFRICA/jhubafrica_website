export interface CourseItem {
  id: string;
  tag: string;
  title: string;
  desc: string;
  level: string;
  duration: string;
  mode: string;
  cohort: string;
  cert: string;
  color: "g" | "b" | "p";
  titleColor: "green" | "blue" | "purple";
  prerequisites?: string;
  durationWeeks?: number;
  deliveryMode?: "IN_PERSON" | "ONLINE" | "HYBRID";
  isFeatured?: boolean;
  isPublished?: boolean;
  category?: string;
  coverImageUrl?: string;
}
