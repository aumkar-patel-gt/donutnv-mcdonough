# DonutNV McDonough — Website Guide

A simple, mobile-friendly site for DonutNV McDonough. Customers see the weekly
schedule and last-minute announcements; your dad logs in with one password to
update everything — no coding, no design work.

---

## What's on the site

| Page | What it does |
|------|--------------|
| **Home** (`/`) | "Where are we today?" + alert banner + this week's stops |
| **Schedule** (`/schedule`) | Week & month calendar, every stop tagged Public/Private |
| **Book Us** (`/book`) | Event request form (saves to dashboard) |
| **Contact** (`/contact`) | Phone, email, Instagram, service area |
| **Owner Dashboard** (`/admin`) | Password-protected: add stops, post alerts, read bookings |

---

## Run it on your computer (preview)

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Out of the box it shows **sample data** so you can
see the design immediately. To save real data, connect Supabase below.

---

## Connect the database (free — ~15 min, one time)

1. Go to <https://supabase.com> → sign up (free) → **New project**.
2. In the project, open **SQL Editor → New query**, paste the contents of
   `supabase-schema.sql`, and click **Run**.
3. Open **Project Settings → API** and copy three values.
4. Copy `.env.local.example` to a new file named `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...          (Project URL)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...     (anon public key)
   SUPABASE_SERVICE_ROLE_KEY=...         (service_role key — keep secret!)
   ADMIN_PASSWORD=(ask the owner)             (change to anything you like)
   ```

5. Restart `npm run dev`. Real data now saves.

---

## The owner password (for your dad)

- He goes to **yoursite.com/admin**, types the password, and gets the dashboard.
- The password is whatever you set as `ADMIN_PASSWORD`.
- **If he forgets it:** he never has to "recover" anything — *you* just look it
  up. It's in `.env.local` locally, and in Vercel under
  **Settings → Environment Variables** once deployed. Change it there anytime
  and it updates instantly. Suggest something memorable like `donutnv2026`.

---

## Put it online (free — Vercel)

1. Push this folder to a GitHub repo.
2. Go to <https://vercel.com> → **Add New → Project** → import the repo.
3. Under **Environment Variables**, add the same 4 values from `.env.local`.
4. Click **Deploy**. You'll get a free `*.vercel.app` link; you can add a custom
   domain later (e.g. donutnvmcdonough.com).

---

## Things you may want to edit

- **Phone / email / Instagram / service area:** `src/lib/site.ts`
- **Brand colors:** `src/app/globals.css` (the `@theme` block)
- **Logos:** files in `public/brand/`
