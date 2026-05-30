import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-dnv-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-extrabold">{site.name}</h3>
          <p className="mt-2 text-sm text-white/70">{site.tagline}</p>
          <p className="mt-1 text-sm text-white/70">{site.slogan}</p>
        </div>
        <div>
          <h4 className="font-bold">Quick Links</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/80">
            <li><Link href="/schedule" className="hover:text-dnv-red">Schedule</Link></li>
            <li><Link href="/book" className="hover:text-dnv-red">Book Us</Link></li>
            <li><Link href="/contact" className="hover:text-dnv-red">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Get in Touch</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/80">
            <li><a href={site.phoneHref} className="hover:text-dnv-red">{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-dnv-red">{site.email}</a></li>
            <li><a href={site.instagram} className="hover:text-dnv-red">{site.instagramHandle}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. An independently owned DonutNV
        franchise.
        <span className="px-1">·</span>
        <Link href="/admin" className="text-white/50 hover:text-dnv-red">
          Owner Login
        </Link>
      </div>
    </footer>
  );
}
