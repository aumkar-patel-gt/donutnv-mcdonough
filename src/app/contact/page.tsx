import { site } from "@/lib/site";

export const metadata = { title: "Contact — DonutNV McDonough" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-dnv-navy sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-2 text-gray-600">
        Questions about a stop or want to say hi? Reach out any time.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ContactCard
          label="Call or Text"
          value={site.phone}
          href={site.phoneHref}
          icon="📞"
        />
        <ContactCard
          label="Email"
          value={site.email}
          href={`mailto:${site.email}`}
          icon="✉️"
        />
        <ContactCard
          label="Instagram"
          value={site.instagramHandle}
          href={site.instagram}
          icon="📸"
        />
        <ContactCard label="Service Area" value={site.serviceArea} icon="📍" />
      </div>

      <div className="mt-8 rounded-2xl bg-dnv-blue p-6 text-white">
        <h2 className="font-display text-xl font-extrabold">
          Want us at your event?
        </h2>
        <p className="mt-1 text-white/85">
          Head to the booking page and send us the details — we&apos;ll get
          right back to you.
        </p>
        <a
          href="/book"
          className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 font-bold text-dnv-blue hover:bg-dnv-cream"
        >
          Book a Truck →
        </a>
      </div>
    </section>
  );
}

function ContactCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-sm font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-dnv-navy">{value}</p>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}
