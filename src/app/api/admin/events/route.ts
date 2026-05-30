import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

function noDb() {
  return NextResponse.json(
    { error: "Database not configured. Add your Supabase keys to .env.local." },
    { status: 500 }
  );
}

function toRow(b: Record<string, unknown>) {
  return {
    title: String(b.title || "").slice(0, 200),
    location_name: String(b.locationName || "").slice(0, 200),
    address: String(b.address || "").slice(0, 300),
    date: b.date,
    start_time: b.startTime,
    end_time: b.endTime,
    visibility: b.visibility === "private" ? "private" : "public",
    notes: b.notes ? String(b.notes).slice(0, 1000) : null,
  };
}

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceSupabase();
  if (!sb) return noDb();
  const body = await req.json();
  const { error } = await sb.from("events").insert(toRow(body));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceSupabase();
  if (!sb) return noDb();
  const body = await req.json();
  if (!body.id)
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await sb.from("events").update(toRow(body)).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceSupabase();
  if (!sb) return noDb();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await sb.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
