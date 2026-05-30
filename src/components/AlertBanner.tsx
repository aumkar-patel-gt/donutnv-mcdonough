import { Announcement } from "@/lib/types";

export function AlertBanner({ items }: { items: Announcement[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-px">
      {items.map((a) => (
        <div
          key={a.id}
          className={
            a.level === "alert"
              ? "bg-dnv-red text-white"
              : "bg-dnv-blue text-white"
          }
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 text-sm font-semibold sm:text-base">
            <span className="text-lg" aria-hidden>
              {a.level === "alert" ? "⚠️" : "📣"}
            </span>
            <p>{a.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
