import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

function noDb() {
  return NextResponse.json(
    { error: "Database not configured. Add your Supabase keys to .env.local." },
    { status: 500 }
  );
}

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceSupabase();
  if (!sb) return noDb();
  const body = await req.json();
  const { error } = await sb.from("announcements").insert({
    message: String(body.message || "").slice(0, 500),
    level: body.level === "alert" ? "alert" : "info",
    active: true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceSupabase();
  if (!sb) return noDb();
  const { id, active } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await sb
    .from("announcements")
    .update({ active: Boolean(active) })
    .eq("id", id);
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
  const { error } = await sb.from("announcements").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
