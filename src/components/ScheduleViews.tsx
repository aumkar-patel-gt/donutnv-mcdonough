"use client";

import { useMemo, useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { EventCard } from "./EventCard";
import {
  addDays,
  formatDateLong,
  parseLocalDate,
  startOfWeek,
  toIso,
  todayIso,
  formatTime,
} from "@/lib/format";

type View = "week" | "month";

export function ScheduleViews({ events }: { events: ScheduleEvent[] }) {
  const [view, setView] = useState<View>("week");
  const [anchor, setAnchor] = useState(new Date());

  const byDate = useMemo(() => {
    const m = new Map<string, ScheduleEvent[]>();
    for (const e of events) {
      const arr = m.get(e.date) ?? [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, [events]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {(["week", "month"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={
                "rounded-full px-5 py-2 text-sm font-bold capitalize transition " +
                (view === v
                  ? "bg-dnv-blue text-white shadow"
                  : "text-dnv-navy hover:text-dnv-blue")
              }
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <NavBtn
            onClick={() =>
              setAnchor((d) => addDays(d, view === "week" ? -7 : -30))
            }
            label="‹"
          />
          <button
            onClick={() => setAnchor(new Date())}
            className="rounded-full px-3 py-2 text-sm font-semibold text-dnv-blue hover:bg-dnv-blue/10"
          >
            Today
          </button>
          <NavBtn
            onClick={() =>
              setAnchor((d) => addDays(d, view === "week" ? 7 : 30))
            }
            label="›"
          />
        </div>
      </div>

      {view === "week" ? (
        <WeekView anchor={anchor} byDate={byDate} />
      ) : (
        <MonthView anchor={anchor} byDate={byDate} />
      )}
    </div>
  );
}

function NavBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="h-9 w-9 rounded-full bg-gray-100 text-lg font-bold text-dnv-navy hover:bg-dnv-blue hover:text-white"
    >
      {label}
    </button>
  );
}

function WeekView({
  anchor,
  byDate,
}: {
  anchor: Date;
  byDate: Map<string, ScheduleEvent[]>;
}) {
  const start = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const today = todayIso();

  return (
    <div className="space-y-4">
      {days.map((d) => {
        const iso = toIso(d);
        const dayEvents = byDate.get(iso) ?? [];
        const isToday = iso === today;
        return (
          <div
            key={iso}
            className={
              "rounded-2xl border p-4 " +
              (isToday
                ? "border-dnv-red bg-dnv-red/5"
                : "border-gray-100 bg-white")
            }
          >
            <div className="mb-3 flex items-center gap-2">
              <h3 className="font-display font-bold text-dnv-navy">
                {formatDateLong(iso)}
              </h3>
              {isToday && (
                <span className="rounded-full bg-dnv-red px-2 py-0.5 text-xs font-bold text-white">
                  TODAY
                </span>
              )}
            </div>
            {dayEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No stops scheduled.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dayEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MonthView({
  anchor,
  byDate,
}: {
  anchor: Date;
  byDate: Map<string, ScheduleEvent[]>;
}) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const today = todayIso();
  const monthLabel = first.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h3 className="mb-3 text-center font-display text-xl font-extrabold text-dnv-navy">
        {monthLabel}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-gray-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const iso = toIso(d);
          const inMonth = d.getMonth() === month;
          const dayEvents = byDate.get(iso) ?? [];
          const isToday = iso === today;
          return (
            <div
              key={iso}
              className={
                "min-h-[84px] rounded-lg border p-1.5 text-left " +
                (inMonth ? "bg-white" : "bg-gray-50 text-gray-300") +
                (isToday ? " border-dnv-red" : " border-gray-100")
              }
            >
              <div
                className={
                  "text-xs font-bold " +
                  (isToday ? "text-dnv-red" : inMonth ? "text-dnv-navy" : "")
                }
              >
                {d.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((e) => (
                  <div
                    key={e.id}
                    title={`${e.title} • ${formatTime(e.startTime)}`}
                    className={
                      "truncate rounded px-1 py-0.5 text-[10px] font-semibold text-white " +
                      (e.visibility === "public"
                        ? "bg-dnv-blue"
                        : "bg-dnv-red")
                    }
                  >
                    {formatTime(e.startTime)} {e.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center gap-4 text-xs font-semibold text-gray-500">
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-dnv-blue" /> Public
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-dnv-red" /> Private
        </span>
      </div>
    </div>
  );
}
