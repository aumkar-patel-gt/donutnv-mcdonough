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
          </nav>
        </div>
      )}
      <div className="awning" />
    </header>
  );
}
