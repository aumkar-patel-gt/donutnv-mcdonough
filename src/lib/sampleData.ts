import { ScheduleEvent, Announcement } from "./types";

// Sample data used when Supabase is not yet configured, so the site
// renders something realistic during local development / preview.

function isoOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const sampleEvents: ScheduleEvent[] = [
  {
    id: "s1",
    title: "McDonough Square Market",
    locationName: "McDonough Square",
    address: "10 Macon St, McDonough, GA 30253",
    date: isoOffset(0),
    startTime: "10:00",
    endTime: "14:00",
    visibility: "public",
    notes: "Come find the truck by the gazebo!",
  },
  {
    id: "s2",
    title: "Private Birthday Party",
    locationName: "Private Residence",
    address: "Eagles Landing, McDonough, GA",
    date: isoOffset(0),
    startTime: "16:00",
    endTime: "18:00",
    visibility: "private",
    notes: "Private event — open to invited guests.",
  },
  {
    id: "s3",
    title: "Friday Night Lights",
    locationName: "Ola High School",
    address: "357 N Ola Rd, McDonough, GA 30252",
    date: isoOffset(2),
    startTime: "18:00",
    endTime: "21:00",
    visibility: "public",
  },
  {
    id: "s4",
    title: "Farmers Market",
    locationName: "Heritage Park",
    address: "101 Lake Dow Rd, McDonough, GA 30252",
    date: isoOffset(3),
    startTime: "09:00",
    endTime: "13:00",
    visibility: "public",
  },
  {
    id: "s5",
    title: "Corporate Catering",
    locationName: "Piedmont Henry Hospital",
    address: "1133 Eagles Landing Pkwy, Stockbridge, GA",
    date: isoOffset(5),
    startTime: "11:00",
    endTime: "13:30",
    visibility: "private",
  },
];

export const sampleAnnouncements: Announcement[] = [
  {
    id: "a1",
    message:
      "Heads up! Today's afternoon stop may shift due to weather — check back here for updates.",
    level: "alert",
    active: true,
    createdAt: new Date().toISOString(),
  },
];
