"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Ship,
  Sparkles,
} from "lucide-react";
import { Vehicle } from "@/types/database";
import { SHOWROOM_SETTINGS } from "@/data/settings";
import { QuickFilterBar } from "@/components/QuickFilterBar";
import { VehicleCard } from "@/components/VehicleCard";
import {
  AnimatedCounter,
  ImportStageGraphic,
  MECHANICAL_EASE,
  RevealOnScroll,
} from "@/components/MotionEffects";
import { formatEngineCC, formatMileage, formatPKR } from "@/lib/format";
import { getStoredVehicles } from "@/lib/adminStore";

const HERO_BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85",
];

const IMPORT_STEPS = [
  {
    step: "01",
    title: "Selection & Japan Auction Bidding",
    description:
      "Share your target model, year, and budget. We shortlist verified Grade 4.0–5.0 vehicles from USS and TAA auctions with authentic inspection sheets.",
    duration: "DAYS 01–07",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Export & Sea Freight",
    description:
      "Once your bid succeeds, we handle Japanese export deregistration, radiation inspection, and Ro-Ro sea freight with full shipment tracking.",
    duration: "WEEKS 02–05",
    icon: Ship,
  },
  {
    step: "03",
    title: "Karachi Port Customs Clearance",
    description:
      "Our clearing desk manages port documentation, duty assessment, and carrier dispatch from Karachi to Lahore with zero hidden markups.",
    duration: "WEEK 06",
    icon: FileCheck,
  },
  {
    step: "04",
    title: "Handover at DHA Phase 8 Lahore",
    description:
      "Your vehicle undergoes final mechanical & detailing inspection at our Ring Road showroom before keys and auction papers are handed over.",
    duration: "WEEK 07",
    icon: CheckCircle2,
  },
];

export function HomeClient({
  featuredVehicles: initialFeatured,
}: {
  featuredVehicles: Vehicle[];
}) {
  const [featuredVehicles, setFeaturedVehicles] =
    useState<Vehicle[]>(initialFeatured);

  useEffect(() => {
    const sync = () => {
      const stored = getStoredVehicles().filter((v) => v.is_featured).slice(0, 6);
      if (stored.length > 0) {
        setFeaturedVehicles(stored);
      }
    };
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "in_showroom" | "in_transit"
  >("all");
  const [activeImportStep, setActiveImportStep] = useState(0);

  // Automatically loop through the 4 fixed hero background images every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const activeHeroBg = HERO_BACKGROUND_IMAGES[activeHeroIdx];
  const activeHeroCar = featuredVehicles[0] || initialFeatured[0];

  const visibleFeatured = featuredVehicles.filter((v) =>
    featuredFilter === "all" ? true : v.status === featuredFilter
  );

  return (
    <div className="bg-canvas text-ink">
      {/* =====================================================================
          1. HERO: Fixed Showroom Vehicle Background Behind Main Heading Box
         ===================================================================== */}
      <section
        style={{
          backgroundImage: `url(${activeHeroBg})`,
        }}
        className="relative overflow-hidden border-b border-white/15 bg-cover bg-fixed bg-center transition-[background-image] duration-500"
      >
        {/* Dark Architectural Gradient Overlay for Crisp Contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0C0E]/80 via-[#151412]/70 to-[#0B0C0E]/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B0C0E]/85 via-[#0B0C0E]/45 to-transparent" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 pt-10 pb-0 sm:px-8 sm:pt-14 sm:pb-0">
          {/* Upper Hero Overlay Grid (Headline Left + Floating Next-Bay Card Right) */}
          <div className="relative z-20 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left Editorial Headline */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: MECHANICAL_EASE }}
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink/90"
              >
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>HAIDER CARS • DHA PHASE 8 LAHORE</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.08,
                  ease: MECHANICAL_EASE,
                }}
                className="mt-4 font-display text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-white sm:text-5xl lg:text-[60px]"
              >
                Import Your Desired Vehicle{" "}
                <span className="text-accent">Through Us.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.16,
                  ease: MECHANICAL_EASE,
                }}
                className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base"
              >
                Direct Japanese USS &amp; TAA auction sourcing with verified
                inspection sheets, ready-stock imported vehicles, and curated
                pre-owned cars at our Ring Road showroom in DHA Phase 8.
              </motion.p>

              {/* Hero CTAs with Reference Electric Lime-Yellow Pill + Square Icon */}
              <RevealOnScroll delay={0.22}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/import-a-car"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[4px] bg-accent px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-accent-ink"
                  >
                    <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                    <span className="relative z-10">Request Custom Import</span>
                    <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>

                  <Link
                    href="/inventory"
                    className="group inline-flex items-center gap-2.5 rounded-[4px] border border-white/25 bg-black/35 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
                  >
                    <span>Browse Showroom Stock</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-10">
            <QuickFilterBar />
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. "OUR REPUTATION, BACKED BY DATA" (Reference Dark Obsidian Section)
         ===================================================================== */}
      <section className="border-b border-border bg-canvas pt-6 pb-12 sm:pt-6 sm:pb-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left Manifesto Column */}
            <RevealOnScroll className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-[4px] bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-accent-ink">
                <span>HAIDER CARS STANDARD</span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                Every Japanese import and showroom vehicle we deliver in Lahore
                is backed by verifiable USS/TAA auction grading, true chassis
                mileage, and transparent customs documentation.
              </p>
              <div className="mt-6 border-l-2 border-accent pl-4">
                <div className="font-display text-sm font-semibold text-ink">
                  DHA Phase 8 Showroom Guarantee
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-muted">
                  Ring Road Service Lane • Lahore, Pakistan
                </div>
              </div>
            </RevealOnScroll>

            {/* Right Bold Heading + Lime-Yellow Pill CTA */}
            <RevealOnScroll delay={0.12} className="lg:col-span-7">
              <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                01 • VERIFIED IMPORT AUTHORITY
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">
                Our Reputation, Backed by Data.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                From live bidding on Japanese auction lanes to port clearance in
                Karachi and final handover at our DHA Phase 8 showroom, we
                eliminate guesswork with hard numbers and original paperwork.
              </p>

              <div className="mt-7">
                <Link
                  href="/import-a-car"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[4px] bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink"
                >
                  <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative z-10">
                    Start Your Custom Import
                  </span>
                  <ArrowUpRight className="relative z-10 h-4 w-4" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* 4-Column Giant Data Counters (Exact Reference Layout) */}
          <div className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-10 lg:grid-cols-4">
            <RevealOnScroll delay={0.1}>
              <div className="font-display text-4xl font-bold tabular-nums text-ink sm:text-5xl">
                <AnimatedCounter target={100} suffix="%" />
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                Original Auction Sheets
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.18}>
              <div className="font-display text-4xl font-bold tabular-nums text-ink sm:text-5xl">
                <AnimatedCounter target={99} suffix="%" />
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                Client Satisfaction Rate
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.26}>
              <div className="font-display text-4xl font-bold tabular-nums text-ink sm:text-5xl">
                <AnimatedCounter target={210} suffix="+" />
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                Japanese Imports Delivered
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.34}>
              <div className="font-display text-4xl font-bold tabular-nums text-accent sm:text-5xl">
                4.0–<AnimatedCounter target={5.0} decimals={1} />
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
                Verified Auction Grade Standard
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. "TAILORED FOR STYLE, SPEED & SOPHISTICATION" — Featured Grid
         ===================================================================== */}
      <section className="border-b border-border bg-[#0E1014] py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          {/* Reference Split Header */}
          <div className="grid grid-cols-1 items-end gap-8 border-b border-border pb-8 lg:grid-cols-12">
            <RevealOnScroll className="lg:col-span-5">
              <p className="max-w-md text-sm leading-relaxed text-muted">
                Explore our handpicked collection of Grade 4.5–5.0 Japanese
                hybrids, SUVs, and showroom-certified vehicles ready for
                inspection in DHA Phase 8 or arriving in transit.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: "all", label: "All Featured" },
                    { id: "in_showroom", label: "In Showroom" },
                    { id: "in_transit", label: "In Transit" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFeaturedFilter(tab.id)}
                    className={`relative rounded-[4px] px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      featuredFilter === tab.id
                        ? "text-accent-ink"
                        : "border border-border bg-surface text-muted hover:text-ink"
                    }`}
                  >
                    {featuredFilter === tab.id && (
                      <motion.span
                        layoutId="featured-filter-pill"
                        transition={{ duration: 0.4, ease: MECHANICAL_EASE }}
                        className="absolute inset-0 rounded-[4px] bg-accent"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              delay={0.1}
              className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end lg:col-span-7"
            >
              <div>
                <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  02 • SHOWROOM FLEET
                </div>
                <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
                  Tailored for Style, Hybrid Efficiency &amp; Prestige.
                </h2>
              </div>

              <Link
                href="/inventory"
                className="group inline-flex shrink-0 items-center gap-2 rounded-[4px] border border-border bg-surface px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <span>Full Catalog</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </RevealOnScroll>
          </div>

          {/* 3-Column Dark Luxury Vehicle Grid */}
          <motion.div
            layout
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visibleFeatured.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          4. REFERENCE MID-PAGE SPOTLIGHT BANNER ("Your Journey Begins Into
             the Spotlight" + Full-Width Electric Lime-Yellow Action Bar)
         ===================================================================== */}
      <section className="spotlight-slate-studio relative overflow-hidden border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <RevealOnScroll className="lg:col-span-6">
              <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                SHOWROOM SPOTLIGHT EDITION
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
                Your Import Journey Begins Into the Spotlight.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
                Inspect our flagship {activeHeroCar.title} with verified Grade{" "}
                {activeHeroCar.auction_grade || "4.5"} Japanese auction
                sheet, or commission a bespoke import matched to your exact trim
                and color specification.
              </p>
            </RevealOnScroll>

            {/* Right Telemetry Spec Table (Matching Reference Top-Right of Spotlight Banner) */}
            <RevealOnScroll delay={0.12} className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4 rounded-[4px] border border-white/15 bg-black/35 p-5 backdrop-blur-md sm:grid-cols-4">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-white/60">
                    Model Year
                  </span>
                  <span className="mt-1 block font-mono text-lg font-bold tabular-nums text-white">
                    {activeHeroCar.year}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-white/60">
                    Engine
                  </span>
                  <span className="mt-1 block font-mono text-lg font-bold tabular-nums text-white">
                    {formatEngineCC(activeHeroCar.engine_cc)}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-white/60">
                    Mileage
                  </span>
                  <span className="mt-1 block font-mono text-lg font-bold tabular-nums text-white">
                    {formatMileage(activeHeroCar.mileage_km)}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-white/60">
                    Auction Grade
                  </span>
                  <span className="mt-1 block font-mono text-lg font-bold tabular-nums text-accent">
                    GRADE {activeHeroCar.auction_grade || "4.5"}
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Wide Dramatic Profile Image + Full-Width Electric Lime-Yellow CTA Bar */}
          <RevealOnScroll delay={0.18} className="mt-8">
            <div className="overflow-hidden rounded-[4px] border border-white/20 bg-[#0B0C0E]">
              <div className="relative aspect-[21/8] min-h-[220px] w-full overflow-hidden">
                <img
                  src={activeHeroCar.images[1] || activeHeroCar.images[0]}
                  alt={activeHeroCar.title}
                  className="h-full w-full object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-black/30" />
              </div>

              {/* Signature Reference Full-Width Electric Lime-Yellow Bar */}
              <Link
                href={`/inventory/${activeHeroCar.slug}`}
                className="group flex w-full items-center justify-between bg-accent px-6 py-4 text-accent-ink transition-colors hover:bg-white"
              >
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
                  INSPECT {activeHeroCar.title.toUpperCase()} &amp; VERIFIED
                  AUCTION SHEET
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase">
                  <span>
                    {formatPKR(
                      activeHeroCar.price_pkr,
                      activeHeroCar.call_for_price
                    )}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* =====================================================================
          5. "EXPERIENCE, ELEGANCE, EXCELLENCE" — 4-Step Import Process &
             Architectural Showroom Feature Split (Reference Bottom Left Section)
         ===================================================================== */}
      <section className="border-b border-border bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Heading + 2x2 Grid with Electric Lime-Yellow Icons */}
            <div className="lg:col-span-7">
              <RevealOnScroll>
                <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  03 • JAPAN-TO-LAHORE PROTOCOL
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">
                  Experience, Transparency, Excellence.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                  Our 4-step custom import protocol connects you directly to
                  Japanese auction houses with full landed-cost clarity and
                  showroom delivery at DHA Phase 8.
                </p>
              </RevealOnScroll>

              {/* 2x2 Feature Cards with Animated SVG Telemetry */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {IMPORT_STEPS.map((item, idx) => {
                  const Icon = item.icon;
                  const isHighlighted = activeImportStep === idx;
                  return (
                    <RevealOnScroll key={item.step} delay={idx * 0.08}>
                      <div
                        onMouseEnter={() => setActiveImportStep(idx)}
                        onClick={() => setActiveImportStep(idx)}
                        className={`group relative flex h-full cursor-pointer flex-col justify-between rounded-[4px] border p-5 transition-colors duration-300 ${
                          isHighlighted
                            ? "border-accent bg-surface-elevated"
                            : "border-border bg-surface hover:border-accent/60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="font-mono text-xs font-bold tabular-nums text-accent">
                              {item.step} • {item.duration}
                            </span>
                          </div>

                          <h3 className="mt-4 font-display text-lg font-semibold text-ink group-hover:text-accent">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-xs leading-relaxed text-muted">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-4">
                          <ImportStageGraphic step={item.step} />
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Architectural Showroom Feature & DHA Phase 8 Map Card */}
            <RevealOnScroll delay={0.16} className="lg:col-span-5">
              <div className="overflow-hidden rounded-[4px] border border-border bg-surface transition-colors duration-300 hover:border-accent">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85"
                    alt="Haider Cars DHA Phase 8 Lahore Showroom"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#131519] via-transparent to-black/30" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-[4px] bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-accent-ink">
                      DHA PHASE 8 • LAHORE
                    </span>
                    <span className="rounded-[4px] border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
                      MON–SAT 10:00–21:00
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-ink">
                    Where Japanese Quality Meets Lahore Prestige.
                  </h3>

                  <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-xs leading-relaxed text-muted">
                        {SHOWROOM_SETTINGS.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 shrink-0 text-accent" />
                      <span className="font-mono text-xs tabular-nums text-muted">
                        {SHOWROOM_SETTINGS.hours}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-accent" />
                      <a
                        href={`https://wa.me/${SHOWROOM_SETTINGS.whatsapp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs font-bold tabular-nums text-ink hover:text-accent"
                      >
                        +92 310 7777844
                      </a>
                    </div>
                  </div>

                  {/* Embedded Google Map */}
                  <div className="mt-5 overflow-hidden rounded-[4px] border border-border">
                    <iframe
                      title="Haider Cars DHA Phase 8 Lahore Map"
                      src="https://www.google.com/maps?q=Haider+Cars+Ring+Road+Service+Lane+DHA+Phase+8+Lahore&output=embed"
                      className="h-48 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/import-a-car"
                      className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-[4px] bg-accent px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink"
                    >
                      <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                      <span className="relative z-10">
                        Request Custom Import
                      </span>
                      <ArrowUpRight className="relative z-10 h-3.5 w-3.5" />
                    </Link>

                    <a
                      href={SHOWROOM_SETTINGS.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-[4px] border border-border bg-canvas px-3 py-3 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <span>FB</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                    <a
                      href={SHOWROOM_SETTINGS.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-[4px] border border-border bg-canvas px-3 py-3 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <span>IG</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}
