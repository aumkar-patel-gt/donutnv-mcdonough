export type EventVisibility = "public" | "private";

export interface ScheduleEvent {
  id: string;
  title: string;
  locationName: string;
  address: string;
  date: string; // ISO date: YYYY-MM-DD
  startTime: string; // "10:00"
  endTime: string; // "14:00"
  visibility: EventVisibility;
  notes?: string;
}

export interface Announcement {
  id: string;
  message: string;
  level: "info" | "alert";
  active: boolean;
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  message: string;
  createdAt: string;
}
