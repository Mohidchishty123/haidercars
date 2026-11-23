"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  MessageCircle,
  Play,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Vehicle } from "@/types/database";
import { SHOWROOM_SETTINGS } from "@/data/settings";
import { getStoredVehicles } from "@/lib/adminStore";
import {
  buildVehicleWhatsAppUrl,
  formatEngineCC,
  formatMileage,
  formatPKR,
  getStatusLabel,
} from "@/lib/format";
import {
  ClipReveal,
  MECHANICAL_EASE,
  RevealOnScroll,
} from "@/components/MotionEffects";

export function VehicleDetailView({
  slug,
  initialVehicle,
}: {
  slug: string;
  initialVehicle: Vehicle | null;
}) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(initialVehicle);
  const [checkedStorage, setCheckedStorage] = useState<boolean>(
    Boolean(initialVehicle)
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"photos" | "video">("photos");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState<1 | 1.5 | 2>(1);

  useEffect(() => {
    const sync = () => {
      const match = getStoredVehicles().find(
        (v) =>
          v.slug === slug ||
          (initialVehicle && v.id === initialVehicle.id)
      );
      if (match) {
        setVehicle(match);
      }
      setCheckedStorage(true);
    };
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug, initialVehicle]);

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        <div className="rounded-[4px] border border-border bg-surface p-10 text-center">
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            {checkedStorage ? "404 • Not Found" : "Loading Specification"}
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">
            {checkedStorage
              ? "Vehicle Not Found"
              : "Loading Vehicle Details..."}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {checkedStorage
              ? "This vehicle may have been removed or is no longer listed."
              : "Fetching vehicle data from showroom inventory."}
          </p>
          {checkedStorage && (
            <Link
              href="/inventory"
              className="mt-6 inline-flex items-center gap-2 rounded-[4px] bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Inventory</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const images =
    vehicle.images.length > 0 ? vehicle.images : ["/images/raize-front.svg"];

  const whatsappUrl = buildVehicleWhatsAppUrl(
    SHOWROOM_SETTINGS.whatsapp_number,
    vehicle.year,
    vehicle.title
  );

  const specRows = [
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Year", value: String(vehicle.year), mono: true },
    { label: "Mileage", value: formatMileage(vehicle.mileage_km), mono: true },
    {
      label: "Engine CC",
      value: formatEngineCC(vehicle.engine_cc),
      mono: true,
    },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Fuel", value: vehicle.fuel_type },
    { label: "Color", value: vehicle.color },
    { label: "Registration", value: vehicle.registration_city },
    {
      label: "Auction Grade",
      value: vehicle.auction_grade ? `GRADE ${vehicle.auction_grade}` : "N/A",
      mono: true,
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-12">
      {/* Breadcrumb Back Link */}
      <RevealOnScroll y={10}>
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/inventory"
            className="group inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Inventory</span>
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            REF: {vehicle.id.toUpperCase()}
          </span>
        </div>
      </RevealOnScroll>

      {/* 65% Left / 35% Sticky Right Split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column (65% -> 8 cols on 12-col grid) */}
        <div className="space-y-8 lg:col-span-8">
          {/* Media Viewer */}
          <div className="overflow-hidden rounded-[4px] border border-border bg-surface transition-colors duration-300 hover:border-ink">
            {/* Optional Video / Photos Tab Header */}
            {vehicle.video_url && (
              <div className="flex border-b border-border bg-canvas px-4 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("photos")}
                  className={`relative px-4 pb-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === "photos"
                      ? "text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <span>Photos ({images.length})</span>
                  {activeTab === "photos" && (
                    <motion.span
                      layoutId="media-tab-underline"
                      transition={{ duration: 0.4, ease: MECHANICAL_EASE }}
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`relative inline-flex items-center gap-1.5 px-4 pb-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === "video"
                      ? "text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <Play className="h-3 w-3" />
                  <span>Walkaround Video</span>
                  {activeTab === "video" && (
                    <motion.span
                      layoutId="media-tab-underline"
                      transition={{ duration: 0.4, ease: MECHANICAL_EASE }}
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                    />
                  )}
                </button>
              </div>
            )}

            {activeTab === "photos" ? (
              <div>
                <motion.div
                  layoutId={`vehicle-image-${vehicle.slug}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-canvas"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={images[activeIndex]}
                      src={images[activeIndex]}
                      alt={`${vehicle.title} view ${activeIndex + 1}`}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.42, ease: MECHANICAL_EASE }}
                      className="h-full w-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Angle Counter Badge */}
                  <div className="absolute bottom-3 right-3 rounded-[4px] border border-border bg-surface/95 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink">
                    ANGLE 0{activeIndex + 1} / 0{images.length}
                  </div>
                </motion.div>

                {/* Thumbnail Strip with layoutId active frame */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 border-t border-border p-3 sm:grid-cols-6">
                    {images.map((src, idx) => (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`relative aspect-[16/10] overflow-hidden rounded-[4px] border transition-opacity ${
                          activeIndex === idx
                            ? "border-ink opacity-100"
                            : "border-border opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={src}
                          alt={`${vehicle.title} thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {activeIndex === idx && (
                          <motion.span
                            layoutId="active-thumb-indicator"
                            transition={{
                              duration: 0.35,
                              ease: MECHANICAL_EASE,
                            }}
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/10] w-full bg-ink">
                <iframe
                  title={`${vehicle.title} walkaround video`}
                  src={vehicle.video_url || ""}
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Auction Sheet Section with Scanner Line & Full-Resolution Lightbox */}
          {vehicle.auction_sheet_url && (
            <RevealOnScroll delay={0.1}>
              <div className="rounded-[4px] border border-border bg-surface p-5 transition-colors duration-300 hover:border-ink sm:p-6">
                <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-accent" />
                    <div>
                      <h2 className="font-display text-lg font-semibold text-ink">
                        Verified Japanese Auction Sheet
                      </h2>
                      <p className="text-xs text-muted">
                        Click the inspection sheet below to open the interactive
                        full-resolution zoom inspector.
                      </p>
                    </div>
                  </div>

                  {vehicle.auction_grade && (
                    <span className="self-start rounded-[4px] border border-border bg-canvas px-3 py-1 font-mono text-xs font-semibold tabular-nums text-ink sm:self-auto">
                      GRADE {vehicle.auction_grade}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setZoomScale(1);
                    setLightboxOpen(true);
                  }}
                  className="group relative mt-4 block w-full overflow-hidden rounded-[4px] border border-border bg-canvas text-left transition-colors hover:border-ink"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={vehicle.auction_sheet_url}
                      alt={`${vehicle.title} Japanese auction sheet`}
                      className="h-full w-full object-contain p-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                    />
                    {/* Animated Scanner Line */}
                    <motion.div
                      animate={{ y: ["-10%", "110%"] }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-accent/50"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2.5">
                    <span className="font-mono text-xs font-medium text-muted">
                      Original Japan Auction Inspection Sheet
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink transition-colors group-hover:text-accent">
                      <ZoomIn className="h-3.5 w-3.5" />
                      <span>Open Full-Resolution Zoom</span>
                    </span>
                  </div>
                </button>
              </div>
            </RevealOnScroll>
          )}
        </div>

        {/* Right Column (35% -> 4 cols, Sticky) */}
        <aside className="lg:sticky lg:top-24 lg:col-span-4">
          <RevealOnScroll delay={0.12}>
            <div className="rounded-[4px] border border-border bg-surface p-5 transition-colors duration-300 hover:border-ink sm:p-6">
              {/* Status Badge & Category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {vehicle.status === "in_showroom" && (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                      </span>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
                        {getStatusLabel(vehicle.status)}
                      </span>
                    </>
                  )}
                  {vehicle.status === "in_transit" && (
                    <span className="rounded-[4px] bg-status-transit/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-status-transit">
                      {getStatusLabel(vehicle.status)}
                    </span>
                  )}
                  {vehicle.status === "sold" && (
                    <span className="rounded-[4px] bg-status-sold/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-status-sold">
                      {getStatusLabel(vehicle.status)}
                    </span>
                  )}
                </div>

                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {vehicle.category === "imported" ? "Imported" : "Pre-Owned"}
                </span>
              </div>

              {/* Title & Price */}
              <ClipReveal delay={0.15}>
                <h1 className="mt-3 font-display text-2xl font-bold leading-tight text-ink">
                  {vehicle.title}
                </h1>
              </ClipReveal>

              <div className="mt-4 border-y border-border py-4">
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
                  Demand Price
                </span>
                <div
                  className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${
                    vehicle.call_for_price ? "text-accent" : "text-ink"
                  }`}
                >
                  {formatPKR(vehicle.price_pkr, vehicle.call_for_price)}
                </div>
              </div>

              {/* Staggered Key-Value Spec Table */}
              <dl className="divide-y divide-border text-sm">
                {specRows.map((row, idx) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1 + idx * 0.04,
                      ease: MECHANICAL_EASE,
                    }}
                    className="flex items-center justify-between py-2.5 transition-colors hover:bg-canvas/60"
                  >
                    <dt className="text-muted">{row.label}</dt>
                    <dd
                      className={`font-medium text-ink ${
                        row.mono
                          ? "font-mono text-xs font-semibold tabular-nums"
                          : ""
                      }`}
                    >
                      {row.value}
                    </dd>
                  </motion.div>
                ))}
              </dl>

              {/* Primary WhatsApp CTA with Electric Lime-Yellow Curtain Hover */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[4px] bg-accent px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink"
              >
                <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <MessageCircle className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10">Inquire on WhatsApp</span>
              </a>

              <p className="mt-3 text-center font-mono text-[11px] text-muted">
                Direct Showroom Desk • {SHOWROOM_SETTINGS.display_phone}
              </p>
            </div>
          </RevealOnScroll>
        </aside>
      </div>

      {/* Full-Resolution Auction Sheet Zoom Lightbox */}
      <AnimatePresence>
        {lightboxOpen && vehicle.auction_sheet_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.35, ease: MECHANICAL_EASE }}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[4px] border border-border bg-surface p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                  {vehicle.title} — Auction Sheet Inspector
                </span>
                <div className="flex items-center gap-2">
                  {(
                    [
                      { scale: 1, label: "1.0x" },
                      { scale: 1.5, label: "1.5x" },
                      { scale: 2, label: "2.0x" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.scale}
                      type="button"
                      onClick={() => setZoomScale(item.scale)}
                      className={`inline-flex items-center gap-1 rounded-[4px] border px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                        zoomScale === item.scale
                          ? "border-ink bg-ink text-surface"
                          : "border-border bg-canvas text-ink hover:border-ink"
                      }`}
                    >
                      {item.scale > 1 ? (
                        <ZoomIn className="h-3 w-3" />
                      ) : (
                        <ZoomOut className="h-3 w-3" />
                      )}
                      <span>{item.label}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    aria-label="Close auction sheet zoom"
                    onClick={() => setLightboxOpen(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-border text-ink transition-colors hover:border-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-auto rounded-[4px] bg-canvas p-4">
                <motion.img
                  animate={{ scale: zoomScale }}
                  transition={{ duration: 0.35, ease: MECHANICAL_EASE }}
                  style={{ transformOrigin: "top center" }}
                  src={vehicle.auction_sheet_url}
                  alt={`${vehicle.title} full resolution auction sheet`}
                  className="mx-auto h-auto max-w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
