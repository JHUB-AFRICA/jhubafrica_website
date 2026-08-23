export type JHubTeamCategory =
  | "ADVISORY_BOARD"
  | "DEV_TEAM"
  | "EXECUTIVE"
  | "MENTORS"
  | "SECRETARIAT";

export interface JHubTeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  avatarUrl?: string;
  category: JHubTeamCategory;
}
