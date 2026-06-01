import { NextResponse } from "next/server";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Resend } from "resend";

// Sends an email alert to the owner when a booking comes in.
// Only runs if RESEND_API_KEY and BOOKING_NOTIFY_EMAIL are set — otherwise
// it silently skips, so the form keeps working without email configured.
async function notifyOwner(body: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_EMAIL;
  if (!key || !to) return;
  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from: "DonutNV Bookings <onboarding@resend.dev>",
      to,
      replyTo: body.email,
      subject: `New booking request: ${body.eventType || "Event"} — ${body.name}`,
      text: [
        `New booking request from the website:`,
        ``,
        `Name:        ${body.name}`,
        `Email:       ${body.email}`,
        `Phone:       ${body.phone || "(none)"}`,
        `Event date:  ${body.eventDate || "(none)"}`,
        `Time frame:  ${body.timeFrame || "(none)"}`,
        `Event type:  ${body.eventType || "(none)"}`,
        `Servings:    ${body.servings || "(none)"}`,
        `Venue:       ${body.venue || "(none)"}`,
        `Heard via:   ${body.heardAbout || "(none)"}`,
        ``,
        `Message:`,
        body.message || "(none)",
      ].join("\n"),
    });
  } catch (e) {
    console.error("[booking email failed]", e);
  }
}

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
    time_frame: String(body.timeFrame || "").slice(0, 100),
    event_type: String(body.eventType || "").slice(0, 100),
    servings: String(body.servings || "").slice(0, 100),
    venue: String(body.venue || "").slice(0, 300),
    heard_about: String(body.heardAbout || "").slice(0, 100),
    message: String(body.message || "").slice(0, 2000),
  });

  if (error) {
    return NextResponse.json({ error: "Could not save request." }, { status: 500 });
  }

  await notifyOwner(body);

  return NextResponse.json({ ok: true, stored: true });
}
