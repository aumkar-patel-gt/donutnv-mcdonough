import { getSupabase } from "./supabase";
import { sampleAnnouncements, sampleEvents } from "./sampleData";
import { Announcement, BookingRequest, ScheduleEvent } from "./types";

// Row shapes in Supabase use snake_case; map to our camelCase types.

function mapEvent(row: Record<string, unknown>): ScheduleEvent {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    locationName: String(row.location_name ?? ""),
    address: String(row.address ?? ""),
    date: String(row.date ?? ""),
    startTime: String(row.start_time ?? "").slice(0, 5),
    endTime: String(row.end_time ?? "").slice(0, 5),
    visibility: (row.visibility === "private" ? "private" : "public"),
    notes: row.notes ? String(row.notes) : undefined,
  };
}

function mapAnnouncement(row: Record<string, unknown>): Announcement {
  return {
    id: String(row.id),
    message: String(row.message ?? ""),
    level: row.level === "alert" ? "alert" : "info",
    active: Boolean(row.active),
    createdAt: String(row.created_at ?? ""),
  };
}

export async function getEvents(): Promise<ScheduleEvent[]> {
  // Only return stops from today onward, so past events automatically
  // drop off the schedule — the owner never has to delete old ones.
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  const sb = getSupabase();
  if (!sb) return sampleEvents.filter((e) => e.date >= todayIso);
  const { data, error } = await sb
    .from("events")
    .select("*")
    .gte("date", todayIso)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });
  if (error || !data) return sampleEvents.filter((e) => e.date >= todayIso);
  return data.map(mapEvent);
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const sb = getSupabase();
  if (!sb) return sampleAnnouncements.filter((a) => a.active);
  const { data, error } = await sb
    .from("announcements")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapAnnouncement);
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  const sb = getSupabase();
  if (!sb) return sampleAnnouncements;
  const { data, error } = await sb
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapAnnouncement);
}

export async function getBookings(): Promise<BookingRequest[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    eventDate: String(row.event_date ?? ""),
    timeFrame: String(row.time_frame ?? ""),
    eventType: String(row.event_type ?? ""),
    servings: String(row.servings ?? ""),
    venue: String(row.venue ?? ""),
    heardAbout: String(row.heard_about ?? ""),
    message: String(row.message ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}
