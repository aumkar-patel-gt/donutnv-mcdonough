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
  });
  const dayName = DAY_FULL[date.getDay()];

  async function download() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const imgs = Array.from(cardRef.current.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = res;
                img.onerror = res;
              })
        )
      );
      const opts = {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#0e6fd1",
      };
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
      {/* Day picker */}
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

      {/* Square 1080x1080 graphic, scaled to 420px on screen (0.3889) */}
      <div
        className="overflow-hidden rounded-xl shadow-2xl"
        style={{ width: 420, height: 420 }}
      >
        <div
          className="origin-top-left"
          style={{ transform: "scale(0.3889)", width: 1080, height: 1080 }}
        >
          <div
            ref={cardRef}
            style={{ width: 1080, height: 1080 }}
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

            <AwningStrip />

            {/* header */}
            <div className="relative px-16 pt-10 text-center text-white">
              <div className="mx-auto mb-5 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-badge.png"
                  alt="DonutNV"
                  width={140}
                  height={140}
                  className="h-[140px] w-[140px]"
                />
              </div>
              <p className="font-display text-[40px] font-extrabold uppercase tracking-wide text-white/90">
                {dayName}
              </p>
              <p className="font-display text-[34px] font-bold text-white/75">
                {dateLabel}
              </p>
            </div>

            {/* body */}
            <div className="relative flex flex-1 flex-col items-center justify-center px-14 text-center">
              {dayEvents.length === 0 ? (
                <div className="rounded-3xl bg-white/95 px-12 py-14">
                  <p className="font-display text-[60px] font-extrabold leading-tight text-dnv-navy">
                    No stops today
                  </p>
                  <p className="mt-3 text-[34px] font-bold text-dnv-red">
                    Check back soon! 🍩
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-display text-[64px] font-extrabold leading-none text-white drop-shadow">
                    FIND US AT
                  </p>
                  <div className="mt-6 w-full space-y-5">
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        className="rounded-3xl bg-white/95 px-10 py-8 shadow-lg"
                      >
                        <p className="font-display text-[52px] font-extrabold leading-tight text-dnv-navy">
                          {e.locationName}
                        </p>
                        <p className="mt-2 inline-block rounded-full bg-dnv-red px-7 py-2 font-display text-[40px] font-extrabold text-white">
                          {formatTime(e.startTime)} – {formatTime(e.endTime)}
                        </p>
                        {e.address && (
                          <p className="mt-4 text-[28px] font-semibold text-gray-600">
                            📍 {e.address}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* footer */}
            <div className="relative px-10 pb-5 pt-4 text-center text-white">
              <p className="font-display text-[34px] font-extrabold leading-tight">
                Hot Donuts • Fresh Lemonade
              </p>
              <p className="text-[26px] font-bold leading-tight text-white/85">
                @donutnvmcdonoughga
              </p>
            </div>
            <AwningStripBottom />
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
        A square daily reminder, perfect for an Instagram post or story.
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
