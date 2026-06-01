"use client";

import { useRef, useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { addDays, formatTime, startOfWeek, toIso } from "@/lib/format";

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Canvas matches the template image aspect (portrait ~8.5x11).
const W = 1545;
const H = 2000;
const SCALE = 420 / W;

/* --- Layout config (measured from the template image) --- */
const ROW_TOP0 = 26.2; // top of the first (Monday) row, % from top
const ROW_PITCH = 9.55; // vertical distance between row tops, %
const ROW_HEIGHT = 9.0; // height of each row box, %
const COL_RED = { left: 1.7, width: 15.0 }; // red day chip
const COL_GRAY = { left: 17.6, width: 64.7 }; // gray event card
const COL_BLUE = { left: 83.1, width: 15.9 }; // blue time chip

export function WeeklyGraphic({ events }: { events: ScheduleEvent[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7));
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const byDate = new Map<string, ScheduleEvent[]>();
  for (const e of events) {
    const arr = byDate.get(e.date) ?? [];
    arr.push(e);
    byDate.set(e.date, arr);
  }

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const imgs = Array.from(cardRef.current.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = res;
                img.onerror = res;
              })
        )
      );
      const opts = { pixelRatio: 2, cacheBust: true, backgroundColor: "#0b3f86" };
      await toPng(cardRef.current, opts);
      const dataUrl = await toPng(cardRef.current, opts);
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

      <div
        className="overflow-hidden rounded-xl shadow-2xl"
        style={{ width: W * SCALE, height: H * SCALE }}
      >
        <div
          className="origin-top-left"
          style={{ transform: `scale(${SCALE})`, width: W, height: H }}
        >
          <div
            ref={cardRef}
            style={{ width: W, height: H }}
            className="relative overflow-hidden bg-[#0b3f86]"
          >
            {/* Template background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/template-weekly.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Rows overlay — each row absolutely positioned over its template box */}
            {days.map((d, idx) => {
              const iso = toIso(d);
              const dayEvents = byDate.get(iso) ?? [];
              const dateNum = d.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
              });
              const rowTop = ROW_TOP0 + idx * ROW_PITCH;
              const multi = dayEvents.length > 1;
              return (
                <div
                  key={iso}
                  className="absolute"
                  style={{
                    top: `${rowTop}%`,
                    height: `${ROW_HEIGHT}%`,
                    left: 0,
                    right: 0,
                  }}
                >
                  {/* red day chip */}
                  <div
                    className="absolute inset-y-0 flex flex-col items-center justify-center text-center text-white"
                    style={{
                      left: `${COL_RED.left}%`,
                      width: `${COL_RED.width}%`,
                    }}
                  >
                    <span
                      className="font-fredoka font-bold leading-none"
                      style={{ fontSize: 56 }}
                    >
                      {DAY_ABBR[d.getDay()]}
                    </span>
                    <span
                      className="mt-1.5 font-fredoka font-semibold leading-none"
                      style={{ fontSize: 42 }}
                    >
                      {dateNum}
                    </span>
                  </div>

                  {/* gray event card: name / location / address+pin */}
                  <div
                    className="absolute inset-y-0 flex flex-col items-center justify-center px-8 text-center leading-tight"
                    style={{
                      left: `${COL_GRAY.left}%`,
                      width: `${COL_GRAY.width}%`,
                    }}
                  >
                    {dayEvents.length === 0 ? (
                      <span
                        className="font-semibold text-gray-400"
                        style={{ fontSize: 32 }}
                      >
                        — No stops —
                      </span>
                    ) : (
                      dayEvents.map((e, i) => (
                        <div
                          key={e.id}
                          className={
                            i > 0 ? "mt-1.5 border-t border-gray-300 pt-1.5" : ""
                          }
                        >
                          <div
                            className="font-fredoka font-bold leading-tight text-dnv-navy"
                            style={{ fontSize: multi ? 38 : 50 }}
                          >
                            {e.title}
                          </div>
                          <div
                            className="font-semibold leading-tight text-gray-600"
                            style={{ fontSize: multi ? 29 : 37 }}
                          >
                            {e.locationName}
                          </div>
                          {e.address && (
                            <div
                              className="font-medium leading-tight text-gray-500"
                              style={{ fontSize: multi ? 25 : 31 }}
                            >
                              📍 {e.address}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* blue time chip */}
                  <div
                    className="absolute inset-y-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-white"
                    style={{
                      left: `${COL_BLUE.left}%`,
                      width: `${COL_BLUE.width}%`,
                    }}
                  >
                    {dayEvents.length === 0 ? (
                      <span style={{ fontSize: 26 }} className="text-white/70">
                        —
                      </span>
                    ) : (
                      dayEvents.map((e, i) => (
                        <span
                          key={e.id}
                          className={
                            "font-fredoka font-bold leading-tight " +
                            (i > 0 ? "border-t border-white/30 pt-1" : "")
                          }
                          style={{ fontSize: multi ? 30 : 38 }}
                        >
                          {formatTime(e.startTime).replace(":00", "")}–
                          {formatTime(e.endTime).replace(":00", "")}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
