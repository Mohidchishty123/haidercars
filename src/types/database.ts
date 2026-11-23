export type VehicleCategory = "imported" | "used";
export type VehicleStatus = "in_showroom" | "in_transit" | "sold";
export type LeadStatus = "new" | "contacted" | "closed";

export interface Vehicle {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  status: VehicleStatus;
  price_pkr: number | null;
  call_for_price: boolean;
  mileage_km: number;
  engine_cc: number;
  transmission: string;
  fuel_type: string;
  color: string;
  registration_city: string;
  auction_grade: string | null;
  auction_sheet_url: string | null;
  images: string[];
  video_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportLead {
  id: string;
  customer_name: string;
  whatsapp_number: string;
  desired_car: string;
  preferred_year: string;
  preferred_grade: string;
  budget_pkr: string;
  notes: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface ShowroomSettings {
  id: number;
  whatsapp_number: string;
  display_phone: string;
  address: string;
  hours: string;
  facebook_url: string;
  instagram_url: string;
  updated_at: string;
}
