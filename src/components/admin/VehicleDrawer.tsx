"use client";

import { useEffect, useState } from "react";
import { FileText, ImagePlus, Trash2, Upload, X } from "lucide-react";
import { Vehicle, VehicleCategory, VehicleStatus } from "@/types/database";
import { compressImageFile, slugifyTitle } from "@/lib/adminStore";

interface VehicleDrawerProps {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
}

interface FormState {
  title: string;
  make: string;
  model: string;
  year: string;
  category: VehicleCategory;
  status: VehicleStatus;
  price_pkr: string;
  call_for_price: boolean;
  mileage_km: string;
  engine_cc: string;
  transmission: string;
  fuel_type: string;
  color: string;
  registration_city: string;
  auction_grade: string;
  auction_sheet_url: string;
  images: string[];
  video_url: string;
  is_featured: boolean;
}

function toFormState(v: Vehicle | null): FormState {
  if (!v) {
    return {
      title: "",
      make: "",
      model: "",
      year: String(new Date().getFullYear()),
      category: "imported",
      status: "in_showroom",
      price_pkr: "",
      call_for_price: false,
      mileage_km: "",
      engine_cc: "",
      transmission: "Automatic",
      fuel_type: "Hybrid",
      color: "",
      registration_city: "Unregistered",
      auction_grade: "4.5",
      auction_sheet_url: "",
      images: [],
      video_url: "",
      is_featured: false,
    };
  }
  return {
    title: v.title,
    make: v.make,
    model: v.model,
    year: String(v.year),
    category: v.category,
    status: v.status,
    price_pkr: v.price_pkr !== null ? String(v.price_pkr) : "",
    call_for_price: v.call_for_price,
    mileage_km: String(v.mileage_km),
    engine_cc: String(v.engine_cc),
    transmission: v.transmission,
    fuel_type: v.fuel_type,
    color: v.color,
    registration_city: v.registration_city,
    auction_grade: v.auction_grade || "",
    auction_sheet_url: v.auction_sheet_url || "",
    images: v.images,
    video_url: v.video_url || "",
    is_featured: v.is_featured,
  };
}

export function VehicleDrawer({
  open,
  vehicle,
  onClose,
  onSave,
  onDelete,
}: VehicleDrawerProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(vehicle));
  const [compressing, setCompressing] = useState(false);

  useEffect(() => {
    setForm(toFormState(vehicle));
  }, [vehicle, open]);

  if (!open) return null;

  async function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setCompressing(true);
    try {
      const compressed = await Promise.all(
        Array.from(files).map((f) => compressImageFile(f))
      );
      setForm((prev) => ({ ...prev, images: [...prev.images, ...compressed] }));
    } finally {
      setCompressing(false);
    }
  }

  async function handleAuctionSheetFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    setCompressing(true);
    try {
      const compressed = await compressImageFile(files[0], 1400, 0.82);
      setForm((prev) => ({ ...prev, auction_sheet_url: compressed }));
    } finally {
      setCompressing(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    const parsedYear = Number(form.year) || new Date().getFullYear();
    const saved: Vehicle = {
      id: vehicle?.id || `v-${Date.now()}`,
      slug: vehicle?.slug || `${slugifyTitle(form.title)}-${Date.now().toString().slice(-4)}`,
      title: form.title.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      year: parsedYear,
      category: form.category,
      status: form.status,
      price_pkr: form.call_for_price
        ? null
        : form.price_pkr
          ? Number(form.price_pkr)
          : null,
      call_for_price: form.call_for_price,
      mileage_km: Number(form.mileage_km) || 0,
      engine_cc: Number(form.engine_cc) || 0,
      transmission: form.transmission.trim() || "Automatic",
      fuel_type: form.fuel_type.trim() || "Hybrid",
      color: form.color.trim(),
      registration_city: form.registration_city.trim() || "Unregistered",
      auction_grade: form.auction_grade.trim() || null,
      auction_sheet_url: form.auction_sheet_url.trim() || null,
      images:
        form.images.length > 0 ? form.images : ["/images/raize-front.svg"],
      video_url: form.video_url.trim() || null,
      is_featured: form.is_featured,
      created_at: vehicle?.created_at || now,
      updated_at: now,
    };
    onSave(saved);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-xl flex-col border-l border-admin-border bg-admin-surface text-[#141517]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-admin-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold">
              {vehicle ? "Edit Vehicle" : "+ Add New Vehicle"}
            </h2>
            <p className="font-mono text-[11px] text-[#686661]">
              {vehicle ? `ID: ${vehicle.id}` : "Matches vehicles database schema"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-admin-border text-[#686661] hover:border-[#141517] hover:text-[#141517]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Single-Column Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
        >
          {/* Drag-and-Drop Vehicle Photos Upload */}
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
              Vehicle Photos (Index 0 = Cover, Index 1+ = Multi-Image Hover
              Cycle)
            </label>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImageFiles(e.dataTransfer.files);
              }}
              className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-[4px] border border-dashed border-admin-border bg-admin-bg px-4 py-6 text-center transition-colors hover:border-[#141517]"
            >
              <ImagePlus className="h-5 w-5 text-[#686661]" />
              <span className="mt-2 text-xs font-medium text-[#141517]">
                {compressing
                  ? "Compressing images..."
                  : "Drag & drop photos here, or click to browse"}
              </span>
              <span className="mt-0.5 font-mono text-[10px] text-[#686661]">
                Auto-compressed client-side (max 1200px JPEG)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageFiles(e.target.files)}
              />
            </label>

            {form.images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {form.images.map((src, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[16/10] overflow-hidden rounded-[4px] border border-admin-border bg-admin-bg"
                  >
                    <img
                      src={src}
                      alt={`Vehicle photo ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-1 top-1 rounded-[2px] bg-[#141517]/80 px-1 font-mono text-[9px] text-white">
                      {idx === 0
                        ? "COVER"
                        : idx === 1
                          ? "HOVER 1"
                          : `HOVER ${idx}`}
                    </span>
                    <div className="absolute bottom-1 left-1 flex gap-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => {
                              const next = [...prev.images];
                              const [picked] = next.splice(idx, 1);
                              return { ...prev, images: [picked, ...next] };
                            })
                          }
                          className="rounded-[2px] bg-[#141517]/85 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white hover:bg-[#B8332A]"
                        >
                          Cover
                        </button>
                      )}
                      {idx !== 1 && form.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => {
                              const next = [...prev.images];
                              const [picked] = next.splice(idx, 1);
                              const insertAt = Math.min(1, next.length);
                              next.splice(insertAt, 0, picked);
                              return { ...prev, images: next };
                            })
                          }
                          className="rounded-[2px] bg-[#141517]/85 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white hover:bg-[#B8332A]"
                        >
                          Hover
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute right-1 top-1 rounded-[2px] bg-[#B8332A] p-0.5 text-white opacity-90 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Separate Auction Sheet Upload */}
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
              Auction Sheet Image
            </label>
            <div className="mt-1.5 flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-[4px] border border-admin-border bg-admin-bg px-3.5 py-2 text-xs font-medium text-[#141517] hover:border-[#141517]">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Auction Sheet</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAuctionSheetFile(e.target.files)}
                />
              </label>
              {form.auction_sheet_url && (
                <div className="flex items-center gap-2 font-mono text-xs text-[#141517]">
                  <FileText className="h-3.5 w-3.5 text-[#B8332A]" />
                  <span>Attached</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, auction_sheet_url: "" }))
                    }
                    className="text-[#B8332A] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
              Listing Title *
            </label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. 2023 Toyota Raize Z Hybrid"
              className="mt-1 w-full rounded-[4px] border border-admin-border bg-admin-surface px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
            />
          </div>

          {/* Make, Model, Year */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Make *
              </label>
              <input
                required
                type="text"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="Toyota"
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Model *
              </label>
              <input
                required
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Raize"
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Year *
              </label>
              <input
                required
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 font-mono text-sm tabular-nums focus:border-[#141517] focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as VehicleCategory,
                  })
                }
                className="mt-1 w-full rounded-[4px] border border-admin-border bg-admin-surface px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              >
                <option value="imported">Imported</option>
                <option value="used">Used / Pre-Owned</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Status *
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as VehicleStatus })
                }
                className="mt-1 w-full rounded-[4px] border border-admin-border bg-admin-surface px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              >
                <option value="in_showroom">In Showroom</option>
                <option value="in_transit">In Transit</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Price & Call For Price */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Price (PKR)
              </label>
              <input
                type="number"
                disabled={form.call_for_price}
                value={form.price_pkr}
                onChange={(e) =>
                  setForm({ ...form, price_pkr: e.target.value })
                }
                placeholder="6850000"
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 font-mono text-sm tabular-nums disabled:bg-admin-bg disabled:text-[#686661] focus:border-[#141517] focus:outline-none"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-[4px] border border-admin-border bg-admin-bg px-3 py-2.5 text-xs font-medium">
              <input
                type="checkbox"
                checked={form.call_for_price}
                onChange={(e) =>
                  setForm({ ...form, call_for_price: e.target.checked })
                }
                className="h-4 w-4 accent-[#141517]"
              />
              <span>Show &ldquo;CALL FOR PRICE&rdquo;</span>
            </label>
          </div>

          {/* Mileage, Engine CC, Auction Grade */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Mileage (KM) *
              </label>
              <input
                required
                type="number"
                value={form.mileage_km}
                onChange={(e) =>
                  setForm({ ...form, mileage_km: e.target.value })
                }
                placeholder="14500"
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 font-mono text-sm tabular-nums focus:border-[#141517] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Engine (CC) *
              </label>
              <input
                required
                type="number"
                value={form.engine_cc}
                onChange={(e) =>
                  setForm({ ...form, engine_cc: e.target.value })
                }
                placeholder="1200"
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 font-mono text-sm tabular-nums focus:border-[#141517] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Auction Grade
              </label>
              <input
                type="text"
                value={form.auction_grade}
                onChange={(e) =>
                  setForm({ ...form, auction_grade: e.target.value })
                }
                placeholder="4.5 or R"
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 font-mono text-sm tabular-nums focus:border-[#141517] focus:outline-none"
              />
            </div>
          </div>

          {/* Transmission, Fuel, Color, Registration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Transmission
              </label>
              <input
                type="text"
                value={form.transmission}
                onChange={(e) =>
                  setForm({ ...form, transmission: e.target.value })
                }
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Fuel Type
              </label>
              <input
                type="text"
                value={form.fuel_type}
                onChange={(e) =>
                  setForm({ ...form, fuel_type: e.target.value })
                }
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Color *
              </label>
              <input
                required
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Pearl White"
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
                Registration City
              </label>
              <input
                type="text"
                value={form.registration_city}
                onChange={(e) =>
                  setForm({ ...form, registration_city: e.target.value })
                }
                className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 text-sm focus:border-[#141517] focus:outline-none"
              />
            </div>
          </div>

          {/* Video URL & Featured */}
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]">
              Optional Walkaround Video Embed URL
            </label>
            <input
              type="url"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
              className="mt-1 w-full rounded-[4px] border border-admin-border px-3 py-2 font-mono text-xs focus:border-[#141517] focus:outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-[4px] border border-admin-border bg-admin-bg px-3.5 py-3 text-xs font-medium">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) =>
                setForm({ ...form, is_featured: e.target.checked })
              }
              className="h-4 w-4 accent-[#141517]"
            />
            <span>Feature this vehicle on the Homepage Grid</span>
          </label>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-admin-border pt-4">
            {vehicle && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(vehicle.id)}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#B8332A]/40 px-3.5 py-2.5 font-mono text-xs font-semibold text-[#B8332A] hover:bg-[#B8332A]/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[4px] border border-admin-border px-4 py-2.5 font-mono text-xs font-medium text-[#686661] hover:text-[#141517]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-[4px] bg-[#141517] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#B8332A]"
              >
                {vehicle ? "Save Changes" : "Publish Vehicle"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
