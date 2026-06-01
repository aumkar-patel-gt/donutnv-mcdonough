"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Announcement,
  BookingRequest,
  ScheduleEvent,
} from "@/lib/types";
import { formatDateLong, formatTimeRange } from "@/lib/format";

type Tab = "schedule" | "announcements" | "bookings";

type EventForm = {
  id: string;
  title: string;
  locationName: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  visibility: "public" | "private";
  notes: string;
};

const emptyEvent: EventForm = {
  id: "",
  title: "",
  locationName: "",
  address: "",
  date: "",
  startTime: "10:00",
  endTime: "14:00",
  visibility: "public",
  notes: "",
};

export function AdminDashboard({
  events,
  announcements,
  bookings,
  dbReady,
}: {
  events: ScheduleEvent[];
  announcements: Announcement[];
  bookings: BookingRequest[];
  dbReady: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("schedule");

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold text-dnv-navy">
          Owner Dashboard
        </h1>
        <button
          onClick={logout}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-dnv-navy hover:bg-gray-50"
        >
          Log out
        </button>
      </div>

      {/* Quick link to the auto-generated weekly post graphic */}
      <Link
        href="/this-week"
        className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-dnv-blue px-5 py-4 text-white shadow transition hover:bg-dnv-blue-dark"
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl">📸</span>
          <span>
            <span className="block font-display text-lg font-extrabold">
              Make an Instagram graphic
            </span>
            <span className="text-sm text-white/85">
              Weekly schedule + daily reminders — download &amp; post. No Canva!
            </span>
          </span>
        </span>
        <span className="text-2xl">→</span>
      </Link>

      {!dbReady && (
        <div className="mt-4 rounded-xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-800">
          ⚠️ Database not connected yet. You can look around, but saving
          won&apos;t work until Supabase keys are added (see SETUP.md). The site
          is showing sample data.
        </div>
      )}

      <div className="mt-6 inline-flex rounded-full bg-gray-100 p-1">
        {(["schedule", "announcements", "bookings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "rounded-full px-5 py-2 text-sm font-bold capitalize transition " +
              (tab === t
                ? "bg-dnv-blue text-white shadow"
                : "text-dnv-navy hover:text-dnv-blue")
            }
          >
            {t}
            {t === "bookings" && bookings.length > 0 && (
              <span className="ml-1 rounded-full bg-dnv-red px-1.5 text-xs text-white">
                {bookings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "schedule" && <ScheduleManager events={events} />}
        {tab === "announcements" && (
          <AnnouncementManager announcements={announcements} />
        )}
        {tab === "bookings" && <BookingsList bookings={bookings} />}
      </div>
    </section>
  );
}

/* ---------------- Schedule ---------------- */

function ScheduleManager({ events }: { events: ScheduleEvent[] }) {
  const router = useRouter();
  const [form, setForm] = useState<EventForm>(emptyEvent);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const editing = Boolean(form.id);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/events", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      setForm(emptyEvent);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error || "Could not save.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this stop?")) return;
    const res = await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) router.refresh();
  }

  const input =
    "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-dnv-blue focus:outline-none focus:ring-2 focus:ring-dnv-blue/30";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={save}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <h2 className="font-display text-lg font-bold text-dnv-navy">
          {editing ? "Edit stop" : "Add a new stop"}
        </h2>
        <div className="mt-3 space-y-3">
          <label className="block text-sm font-bold text-dnv-navy">
            Event name
            <input
              className={input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="McDonough Square Market"
              required
            />
          </label>
          <label className="block text-sm font-bold text-dnv-navy">
            Location name
            <input
              className={input}
              value={form.locationName}
              onChange={(e) =>
                setForm({ ...form, locationName: e.target.value })
              }
              placeholder="McDonough Square"
              required
            />
          </label>
          <label className="block text-sm font-bold text-dnv-navy">
            Address
            <input
              className={input}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="10 Macon St, McDonough, GA"
              required
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm font-bold text-dnv-navy">
              Date
              <input
                type="date"
                className={input}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>
            <label className="block text-sm font-bold text-dnv-navy">
              Start
              <input
                type="time"
                className={input}
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                required
              />
            </label>
            <label className="block text-sm font-bold text-dnv-navy">
              End
              <input
                type="time"
                className={input}
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
              />
            </label>
          </div>
          <label className="block text-sm font-bold text-dnv-navy">
            Public or private?
            <select
              className={input}
              value={form.visibility}
              onChange={(e) =>
                setForm({
                  ...form,
                  visibility: e.target.value as "public" | "private",
                })
              }
            >
              <option value="public">Public — open to everyone</option>
              <option value="private">Private — invited guests</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-dnv-navy">
            Notes (optional)
            <input
              className={input}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Find us by the gazebo!"
            />
          </label>
        </div>

        {msg && (
          <p className="mt-3 text-sm font-semibold text-dnv-red">{msg}</p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-dnv-red px-5 py-2.5 font-bold text-white hover:bg-dnv-red-dark disabled:opacity-60"
          >
            {busy ? "Saving…" : editing ? "Update stop" : "Add stop"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => setForm(emptyEvent)}
              className="rounded-full border border-gray-200 px-5 py-2.5 font-semibold text-dnv-navy hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-display text-lg font-bold text-dnv-navy">
          Upcoming stops ({events.length})
        </h2>
        <div className="mt-3 space-y-3">
          {events.length === 0 && (
            <p className="text-sm text-gray-400">No stops yet.</p>
          )}
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-dnv-navy">{e.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateLong(e.date)} · {formatTimeRange(e)}
                  </p>
                  <p className="text-sm text-gray-500">{e.locationName}</p>
                  <span
                    className={
                      "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase " +
                      (e.visibility === "public"
                        ? "bg-dnv-blue/10 text-dnv-blue"
                        : "bg-dnv-red/10 text-dnv-red")
                    }
                  >
                    {e.visibility}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() =>
                      setForm({
                        id: e.id,
                        title: e.title,
                        locationName: e.locationName,
                        address: e.address,
                        date: e.date,
                        startTime: e.startTime,
                        endTime: e.endTime,
                        visibility: e.visibility,
                        notes: e.notes ?? "",
                      })
                    }
                    className="rounded-lg px-3 py-1 text-sm font-semibold text-dnv-blue hover:bg-dnv-blue/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(e.id)}
                    className="rounded-lg px-3 py-1 text-sm font-semibold text-dnv-red hover:bg-dnv-red/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Announcements ---------------- */

function AnnouncementManager({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState<"info" | "alert">("alert");
  const [busy, setBusy] = useState(false);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, level }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage("");
      router.refresh();
    }
  }

  async function toggle(id: string, active: boolean) {
    await fetch("/api/admin/announcements", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    await fetch("/api/admin/announcements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={post}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <h2 className="font-display text-lg font-bold text-dnv-navy">
          Post an announcement
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Use this for last-minute cancellations or location changes. It shows
          as a banner at the top of the site.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
          placeholder="Today's 4pm stop is cancelled due to rain — sorry!"
          className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-dnv-blue focus:outline-none focus:ring-2 focus:ring-dnv-blue/30"
        />
        <div className="mt-3 flex items-center gap-3">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as "info" | "alert")}
            className="rounded-xl border border-gray-200 px-3 py-2"
          >
            <option value="alert">Alert (red)</option>
            <option value="info">Info (blue)</option>
          </select>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-dnv-red px-5 py-2.5 font-bold text-white hover:bg-dnv-red-dark disabled:opacity-60"
          >
            {busy ? "Posting…" : "Post"}
          </button>
        </div>
      </form>

      <div>
        <h2 className="font-display text-lg font-bold text-dnv-navy">
          Posted announcements
        </h2>
        <div className="mt-3 space-y-3">
          {announcements.length === 0 && (
            <p className="text-sm text-gray-400">Nothing posted.</p>
          )}
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="text-dnv-navy">{a.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs font-bold " +
                    (a.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500")
                  }
                >
                  {a.active ? "LIVE" : "hidden"}
                </span>
                <button
                  onClick={() => toggle(a.id, !a.active)}
                  className="rounded-lg px-2 py-1 text-sm font-semibold text-dnv-blue hover:bg-dnv-blue/10"
                >
                  {a.active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="rounded-lg px-2 py-1 text-sm font-semibold text-dnv-red hover:bg-dnv-red/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Bookings ---------------- */

function BookingsList({ bookings }: { bookings: BookingRequest[] }) {
  if (bookings.length === 0) {
    return (
      <p className="rounded-xl bg-dnv-cream p-5 text-dnv-navy">
        No booking requests yet. When someone fills out the &quot;Book Us&quot;
        form, it shows up here.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div
          key={b.id}
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-dnv-navy">
              {b.name} · {b.eventType}
            </p>
            <p className="text-sm text-gray-500">{b.eventDate}</p>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            <a href={`mailto:${b.email}`} className="text-dnv-blue">
              {b.email}
            </a>{" "}
            ·{" "}
            <a href={`tel:${b.phone}`} className="text-dnv-blue">
              {b.phone}
            </a>
          </p>
          {b.message && (
            <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {b.message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
