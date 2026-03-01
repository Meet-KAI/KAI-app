export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  meetingUrl?: string;
  type: "webinar" | "in-person";
  attendees: number;
  maxCapacity: number;
  description: string;
  tags: string[];
}
