"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Incorrect password. Try again.");
    }
  }

  return (
    <section className="mx-auto flex max-w-sm flex-col items-center px-4 py-16">
      <Image
        src="/brand/logo-badge.png"
        alt="DonutNV"
        width={72}
        height={72}
      />
      <h1 className="mt-4 font-display text-2xl font-extrabold text-dnv-navy">
        Owner Login
      </h1>
      <p className="mt-1 text-center text-sm text-gray-500">
        Enter the password to manage the schedule and announcements.
      </p>
      <form onSubmit={submit} className="mt-6 w-full space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center focus:border-dnv-blue focus:outline-none focus:ring-2 focus:ring-dnv-blue/30"
        />
        {error && (
          <p className="text-center text-sm font-semibold text-dnv-red">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-dnv-red px-6 py-3 font-bold text-white hover:bg-dnv-red-dark disabled:opacity-60"
        >
          {loading ? "Checking…" : "Log In"}
        </button>
      </form>
    </section>
  );
}
