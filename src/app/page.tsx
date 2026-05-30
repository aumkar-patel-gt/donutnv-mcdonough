import Link from "next/link";
import Image from "next/image";
import { getActiveAnnouncements, getEvents } from "@/lib/data";
import { AlertBanner } from "@/components/AlertBanner";
import { EventCard } from "@/components/EventCard";
import { site } from "@/lib/site";
import {
  formatDateLong,
  formatTimeRange,
  todayIso,
  toIso,
  startOfWeek,
  addDays,
  parseLocalDate,
} from "@/lib/format";

export const revalidate = 60;

export default async function HomePage() {
  const [events, announcements] = await Promise.all([
    getEvents(),
    getActiveAnnouncements(),
  ]);

  const today = todayIso();
  const todayEvents = events.filter((e) => e.date === today);

  // Upcoming this week (next 7 days, today included)
  const weekStart = startOfWeek(new Date());
  const weekEnd = addDays(weekStart, 6);
  const weekEvents = events.filter((e) => {
    const d = parseLocalDate(e.date);
    return d >= parseLocalDate(toIso(weekStart)) && d <= parseLocalDate(toIso(weekEnd));
  });

  return (
    <>
      {/* Wordmark band under the awning */}
      <div className="bg-white pt-5 text-center">
        <Image
          src="/brand/wordmark-web.jpg"
          alt="DonutNV"
          width={1200}
          height={300}
          priority
          className="mx-auto h-12 w-auto sm:h-16"
        />
      </div>

      {/* Announcements appear just under the logo */}
      <div className="bg-white pt-4">
        <AlertBanner items={announcements} />
      </div>

      {/* HERO: Where are we today */}
      <section className="relative overflow-hidden bg-gradient-to-b from-dnv-blue to-dnv-blue-dark text-white">
        {/* subtle polka-dot texture */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 2px, transparent 2.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-white/80">
            {site.tagline}
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            Where are we today?
          </h1>
          <p className="mt-2 text-white/80">{formatDateLong(today)}</p>

          <div className="mx-auto mt-6 max-w-xl space-y-3">
            {todayEvents.length === 0 ? (
              <div className="rounded-2xl bg-white/95 p-6 text-dnv-navy shadow-lg">
                <p className="font-display text-xl font-bold">
                  No public stops scheduled today
                </p>
                <p className="mt-1 text-gray-600">
                  Check the full schedule for upcoming dates!
                </p>
              </div>
            ) : (
              todayEvents.map((e) => (
                <div
                  key={e.id}
                  className="rounded-2xl bg-white p-5 text-left text-dnv-navy shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-extrabold">
                      {e.title}
                    </span>
                    <span
                      className={
                        "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase " +
                        (e.visibility === "public"
                          ? "bg-dnv-blue/10 text-dnv-blue"
                          : "bg-dnv-red/10 text-dnv-red")
                      }
                    >
                      {e.visibility}
                    </span>
                  </div>
                  <p className="mt-1 font-bold text-dnv-red">
                    {formatTimeRange(e)}
                  </p>
                  <p className="text-gray-700">{e.locationName}</p>
                  <p className="text-sm text-gray-500">{e.address}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/schedule"
              className="rounded-full bg-white px-6 py-3 font-bold text-dnv-blue shadow transition hover:bg-dnv-cream"
            >
              See Full Schedule
            </Link>
            <Link
              href="/book"
              className="rounded-full bg-dnv-red px-6 py-3 font-bold text-white shadow transition hover:bg-dnv-red-dark"
            >
              Book Us for an Event
            </Link>
          </div>
        </div>
        <svg
          className="block h-[70px] w-full"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#ffffff"
            d="M0,40 C240,75 480,75 720,48 C960,21 1200,21 1440,40 L1440,70 L0,70 Z"
          />
        </svg>
      </section>

      {/* THIS WEEK */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-extrabold text-dnv-navy sm:text-3xl">
            This Week
          </h2>
          <Link
            href="/schedule"
            className="font-semibold text-dnv-blue hover:text-dnv-red"
          >
            View all →
          </Link>
        </div>

        {weekEvents.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-dnv-cream p-6 text-dnv-navy">
            No stops posted for this week yet — check back soon!
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weekEvents.map((e) => (
              <div key={e.id}>
                <p className="mb-1 text-sm font-bold uppercase tracking-wide text-gray-400">
                  {formatDateLong(e.date)}
                </p>
                <EventCard event={e} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section className="-mb-16 bg-dnv-red">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 pb-6 pt-10 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-extrabold">
              {site.slogan}
            </h2>
            <p className="text-white/85">
              Hot mini donuts & fresh-squeezed lemonade for your next event.
            </p>
          </div>
          <Link
            href="/book"
            className="rounded-full bg-white px-6 py-3 font-bold text-dnv-red shadow transition hover:bg-dnv-cream"
          >
            Request a Booking
          </Link>
        </div>
        {/* wave flowing red into the navy footer */}
        <svg
          className="block h-[70px] w-full"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0b2a4a"
            d="M0,40 C240,75 480,75 720,48 C960,21 1200,21 1440,40 L1440,70 L0,70 Z"
          />
        </svg>
      </section>
    </>
  );
}
