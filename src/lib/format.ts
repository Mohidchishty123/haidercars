import { VehicleStatus } from "@/types/database";

export function formatPKR(price: number | null, callForPrice: boolean): string {
  if (callForPrice || price === null) {
    return "CALL FOR PRICE";
  }
  return `PKR ${price.toLocaleString("en-PK")}`;
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString("en-PK")} KM`;
}

export function formatEngineCC(cc: number): string {
  return `${cc.toLocaleString("en-PK")} CC`;
}

export function getStatusLabel(status: VehicleStatus): string {
  switch (status) {
    case "in_showroom":
      return "IN SHOWROOM";
    case "in_transit":
      return "IN TRANSIT";
    case "sold":
      return "SOLD";
  }
}

export function buildVehicleWhatsAppUrl(
  whatsappNumber: string,
  year: number,
  title: string
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const message = `Assalam-o-Alaikum Haider Cars, I am interested in the ${year} ${title} listed on your website.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
