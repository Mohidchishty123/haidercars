"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Vehicle } from "@/types/database";
import { VehicleCard } from "@/components/VehicleCard";
import { getStoredVehicles } from "@/lib/adminStore";
import { MECHANICAL_EASE, RevealOnScroll } from "@/components/MotionEffects";

type StatusFilter = "all" | "in_showroom" | "in_transit" | "sold";
type CategoryFilter = "all" | "imported" | "used";
type SortOption = "newest" | "price_asc" | "price_desc";

export function InventoryCatalog({
  vehicles: initialVehicles,
}: {
  vehicles: Vehicle[];
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sync = () => setVehicles(getStoredVehicles());
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const [status, setStatus] = useState<StatusFilter>(
    (searchParams.get("status") as StatusFilter) || "all"
  );
  const [category, setCategory] = useState<CategoryFilter>(
    (searchParams.get("category") as CategoryFilter) || "all"
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (category !== "all") params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.replace(qs ? `/inventory?${qs}` : "/inventory", { scroll: false });
  }, [status, category, sort, query, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = vehicles.filter((v) => {
      if (status !== "all" && v.status !== status) return false;
      if (category !== "all" && v.category !== category) return false;
      if (q) {
        const hay =
          `${v.title} ${v.make} ${v.model} ${v.year} ${v.color}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "price_asc") {
        const pa = a.price_pkr ?? Number.MAX_SAFE_INTEGER;
        const pb = b.price_pkr ?? Number.MAX_SAFE_INTEGER;
        return pa - pb;
      }
      if (sort === "price_desc") {
        const pa = a.price_pkr ?? -1;
        const pb = b.price_pkr ?? -1;
        return pb - pa;
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [vehicles, status, category, sort, query]);

  function resetFilters() {
    setStatus("all");
    setCategory("all");
    setSort("newest");
    setQuery("");
  }

  return (
    <div>
      {/* Filter Bar with Animated Electric Lime-Yellow Pill Indicator */}
      <RevealOnScroll>
        <div className="rounded-[4px] border border-border bg-surface p-4 transition-colors duration-300 hover:border-accent/60">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Status Pills with layoutId */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "in_showroom", label: "In Showroom" },
                  { value: "in_transit", label: "In Transit" },
                  { value: "sold", label: "Sold" },
                ] as const
              ).map((opt) => {
                const isSelected = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`relative rounded-[4px] border px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? "border-accent text-accent-ink"
                        : "border-border bg-canvas text-muted hover:border-accent/50 hover:text-ink"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="inventory-status-pill"
                        transition={{ duration: 0.4, ease: MECHANICAL_EASE }}
                        className="absolute inset-0 rounded-[3px] bg-accent"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search + Category + Sort */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search make or model..."
                  className="w-full rounded-[4px] border border-border bg-canvas py-2 pl-8 pr-3 text-xs font-medium text-ink placeholder:text-muted transition-colors focus:border-accent focus:outline-none lg:w-52"
                />
              </div>

              <select
                aria-label="Filter by category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                className="cursor-pointer rounded-[4px] border border-border bg-canvas px-3 py-2 text-xs font-medium text-ink transition-colors focus:border-accent focus:outline-none"
              >
                <option value="all" className="bg-surface text-ink">
                  Category: All
                </option>
                <option value="imported" className="bg-surface text-ink">
                  Imported
                </option>
                <option value="used" className="bg-surface text-ink">
                  Used
                </option>
              </select>

              <select
                aria-label="Sort vehicles"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="cursor-pointer rounded-[4px] border border-border bg-canvas px-3 py-2 text-xs font-medium text-ink transition-colors focus:border-accent focus:outline-none"
              >
                <option value="newest" className="bg-surface text-ink">
                  Sort: Newest
                </option>
                <option value="price_asc" className="bg-surface text-ink">
                  Price: Low to High
                </option>
                <option value="price_desc" className="bg-surface text-ink">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Results Count & Active Filter Chips */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <motion.span
          key={filtered.length}
          initial={{ opacity: 0.4, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: MECHANICAL_EASE }}
          className="font-mono text-xs font-medium tabular-nums text-muted"
        >
          SHOWING {filtered.length} OF {vehicles.length} VEHICLES
        </motion.span>

        {(status !== "all" ||
          category !== "all" ||
          sort !== "newest" ||
          query) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-accent hover:underline"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </motion.button>
        )}
      </div>

      {/* Animated Layout Grid */}
      {filtered.length > 0 ? (
        <motion.div
          layout
          className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: MECHANICAL_EASE }}
          className="mt-8 rounded-[4px] border border-border bg-surface p-12 text-center"
        >
          <p className="font-display text-lg font-semibold text-ink">
            No vehicles match your current filters.
          </p>
          <p className="mt-2 text-sm text-muted">
            Clear your search or request a custom Japanese import directly.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-[4px] bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink transition-colors hover:bg-white"
          >
            Reset All Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
