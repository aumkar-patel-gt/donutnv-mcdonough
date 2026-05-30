import { getEvents } from "@/lib/data";
import { ScheduleViews } from "@/components/ScheduleViews";

export const revalidate = 60;

export default async function SchedulePage() {
  const events = await getEvents();
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-dnv-navy sm:text-4xl">
        Our Schedule
      </h1>
      <p className="mt-2 text-gray-600">
        Find out where the DonutNV truck will be. Public stops are open to
        everyone — come say hi!
      </p>
      <div className="mt-8">
        <ScheduleViews events={events} />
      </div>
    </section>
  );
}
