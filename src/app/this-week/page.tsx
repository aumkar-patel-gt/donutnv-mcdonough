import { getEvents } from "@/lib/data";
import { WeeklyGraphic } from "@/components/WeeklyGraphic";

export const dynamic = "force-dynamic";
export const metadata = { title: "Weekly Schedule Graphic — DonutNV McDonough" };

export default async function ThisWeekPage() {
  const events = await getEvents();
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-center font-display text-3xl font-extrabold text-dnv-navy sm:text-4xl">
        Weekly Schedule Graphic
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
        This image is built automatically from the stops in your dashboard.
        Pick the week, tap download, and post it to Instagram — no Canva needed!
      </p>
      <div className="mt-8">
        <WeeklyGraphic events={events} />
      </div>
    </section>
  );
}
