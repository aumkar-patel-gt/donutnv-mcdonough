import { ScheduleEvent } from "@/lib/types";
import { formatTimeRange } from "@/lib/format";

export function VisibilityBadge({ v }: { v: ScheduleEvent["visibility"] }) {
  const isPublic = v === "public";
  return (
    <span
      className={
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide " +
        (isPublic
          ? "bg-dnv-blue/10 text-dnv-blue"
          : "bg-dnv-red/10 text-dnv-red")
      }
    >
      {isPublic ? "Public" : "Private"}
    </span>
  );
}

export function EventCard({ event }: { event: ScheduleEvent }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.address
  )}`;
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-dnv-navy">
          {event.title}
        </h3>
        <VisibilityBadge v={event.visibility} />
      </div>
      <p className="mt-1 font-semibold text-dnv-blue">{formatTimeRange(event)}</p>
      <p className="mt-1 text-sm text-gray-700">{event.locationName}</p>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-sm text-gray-500 underline-offset-2 hover:text-dnv-red hover:underline"
      >
        {event.address}
      </a>
      {event.notes && (
        <p className="mt-2 rounded-lg bg-dnv-cream px-3 py-2 text-sm text-dnv-navy">
          {event.notes}
        </p>
      )}
    </div>
  );
}
