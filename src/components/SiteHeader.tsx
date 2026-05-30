"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/book", label: "Book Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo-badge.png"
            alt="DonutNV"
            width={48}
            height={48}
            className="h-12 w-12"
            priority
          />
          <span className="font-display text-xl font-extrabold leading-none text-dnv-navy">
            DonutNV
            <span className="block text-xs font-bold text-dnv-red">
              McDonough
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 font-semibold text-dnv-navy transition hover:bg-dnv-blue/10 hover:text-dnv-blue"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="ml-2 rounded-full bg-dnv-red px-5 py-2 font-bold text-white shadow transition hover:bg-dnv-red-dark"
          >
            Book a Truck
          </Link>
          <Link
            href="/admin"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border-2 border-dnv-blue px-4 py-2 font-bold text-dnv-blue transition hover:bg-dnv-blue hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 15a2 2 0 100-4 2 2 0 000 4zm6-6V8a6 6 0 10-12 0v1a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3zM8 8a4 4 0 118 0v1H8V8z"
                fill="currentColor"
              />
            </svg>
            Owner Login
          </Link>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg bg-dnv-blue p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-semibold text-dnv-navy hover:bg-dnv-blue/10"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center gap-2 rounded-lg bg-dnv-blue px-3 py-3 font-bold text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 15a2 2 0 100-4 2 2 0 000 4zm6-6V8a6 6 0 10-12 0v1a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3zM8 8a4 4 0 118 0v1H8V8z"
                  fill="currentColor"
                />
              </svg>
              Owner Login
            </Link>
          </nav>
        </div>
      )}
      <div className="awning" />
    </header>
  );
}
