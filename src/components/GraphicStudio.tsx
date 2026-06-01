"use client";

import { useState } from "react";
import { ScheduleEvent } from "@/lib/types";
import { WeeklyGraphic } from "./WeeklyGraphic";
import { DailyGraphic } from "./DailyGraphic";

export function GraphicStudio({ events }: { events: ScheduleEvent[] }) {
  const [mode, setMode] = useState<"weekly" | "daily">("weekly");
  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setMode("weekly")}
            className={
              "rounded-full px-6 py-2.5 text-sm font-bold transition " +
              (mode === "weekly"
                ? "bg-dnv-blue text-white shadow"
                : "text-dnv-navy hover:text-dnv-blue")
            }
          >
            📅 Weekly Schedule
          </button>
          <button
            onClick={() => setMode("daily")}
            className={
              "rounded-full px-6 py-2.5 text-sm font-bold transition " +
              (mode === "daily"
                ? "bg-dnv-blue text-white shadow"
                : "text-dnv-navy hover:text-dnv-blue")
            }
          >
            📍 Daily Reminder
          </button>
        </div>
      </div>

      {mode === "weekly" ? (
        <WeeklyGraphic events={events} />
      ) : (
        <DailyGraphic events={events} />
      )}
    </div>
  );
}
