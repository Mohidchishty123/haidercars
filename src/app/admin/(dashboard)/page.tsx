"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Star } from "lucide-react";
import { Vehicle, VehicleStatus } from "@/types/database";
import { getStoredVehicles, saveStoredVehicles } from "@/lib/adminStore";
import { formatEngineCC, formatMileage, formatPKR } from "@/lib/format";
import { VehicleDrawer } from "@/components/admin/VehicleDrawer";

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setVehicles(getStoredVehicles());
  }, []);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }

  function updateVehicles(next: Vehicle[], message: string) {
    setVehicles(next);
    saveStoredVehicles(next);
    notify(message);
  }

  function handleStatusChange(id: string, status: VehicleStatus) {
    const next = vehicles.map((v) =>
      v.id === id ? { ...v, status, updated_at: new Date().toISOString() } : v
    );
    updateVehicles(next, "Status updated");
  }

  function handleToggleFeatured(id: string) {
    const next = vehicles.map((v) =>
      v.id === id
        ? { ...v, is_featured: !v.is_featured, updated_at: new Date().toISOString() }
        : v
    );
    updateVehicles(next, "Featured status updated");
  }

  function handleSaveVehicle(saved: Vehicle) {
    const exists = vehicles.some((v) => v.id === saved.id);
    const next = exists
      ? vehicles.map((v) => (v.id === saved.id ? saved : v))
      : [saved, ...vehicles];
    updateVehicles(next, exists ? "Vehicle updated" : "Vehicle added");
    setDrawerOpen(false);
    setEditingVehicle(null);
  }

  function handleDeleteVehicle(id: string) {
    const next = vehicles.filter((v) => v.id !== id);
    updateVehicles(next, "Vehicle deleted");
    setDrawerOpen(false);
    setEditingVehicle(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      `${v.title} ${v.make} ${v.model} ${v.year} ${v.color}`
        .toLowerCase()
        .includes(q)
    );
  }, [vehicles, search]);

  return (
    <div>
      {/* Header & Primary Action */}
      <div className="flex flex-col justify-between gap-4 border-b border-admin-border pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#141517]">
            Vehicles Manager
          </h1>
          <p className="mt-1 text-xs text-[#686661]">
            One-tap status updates, featured toggles, and vehicle inventory
            management.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingVehicle(null);
            setDrawerOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#141517] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#B8332A]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Search & Toast Bar */}
      <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#686661]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by make, model, or year..."
            className="w-full rounded-[4px] border border-admin-border bg-admin-surface py-2 pl-9 pr-3 text-xs text-[#141517] focus:border-[#141517] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#686661]">
          {toast && (
            <span className="rounded-[4px] border border-[#141517] bg-[#141517] px-2.5 py-1 text-[11px] text-white">
              {toast}
            </span>
          )}
          <span className="tabular-nums">{filtered.length} VEHICLES</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="mt-5 hidden overflow-hidden rounded-[4px] border border-admin-border bg-admin-surface md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-bg font-mono text-[11px] uppercase tracking-wider text-[#686661]">
              <th className="px-4 py-3 font-semibold">Vehicle</th>
              <th className="px-4 py-3 font-semibold">Specs</th>
              <th className="px-4 py-3 font-semibold">Price (PKR)</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-center font-semibold">Featured</th>
              <th className="px-4 py-3 text-right font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-admin-bg/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={v.images[0] || "/images/raize-front.svg"}
                      alt={v.title}
                      className="h-11 w-16 rounded-[4px] border border-admin-border object-cover"
                    />
                    <div>
                      <div className="font-display font-semibold text-[#141517]">
                        {v.title}
                      </div>
                      <div className="font-mono text-[11px] uppercase text-[#686661]">
                        {v.category} • {v.color}
                        {v.auction_grade ? ` • GRADE ${v.auction_grade}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-[#686661]">
                  <div>{v.year}</div>
                  <div>
                    {formatMileage(v.mileage_km)} • {formatEngineCC(v.engine_cc)}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs font-semibold tabular-nums text-[#141517]">
                  {formatPKR(v.price_pkr, v.call_for_price)}
                </td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Status for ${v.title}`}
                    value={v.status}
                    onChange={(e) =>
                      handleStatusChange(v.id, e.target.value as VehicleStatus)
                    }
                    className="rounded-[4px] border border-admin-border bg-admin-surface px-2.5 py-1.5 font-mono text-xs font-medium text-[#141517] focus:border-[#141517] focus:outline-none"
                  >
                    <option value="in_showroom">In Showroom</option>
                    <option value="in_transit">In Transit</option>
                    <option value="sold">Sold</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    aria-label={`Toggle featured for ${v.title}`}
                    onClick={() => handleToggleFeatured(v.id)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-[4px] border transition-colors ${
                      v.is_featured
                        ? "border-[#B45309] bg-[#B45309]/10 text-[#B45309]"
                        : "border-admin-border text-[#9499A3] hover:text-[#141517]"
                    }`}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={v.is_featured ? "currentColor" : "none"}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVehicle(v);
                      setDrawerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-admin-border px-3 py-1.5 font-mono text-xs font-medium text-[#141517] hover:border-[#141517]"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (375px Friendly) */}
      <div className="mt-4 space-y-3 md:hidden">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="rounded-[4px] border border-admin-border bg-admin-surface p-4"
          >
            <div className="flex items-start gap-3">
              <img
                src={v.images[0] || "/images/raize-front.svg"}
                alt={v.title}
                className="h-14 w-20 shrink-0 rounded-[4px] border border-admin-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-bold text-[#141517]">
                  {v.title}
                </div>
                <div className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-[#141517]">
                  {formatPKR(v.price_pkr, v.call_for_price)}
                </div>
                <div className="mt-0.5 font-mono text-[11px] tabular-nums text-[#686661]">
                  {v.year} • {formatMileage(v.mileage_km)} •{" "}
                  {formatEngineCC(v.engine_cc)}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-admin-border pt-3">
              <select
                aria-label={`Status for ${v.title}`}
                value={v.status}
                onChange={(e) =>
                  handleStatusChange(v.id, e.target.value as VehicleStatus)
                }
                className="rounded-[4px] border border-admin-border bg-admin-bg px-2.5 py-1.5 font-mono text-xs font-medium text-[#141517]"
              >
                <option value="in_showroom">In Showroom</option>
                <option value="in_transit">In Transit</option>
                <option value="sold">Sold</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Toggle featured"
                  onClick={() => handleToggleFeatured(v.id)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-[4px] border ${
                    v.is_featured
                      ? "border-[#B45309] bg-[#B45309]/10 text-[#B45309]"
                      : "border-admin-border text-[#9499A3]"
                  }`}
                >
                  <Star
                    className="h-4 w-4"
                    fill={v.is_featured ? "currentColor" : "none"}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingVehicle(v);
                    setDrawerOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-[4px] border border-admin-border px-3 py-1.5 font-mono text-xs font-medium text-[#141517]"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Slide-Over Drawer */}
      <VehicleDrawer
        open={drawerOpen}
        vehicle={editingVehicle}
        onClose={() => {
          setDrawerOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
        onDelete={handleDeleteVehicle}
      />
    </div>
  );
}
