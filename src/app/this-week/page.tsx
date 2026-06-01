import { getEvents } from "@/lib/data";
import { GraphicStudio } from "@/components/GraphicStudio";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instagram Graphics — DonutNV McDonough" };

export default async function ThisWeekPage() {
  const events = await getEvents();
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-center font-display text-3xl font-extrabold text-dnv-navy sm:text-4xl">
        Instagram Graphics
      </h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
        Built automatically from the stops in your dashboard. Post the{" "}
        <strong>weekly schedule</strong> at the start of the week, and a{" "}
        <strong>daily reminder</strong> each morning. Tap download — no Canva
        needed!
      </p>
      <div className="mt-8">
        <GraphicStudio events={events} />
      </div>
    </section>
  );
}
