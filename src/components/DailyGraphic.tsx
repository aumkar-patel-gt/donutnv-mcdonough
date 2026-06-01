"use client";

import { useRef, useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { addDays, formatTime, toIso } from "@/lib/format";
import {
  AwningBottom,
  AwningTop,
  Deco,
  StripedBackground,
} from "./graphic/shared";

const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Canvas is 1080x1400 (portrait, close to the Canva design proportions).
const W = 1080;
const H = 1400;
const SCALE = 0.3889; // -> 420px wide on screen

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
            className="relative flex flex-col overflow-hidden bg-[#0b3f86]"
          >
            <StripedBackground />

            <AwningTop />

            {/* top decorations + logo */}
            <div className="relative">
              <Deco
                src="/brand/deco-donuts.png"
                alt=""
                className="absolute left-6 top-2 w-[230px]"
              />
              <Deco
                src="/brand/deco-mascot.png"
                alt=""
                className="absolute right-4 top-0 w-[240px]"
              />
              <div className="flex justify-center pt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-badge.png"
                  alt="DonutNV"
                  className="h-[150px] w-[150px] rounded-full bg-white shadow-lg"
                />
              </div>
            </div>

            {/* DAY + date */}
            <div className="relative mt-3 text-center text-white">
              <h1
                className="font-fredoka font-extrabold leading-none"
                style={{ fontSize: 92, textShadow: "0 4px 10px rgba(0,0,0,.35)" }}
              >
                {dayName}
              </h1>
              <p
                className="mt-3 font-fredoka font-bold text-white/90"
                style={{ fontSize: 44 }}
              >
                {dateLabel}
              </p>
            </div>

            {/* FIND US AT */}
            <div className="relative mt-6 text-center">
              <span
                className="font-fredoka font-extrabold text-white"
                style={{ fontSize: 66, textShadow: "0 4px 10px rgba(0,0,0,.35)" }}
              >
                – FIND US AT –
              </span>
            </div>

            {/* event card(s) */}
            <div className="relative mt-5 flex flex-1 flex-col justify-start px-12">
              <div className="rounded-[36px] bg-[#eceef0] px-10 py-8 shadow-xl">
                {dayEvents.length === 0 ? (
                  <div className="py-8 text-center">
                    <p
                      className="font-fredoka font-extrabold text-dnv-navy"
                      style={{ fontSize: 56 }}
                    >
                      No stops today
                    </p>
                    <p
                      className="mt-2 font-bold text-dnv-red"
                      style={{ fontSize: 34 }}
                    >
                      Check back soon! 🍩
                    </p>
                  </div>
                ) : (
                  <div className="space-y-7">
                    {dayEvents.map((e, i) => (
                      <div
                        key={e.id}
                        className={
                          "text-center " +
                          (i > 0 ? "border-t-2 border-gray-300 pt-7" : "")
                        }
                      >
                        <p
                          className="font-fredoka font-extrabold leading-tight text-dnv-navy"
                          style={{ fontSize: 50 }}
                        >
                          {e.title}
                        </p>
                        <div className="my-3 flex justify-center">
                          <span
                            className="rounded-full bg-dnv-red px-9 py-2 font-fredoka font-extrabold text-white"
                            style={{ fontSize: 42 }}
                          >
                            {formatTime(e.startTime)} – {formatTime(e.endTime)}
                          </span>
                        </div>
                        <p
                          className="font-semibold text-gray-500"
                          style={{ fontSize: 30 }}
                        >
                          {e.address || e.locationName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* bottom decorations */}
            <div className="relative h-[230px]">
              <Deco
                src="/brand/deco-lemonade.png"
                alt=""
                className="absolute bottom-2 left-8 w-[170px]"
              />
              <Deco
                src="/brand/deco-truck.png"
                alt=""
                className="absolute bottom-2 left-1/2 w-[330px] -translate-x-1/2"
              />
              <Deco
                src="/brand/deco-bucket.png"
                alt=""
                className="absolute bottom-2 right-8 w-[210px]"
              />
            </div>

            {/* contact */}
            <div className="relative pb-3 text-center text-white">
              <p
                className="font-fredoka font-extrabold leading-tight"
                style={{ fontSize: 40 }}
              >
                MCDONOUGHGA@DONUTNV.COM
              </p>
              <p
                className="font-fredoka font-extrabold leading-tight"
                style={{ fontSize: 40 }}
              >
                (678) 780-4090
              </p>
            </div>

            <AwningBottom height={50} />
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
