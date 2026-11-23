"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Vehicle } from "@/types/database";
import {
  formatEngineCC,
  formatMileage,
  formatPKR,
  getStatusLabel,
} from "@/lib/format";
import { MECHANICAL_EASE } from "@/components/MotionEffects";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const images =
    vehicle.images.length > 0 ? vehicle.images : ["/images/raize-front.svg"];
  const [isHovered, setIsHovered] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Cycle smoothly through all uploaded images while hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      setActiveImgIdx(0);
      return;
    }

    // Immediately crossfade to image #2 on hover start
    setActiveImgIdx(1);

    if (images.length <= 2) return;

    const timer = setInterval(() => {
      setActiveImgIdx((prev) => (prev + 1) % images.length);
    }, 1300);

    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.08, 0.4),
        ease: MECHANICAL_EASE,
      }}
      className="h-full"
    >
      <Link
        href={`/inventory/${vehicle.slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex h-full flex-col overflow-hidden rounded-[4px] border border-border bg-surface transition-colors duration-[350ms] hover:border-accent"
      >
        {/* Top Animated Electric Lime-Yellow Bar on Hover */}
        <span className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />

        {/* Top Status & Grade Bar */}
        <div className="flex items-center justify-between border-b border-border bg-[#0F1115] px-4 py-2.5">
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
              <span className="rounded-[4px] bg-status-transit/15 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-status-transit">
                {getStatusLabel(vehicle.status)}
              </span>
            )}
            {vehicle.status === "sold" && (
              <span className="rounded-[4px] bg-status-sold/20 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                {getStatusLabel(vehicle.status)}
              </span>
            )}
          </div>

          {vehicle.auction_grade && (
            <span className="rounded-[4px] border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
              GRADE {vehicle.auction_grade}
            </span>
          )}
        </div>

        {/* 16:10 Image Container with shared layoutId & multi-image 0.35s crossfade */}
        <motion.div
          layoutId={`vehicle-image-${vehicle.slug}`}
          className="relative aspect-[16/10] w-full overflow-hidden bg-[#090A0D]"
        >
          {images.map((src, imgIdx) => (
            <img
              key={`${src}-${imgIdx}`}
              src={src}
              alt={`${vehicle.title} view ${imgIdx + 1}`}
              style={{
                opacity: activeImgIdx === imgIdx ? 1 : 0,
              }}
              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          ))}

          {/* Multi-Image Indicator Dots */}
          {images.length > 1 && (
            <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-[4px] border border-white/15 bg-black/65 px-2 py-1 backdrop-blur-sm">
              {images.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeImgIdx === dotIdx
                      ? "w-3.5 bg-accent"
                      : "w-1.5 bg-white/45"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Subtle bottom gradient for editorial legibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0C0E]/85 to-transparent" />

          {/* Sliding Telemetry Spec Strip on Hover */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between border-t border-white/10 bg-[#0B0C0E]/95 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <span>
              {vehicle.fuel_type} • {vehicle.transmission}
            </span>
            <span className="font-bold text-accent">
              PHOTO 0{activeImgIdx + 1} / 0{images.length} →
            </span>
          </div>
        </motion.div>

        {/* Title & Technical Spec Grid */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
              <span>
                {vehicle.category === "imported"
                  ? "Japanese Import"
                  : "Pre-Owned"}{" "}
                • {vehicle.registration_city}
              </span>
              <span className="text-[10px] text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {vehicle.color}
              </span>
            </div>
            <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-accent">
              {vehicle.title}
            </h3>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-2.5 font-mono text-xs font-medium tabular-nums text-ink">
              <div className="pr-2">
                <span className="block text-[10px] uppercase text-muted">
                  Year
                </span>
                <span>{vehicle.year}</span>
              </div>
              <div className="px-3">
                <span className="block text-[10px] uppercase text-muted">
                  Mileage
                </span>
                <span>{formatMileage(vehicle.mileage_km)}</span>
              </div>
              <div className="pl-3">
                <span className="block text-[10px] uppercase text-muted">
                  Engine
                </span>
                <span>{formatEngineCC(vehicle.engine_cc)}</span>
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between">
              <span
                className={`font-mono text-sm font-bold tabular-nums ${
                  vehicle.call_for_price ? "text-accent" : "text-ink"
                }`}
              >
                {formatPKR(vehicle.price_pkr, vehicle.call_for_price)}
              </span>

              <span className="inline-flex items-center gap-2 font-mono text-xs font-medium text-muted transition-colors group-hover:text-ink">
                <span>View Details</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-surface-elevated text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-ink">
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
