import { isAdmin } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllAnnouncements, getBookings, getEvents } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Owner Login — DonutNV McDonough" };

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }
  const [events, announcements, bookings] = await Promise.all([
    getEvents(),
    getAllAnnouncements(),
    getBookings(),
  ]);
  return (
    <AdminDashboard
      events={events}
      announcements={announcements}
      bookings={bookings}
      dbReady={isSupabaseConfigured}
    />
  );
}
