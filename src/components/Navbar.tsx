"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { SHOWROOM_SETTINGS } from "@/data/settings";
import { MECHANICAL_EASE, ScrollProgressBar } from "@/components/MotionEffects";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/inventory" },
  { label: "Import a Car", href: "/import-a-car" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${SHOWROOM_SETTINGS.whatsapp_number}?text=${encodeURIComponent(
    "Assalam-o-Alaikum Haider Cars, I would like to inquire about a vehicle."
  )}`;

  return (
    <>
      <ScrollProgressBar />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          {/* Left: Reference-Style Emblem + Clean Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            {/* Electric Lime-Yellow Geometric Speed Mark (inspired by reference logo) */}
            <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-accent text-accent-ink transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M4 17L9.5 7H13L7.5 17H4ZM11 17L16.5 7H20L14.5 17H11Z" />
              </svg>
            </span>

            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold uppercase tracking-widest text-ink sm:text-lg">
                HAIDER CARS
              </span>
              <span className="mt-1 font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-muted">
                DHA PHASE 8 • LAHORE
              </span>
            </div>
          </Link>

          {/* Center: 4 links only */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative py-1 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-ink/80 hover:text-ink"
                  }`}
                >
                  <span className="relative inline-block overflow-hidden">
                    <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 inline-block translate-y-full text-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                    >
                      {item.label}
                    </span>
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      transition={{ duration: 0.45, ease: MECHANICAL_EASE }}
                      className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-accent"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Crisp White/Lime Pill CTA (matching Reference Header button) */}
          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-[4px] bg-ink px-4 py-2 font-mono text-xs font-semibold tabular-nums text-accent-ink transition-colors sm:inline-flex"
            >
              <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10">
                {SHOWROOM_SETTINGS.display_phone}
              </span>
              <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              type="button"
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-border bg-surface text-ink transition-colors hover:border-accent md:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Animated Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: MECHANICAL_EASE }}
              className="border-t border-border bg-surface px-4 py-4 md:hidden"
            >
              <nav className="flex flex-col divide-y divide-border">
                {NAV_LINKS.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between py-3 text-sm font-medium ${
                        isActive ? "text-accent" : "text-ink"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-xs text-accent">→</span>
                    </Link>
                  );
                })}
              </nav>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-[4px] bg-accent px-4 py-2.5 font-mono text-xs font-bold tabular-nums text-accent-ink"
              >
                <span>WhatsApp {SHOWROOM_SETTINGS.display_phone}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
