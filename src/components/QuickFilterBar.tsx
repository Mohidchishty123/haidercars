"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { MECHANICAL_EASE } from "@/components/MotionEffects";

export function QuickFilterBar() {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (category !== "all") params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.push(qs ? `/inventory?${qs}` : "/inventory");
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: 0.2, ease: MECHANICAL_EASE }}
      className="grid grid-cols-1 divide-y divide-white/10 rounded-[4px] border border-white/15 bg-[#111318]/90 backdrop-blur-md transition-colors duration-300 hover:border-accent/60 md:grid-cols-12 md:divide-x md:divide-y-0"
    >
      {/* Status */}
      <div
        className="relative flex flex-col justify-center px-4 py-3.5 md:col-span-3"
        onFocus={() => setFocusedField("status")}
        onBlur={() => setFocusedField(null)}
      >
        <label
          htmlFor="quick-status"
          className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent"
        >
          01 / Availability
        </label>
        <select
          id="quick-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 cursor-pointer bg-transparent text-sm font-medium text-ink focus:outline-none"
        >
          <option value="all" className="bg-surface text-ink">
            All Statuses
          </option>
          <option value="in_showroom" className="bg-surface text-ink">
            In Showroom
          </option>
          <option value="in_transit" className="bg-surface text-ink">
            In Transit
          </option>
        </select>
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-300 ${
            focusedField === "status" ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>

      {/* Category */}
      <div
        className="relative flex flex-col justify-center px-4 py-3.5 md:col-span-3"
        onFocus={() => setFocusedField("category")}
        onBlur={() => setFocusedField(null)}
      >
        <label
          htmlFor="quick-category"
          className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent"
        >
          02 / Category
        </label>
        <select
          id="quick-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 cursor-pointer bg-transparent text-sm font-medium text-ink focus:outline-none"
        >
          <option value="all" className="bg-surface text-ink">
            Imported &amp; Used
          </option>
          <option value="imported" className="bg-surface text-ink">
            Japanese Imported
          </option>
          <option value="used" className="bg-surface text-ink">
            Pre-Owned / Used
          </option>
        </select>
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-300 ${
            focusedField === "category" ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>

      {/* Search Make/Model */}
      <div
        className="relative flex flex-col justify-center px-4 py-3.5 md:col-span-4"
        onFocus={() => setFocusedField("search")}
        onBlur={() => setFocusedField(null)}
      >
        <label
          htmlFor="quick-search"
          className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent"
        >
          03 / Search Make or Model
        </label>
        <div className="mt-1 flex items-center gap-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted" />
          <input
            id="quick-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Toyota Raize, Vezel, Prado..."
            className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none"
          />
        </div>
        <span
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-300 ${
            focusedField === "search" ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>

      {/* Submit */}
      <div className="flex items-stretch p-2 md:col-span-2">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.985 }}
          className="group relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-[4px] bg-accent px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink"
        >
          <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
          <span className="relative z-10">Filter Stock</span>
          <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </motion.button>
      </div>
    </motion.form>
  );
}
