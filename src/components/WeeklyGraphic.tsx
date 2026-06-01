"use client";

import { useRef, useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { addDays, formatTime, startOfWeek, toIso } from "@/lib/format";
import {
  AwningBottom,
  AwningTop,
  Deco,
  StripedBackground,
} from "./graphic/shared";

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Portrait canvas matching the Canva weekly design.
const W = 1080;
const H = 1400;
const SCALE = 0.3889;

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
            className="relative flex flex-col overflow-hidden bg-[#0b3f86]"
          >
            <StripedBackground />
            <AwningTop />

            {/* header: donuts | logo+THIS WEEK | mascot */}
            <div className="relative flex items-center justify-center px-4 pt-3">
              <Deco
                src="/brand/deco-donuts.png"
                alt=""
                className="absolute left-6 top-0 w-[200px]"
              />
              <Deco
                src="/brand/deco-mascot.png"
                alt=""
                className="absolute right-4 top-0 w-[210px]"
              />
              <div className="flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-badge.png"
                  alt="DonutNV"
                  className="h-[120px] w-[120px] rounded-full bg-white shadow-lg"
                />
                <h1
                  className="font-fredoka font-extrabold text-white"
                  style={{ fontSize: 80, textShadow: "0 4px 10px rgba(0,0,0,.35)" }}
                >
                  THIS WEEK
                </h1>
              </div>
            </div>

            {/* rows */}
            <div className="relative mt-2 flex flex-1 flex-col justify-center gap-3 px-8 pb-2">
              {days.map((d) => {
                const iso = toIso(d);
                const dayEvents = byDate.get(iso) ?? [];
                const dateNum = d.toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                });
                return (
                  <div key={iso} className="flex items-stretch gap-3">
                    {/* day chip */}
                    <div
                      className="flex w-[150px] flex-col items-center justify-center rounded-2xl bg-dnv-red px-2 py-2 text-center text-white"
                      style={{ minHeight: 96 }}
                    >
                      <span
                        className="font-fredoka font-extrabold leading-none"
                        style={{ fontSize: 30 }}
                      >
                        {DAY_ABBR[d.getDay()]}
                      </span>
                      <span
                        className="mt-1 font-bold leading-none"
                        style={{ fontSize: 24 }}
                      >
                        {dateNum}
                      </span>
                    </div>

                    {/* event card */}
                    <div className="flex flex-1 flex-col justify-center rounded-2xl bg-[#eceef0] px-6 py-3">
                      {dayEvents.length === 0 ? (
                        <span
                          className="font-semibold text-gray-400"
                          style={{ fontSize: 26 }}
                        >
                          — No stops —
                        </span>
                      ) : (
                        dayEvents.map((e, i) => (
                          <div
                            key={e.id}
                            className={i > 0 ? "mt-2 border-t border-gray-300 pt-2" : ""}
                          >
                            <span
                              className="font-fredoka font-extrabold leading-tight text-dnv-navy"
                              style={{ fontSize: 30 }}
                            >
                              {e.title}
                            </span>
                            <div
                              className="font-semibold leading-tight text-gray-500"
                              style={{ fontSize: 24 }}
                            >
                              {e.locationName}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* time chip */}
                    <div
                      className="flex w-[200px] flex-col items-center justify-center gap-1 rounded-2xl bg-[#06294f] px-2 py-2 text-center text-white"
                      style={{ minHeight: 96 }}
                    >
                      {dayEvents.length === 0 ? (
                        <span style={{ fontSize: 22 }} className="text-white/60">
                          —
                        </span>
                      ) : (
                        dayEvents.map((e, i) => (
                          <span
                            key={e.id}
                            className={
                              "font-fredoka font-extrabold leading-tight " +
                              (i > 0 ? "border-t border-white/30 pt-1" : "")
                            }
                            style={{ fontSize: 25 }}
                          >
                            {formatTime(e.startTime)}–{formatTime(e.endTime)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <AwningBottom height={60} />
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
