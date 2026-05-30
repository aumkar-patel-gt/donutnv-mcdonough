"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const eventTypes = [
  "Birthday Party",
  "Wedding",
  "Corporate Event",
  "School / Church",
  "Fundraiser",
  "Other",
];

export default function BookPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong.");
      }
      setStatus("ok");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="text-5xl">🍩</div>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-dnv-navy">
          Request received!
        </h1>
        <p className="mt-2 text-gray-600">
          Thanks! We&apos;ll reach out soon to make your event sweet. For
          anything urgent, call us at{" "}
          <a href={site.phoneHref} className="font-bold text-dnv-blue">
            {site.phone}
          </a>
          .
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full bg-dnv-blue px-6 py-3 font-bold text-white hover:bg-dnv-blue-dark"
        >
          Send another request
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-dnv-navy sm:text-4xl">
        Book a Truck
      </h1>
      <p className="mt-2 text-gray-600">
        Tell us about your event and we&apos;ll get back to you with
        availability and pricing.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field label="Your Name" name="name" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" type="tel" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Event Date" name="eventDate" type="date" required />
          <div>
            <label className="block text-sm font-bold text-dnv-navy">
              Event Type
            </label>
            <select
              name="eventType"
              required
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-dnv-blue focus:outline-none focus:ring-2 focus:ring-dnv-blue/30"
            >
              {eventTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-dnv-navy">
            Tell us more
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder="Location, headcount, time, anything else…"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-dnv-blue focus:outline-none focus:ring-2 focus:ring-dnv-blue/30"
          />
        </div>

        {status === "error" && (
          <p className="rounded-lg bg-dnv-red/10 px-4 py-3 text-sm font-semibold text-dnv-red">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-dnv-red px-6 py-4 font-bold text-white shadow transition hover:bg-dnv-red-dark disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Booking Request"}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-dnv-navy">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-dnv-blue focus:outline-none focus:ring-2 focus:ring-dnv-blue/30"
      />
    </div>
  );
}
