import { NextResponse } from "next/server";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.name || !body.email) {
    return NextResponse.json(
      { error: "Please fill in the required fields." },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured) {
    // No DB yet — accept gracefully so the form works during setup.
    console.log("[booking request - no DB configured]", body);
    return NextResponse.json({ ok: true, stored: false });
  }

  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json(
      { error: "Server is not configured to save requests yet." },
      { status: 500 }
    );
  }

  const { error } = await sb.from("bookings").insert({
    name: String(body.name).slice(0, 200),
    email: String(body.email).slice(0, 200),
    phone: String(body.phone || "").slice(0, 50),
    event_date: body.eventDate || null,
    event_type: String(body.eventType || "").slice(0, 100),
    message: String(body.message || "").slice(0, 2000),
  });

  if (error) {
    return NextResponse.json({ error: "Could not save request." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
