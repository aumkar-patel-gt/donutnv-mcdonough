"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ScheduleEvent } from "@/lib/types";
import {
  addDays,
  formatTime,
  parseLocalDate,
  startOfWeek,
  toIso,
} from "@/lib/format";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function WeeklyGraphic({ events }: { events: ScheduleEvent[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const base = addDays(new Date(), weekOffset * 7);
  const weekStart = startOfWeek(base);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = days[6];

  const byDate = new Map<string, ScheduleEvent[]>();
  for (const e of events) {
    const arr = byDate.get(e.date) ?? [];
    arr.push(e);
    byDate.set(e.date, arr);
  }

  const rangeLabel = `${weekStart.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })} – ${weekEnd.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })}`;

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `donutnv-schedule-${toIso(weekStart)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Sorry, the download failed — try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Week controls */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="h-10 w-10 rounded-full bg-gray-100 text-lg font-bold text-dnv-navy hover:bg-dnv-blue hover:text-white"
        >
          ‹
        </button>
        <button
          onClick={() => setWeekOffset(0)}
          className="rounded-full px-4 py-2 text-sm font-bold text-dnv-blue hover:bg-dnv-blue/10"
        >
          This Week
        </button>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="h-10 w-10 rounded-full bg-gray-100 text-lg font-bold text-dnv-navy hover:bg-dnv-blue hover:text-white"
        >
          ›
        </button>
      </div>

      {/* The graphic — fixed Instagram portrait size (1080x1350), scaled to fit screen */}
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl shadow-2xl">
        <div
          className="origin-top-left"
          style={{ transform: "scale(0.3889)", width: 1080, height: 1350 }}
        >
          <div
            ref={cardRef}
            style={{ width: 1080, height: 1350 }}
            className="relative flex flex-col bg-gradient-to-b from-dnv-blue to-dnv-blue-dark"
          >
            {/* polka dots */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 3px, transparent 3.5px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* top awning */}
            <AwningStrip />

            {/* header */}
            <div className="relative px-14 pt-10 text-center text-white">
              <div className="mx-auto mb-4 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white shadow-lg">
                <Image
                  src="/brand/logo-badge.png"
                  alt="DonutNV"
                  width={140}
                  height={140}
                  className="h-[140px] w-[140px]"
                />
              </div>
              <h1 className="font-display text-[72px] font-extrabold leading-none">
                THIS WEEK
              </h1>
              <p className="mt-2 font-display text-[34px] font-bold text-white/90">
                {rangeLabel}
              </p>
            </div>

            {/* days list */}
            <div className="relative mt-6 flex-1 px-10">
              <div className="space-y-3">
                {days.map((d) => {
                  const iso = toIso(d);
                  const dayEvents = byDate.get(iso) ?? [];
                  return (
                    <div
                      key={iso}
                      className="flex items-stretch overflow-hidden rounded-2xl bg-white/95"
                    >
                      <div className="flex w-[150px] flex-col items-center justify-center bg-dnv-red px-2 py-3 text-white">
                        <span className="font-display text-[26px] font-extrabold uppercase leading-none">
                          {DAY_NAMES[d.getDay()].slice(0, 3)}
                        </span>
                        <span className="text-[20px] font-bold">
                          {d.getDate()}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center px-5 py-3">
                        {dayEvents.length === 0 ? (
                          <span className="text-[24px] font-semibold text-gray-400">
                            — No stops —
                          </span>
                        ) : (
                          dayEvents.map((e) => (
                            <div key={e.id} className="py-0.5">
                              <span className="font-display text-[27px] font-extrabold text-dnv-navy">
                                {e.locationName}
                              </span>
                              <span className="text-[24px] font-bold text-dnv-red">
                                {"  "}
                                {formatTime(e.startTime)}–{formatTime(e.endTime)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* footer */}
            <div className="relative px-10 pb-8 pt-5 text-center text-white">
              <p className="font-display text-[30px] font-extrabold">
                Hot Donuts • Fresh Lemonade
              </p>
              <p className="text-[24px] font-bold text-white/85">
                @donutnvmcdonoughga
              </p>
            </div>
            <AwningStripBottom />
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={download}
        disabled={downloading}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-dnv-red px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-dnv-red-dark disabled:opacity-60"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {downloading ? "Preparing image…" : "Download this week's graphic"}
      </button>
      <p className="mt-3 max-w-sm text-center text-sm text-gray-500">
        Saves a ready-to-post image to your phone. Then just open Instagram and
        post it!
      </p>
    </div>
  );
}

function AwningStrip() {
  return (
    <div className="relative flex h-[60px] w-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1"
          style={{
            backgroundColor: i % 2 === 0 ? "#e11b22" : "#b9151b",
            borderBottomLeftRadius: "50% 90%",
            borderBottomRightRadius: "50% 90%",
          }}
        />
      ))}
    </div>
  );
}

function AwningStripBottom() {
  return (
    <div className="relative flex h-[24px] w-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1"
          style={{ backgroundColor: i % 2 === 0 ? "#e11b22" : "#b9151b" }}
        />
      ))}
    </div>
  );
}
