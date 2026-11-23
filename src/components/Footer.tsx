import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { SHOWROOM_SETTINGS } from "@/data/settings";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#08090B] text-ink">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 border-b border-border pb-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-accent text-accent-ink">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                >
                  <path d="M4 17L9.5 7H13L7.5 17H4ZM11 17L16.5 7H20L14.5 17H11Z" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold uppercase tracking-widest text-ink">
                HAIDER CARS
              </span>
            </div>

            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-accent">
              &ldquo;Import Your Desired Vehicle Through Us&rdquo;
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Official digital showroom and custom Japanese vehicle import
              platform in DHA Phase 8, Lahore. Transparent auction-verified
              sourcing, ready stock, and curated pre-owned vehicles.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
              Navigation
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Showroom Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/import-a-car"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Custom Import Process
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted transition-colors hover:text-accent"
                >
                  Showroom &amp; Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Details Column */}
          <div className="md:col-span-4">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
              Showroom Details
            </div>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="leading-relaxed text-muted">
                  {SHOWROOM_SETTINGS.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-accent" />
                <span className="font-mono text-xs tabular-nums text-muted">
                  {SHOWROOM_SETTINGS.hours}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`https://wa.me/${SHOWROOM_SETTINGS.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-semibold tabular-nums text-ink hover:text-accent"
                >
                  +92 310 7777844
                </a>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={SHOWROOM_SETTINGS.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-[4px] border border-border bg-surface px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <span>Facebook</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href={SHOWROOM_SETTINGS.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-[4px] border border-border bg-surface px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <span>Instagram</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Haider Cars Lahore. All rights
            reserved.{" "}
            <span className="text-ink/80">
              Developed by{" "}
              <span className="font-semibold text-accent">ChishtyTech</span>
            </span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
            DHA Phase 8 • Ring Road Service Lane
          </p>
        </div>
      </div>
    </footer>
  );
}
