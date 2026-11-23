import { ImportLead, ShowroomSettings, Vehicle } from "@/types/database";
import { VEHICLES } from "@/data/vehicles";
import { SHOWROOM_SETTINGS } from "@/data/settings";
import { INITIAL_LEADS } from "@/data/leads";

const KEYS = {
  AUTH: "haidercars_admin_auth",
  VEHICLES: "haidercars_admin_vehicles",
  LEADS: "haidercars_admin_leads",
  SETTINGS: "haidercars_admin_settings",
} as const;

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEYS.AUTH) === "authenticated";
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(KEYS.AUTH, "authenticated");
  } else {
    localStorage.removeItem(KEYS.AUTH);
  }
}

export function getStoredVehicles(): Vehicle[] {
  if (typeof window === "undefined") return VEHICLES;
  try {
    const raw = localStorage.getItem(KEYS.VEHICLES);
    if (!raw) return VEHICLES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : VEHICLES;
  } catch {
    return VEHICLES;
  }
}

export function saveStoredVehicles(vehicles: Vehicle[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
}

export function getStoredLeads(): ImportLead[] {
  if (typeof window === "undefined") return INITIAL_LEADS;
  try {
    const raw = localStorage.getItem(KEYS.LEADS);
    if (!raw) return INITIAL_LEADS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

export function saveStoredLeads(leads: ImportLead[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
}

export function appendStoredLead(
  lead: Omit<ImportLead, "id" | "status" | "created_at">
): ImportLead {
  const newLead: ImportLead = {
    ...lead,
    id: `lead-${Date.now()}`,
    status: "new",
    created_at: new Date().toISOString(),
  };
  const existing = getStoredLeads();
  saveStoredLeads([newLead, ...existing]);
  return newLead;
}

export function getStoredSettings(): ShowroomSettings {
  if (typeof window === "undefined") return SHOWROOM_SETTINGS;
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) return SHOWROOM_SETTINGS;
    return { ...SHOWROOM_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return SHOWROOM_SETTINGS;
  }
}

export function saveStoredSettings(settings: ShowroomSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEYS.SETTINGS,
    JSON.stringify({ ...settings, updated_at: new Date().toISOString() })
  );
}

/**
 * Client-side image compression before storing/uploading
 * (Resizes to maxWidth 1200px and encodes as JPEG)
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image file"));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
