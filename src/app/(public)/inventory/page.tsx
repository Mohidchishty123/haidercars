import { Suspense } from "react";
import { Metadata } from "next";
import { VEHICLES } from "@/data/vehicles";
import { InventoryCatalog } from "@/components/InventoryCatalog";

export const metadata: Metadata = {
  title: "Showroom Inventory | Haider Cars Lahore",
  description:
    "Browse ready-stock Japanese imported vehicles, in-transit shipments, and curated pre-owned cars at Haider Cars DHA Phase 8, Lahore.",
};

export default function InventoryPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-14">
      <div className="border-b border-border pb-6">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
          Showroom Catalog
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          Vehicle Inventory
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Filter by availability, import category, or search directly by make
          and model. Every imported unit includes verifiable Japanese auction
          documentation.
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="rounded-[4px] border border-border bg-surface p-8 font-mono text-xs text-muted">
              Loading showroom catalog...
            </div>
          }
        >
          <InventoryCatalog vehicles={VEHICLES} />
        </Suspense>
      </div>
    </div>
  );
}
