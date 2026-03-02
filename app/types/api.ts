export interface ApiEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  meeting_url?: string;
  type: "webinar" | "in-person";
  attendees: number;
  max_capacity: number;
  description: string;
  tags: string[];
}
