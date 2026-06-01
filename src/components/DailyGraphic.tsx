"use client";

import { useRef, useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { addDays, formatTime, toIso } from "@/lib/format";

const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Canvas matches the daily template aspect (portrait ~8.5x11).
const W = 1545;
const H = 2000;
const SCALE = 420 / W;

/* --- Layout config (% of card). Nudge if text doesn't align. --- */
const DAY_TOP = 8.5; // DAY name centered here (over the logo area? no—just below logo)
const FIND_BOX = { top: 44, bottom: 64 }; // the gray "FIND US AT" content box
const RED_PILL = { top: 50, height: 6.5 }; // the red time pill inside the box

export function DailyGraphic({ events }: { events: ScheduleEvent[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dayOffset, setDayOffset] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const date = addDays(new Date(), dayOffset);
  const iso = toIso(date);
  const dayEvents = events.filter((e) => e.date === iso);

  const dateLabel = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dayName = DAY_FULL[date.getDay()].toUpperCase();
  const single = dayEvents.length <= 1;

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
      link.download = `donutnv-daily-${iso}.png`;
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
          onClick={() => setDayOffset((d) => d - 1)}
          className="h-10 w-10 rounded-full bg-gray-100 text-lg font-bold text-dnv-navy hover:bg-dnv-blue hover:text-white"
        >
          ‹
        </button>
        <button
          onClick={() => setDayOffset(0)}
          className="rounded-full px-4 py-2 text-sm font-bold text-dnv-blue hover:bg-dnv-blue/10"
        >
          Today
        </button>
        <button
          onClick={() => setDayOffset((d) => d + 1)}
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
              src="/brand/template-daily.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* DAY + date, centered between the logo and "FIND US AT" */}
            <div
              className="absolute left-0 right-0 text-center text-white"
              style={{ top: `${DAY_TOP + 15.5}%` }}
            >
              <div
                className="font-fredoka font-bold leading-none"
                style={{ fontSize: 100, textShadow: "0 4px 10px rgba(0,0,0,.35)" }}
              >
                {dayName}
              </div>
              <div
                className="mt-3 font-fredoka font-medium text-white/90"
                style={{ fontSize: 48 }}
              >
                {dateLabel}
              </div>
            </div>

            {/* Content inside the gray FIND US AT box */}
            {single ? (
              <>
                {/* event name — above the red pill */}
                <div
                  className="absolute left-0 right-0 px-16 text-center"
                  style={{ top: `${RED_PILL.top - 7}%` }}
                >
                  <span
                    className="font-fredoka font-bold leading-tight text-dnv-navy"
                    style={{ fontSize: 60 }}
                  >
                    {dayEvents[0]?.title ?? "No stops today"}
                  </span>
                </div>

                {/* time — inside the red pill */}
                <div
                  className="absolute left-0 right-0 flex items-center justify-center text-center"
                  style={{ top: `${RED_PILL.top}%`, height: `${RED_PILL.height}%` }}
                >
                  <span
                    className="font-fredoka font-bold leading-none text-white"
                    style={{ fontSize: 58 }}
                  >
                    {dayEvents[0]
                      ? `${formatTime(dayEvents[0].startTime)} – ${formatTime(
                          dayEvents[0].endTime
                        )}`
                      : "Check back soon!"}
                  </span>
                </div>

                {/* location — below the red pill */}
                <div
                  className="absolute left-0 right-0 px-20 text-center"
                  style={{ top: `${RED_PILL.top + RED_PILL.height + 2.5}%` }}
                >
                  <span
                    className="font-semibold text-gray-600"
                    style={{ fontSize: 34 }}
                  >
                    {dayEvents[0]?.address || dayEvents[0]?.locationName || ""}
                  </span>
                </div>
              </>
            ) : (
              /* 2+ events: stack compact cards centered in the box */
              <div
                className="absolute left-0 right-0 flex flex-col justify-center gap-4 px-24"
                style={{
                  top: `${FIND_BOX.top}%`,
                  height: `${FIND_BOX.bottom - FIND_BOX.top}%`,
                }}
              >
                {dayEvents.map((e, i) => (
                  <div
                    key={e.id}
                    className={
                      "text-center " +
                      (i > 0 ? "border-t-2 border-gray-300 pt-3" : "")
                    }
                  >
                    <div
                      className="font-fredoka font-bold leading-tight text-dnv-navy"
                      style={{ fontSize: 38 }}
                    >
                      {e.title}
                    </div>
                    <div className="my-1 flex justify-center">
                      <span
                        className="rounded-full bg-dnv-red px-6 py-1 font-fredoka font-bold text-white"
                        style={{ fontSize: 30 }}
                      >
                        {formatTime(e.startTime)} – {formatTime(e.endTime)}
                      </span>
                    </div>
                    <div
                      className="font-semibold leading-tight text-gray-500"
                      style={{ fontSize: 24 }}
                    >
                      {e.address || e.locationName}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        {downloading ? "Preparing image…" : "Download today's graphic"}
      </button>
      <p className="mt-3 max-w-sm text-center text-sm text-gray-500">
        A daily reminder post — pick the day, download, and post to Instagram.
      </p>
    </div>
  );
}
