import { Metadata } from "next";
import { VEHICLES } from "@/data/vehicles";
import { formatPKR } from "@/lib/format";
import { VehicleDetailView } from "@/components/VehicleDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === slug);

  if (!vehicle) {
    return {
      title: "Vehicle Specification | Haider Cars Lahore",
    };
  }

  const priceText = formatPKR(vehicle.price_pkr, vehicle.call_for_price);
  return {
    title: `${vehicle.title} (${priceText}) | Haider Cars Lahore`,
    description: `${vehicle.year} ${vehicle.make} ${vehicle.model} • ${vehicle.mileage_km.toLocaleString()} KM • ${vehicle.engine_cc} CC${vehicle.auction_grade ? ` • Grade ${vehicle.auction_grade}` : ""}. Available at Haider Cars DHA Phase 8, Lahore.`,
    openGraph: {
      title: `${vehicle.title} — ${priceText}`,
      description: `Inspect full specs and verified Japanese auction sheet at Haider Cars DHA Phase 8, Lahore.`,
      images: vehicle.images[0] ? [{ url: vehicle.images[0] }] : undefined,
    },
  };
}

export function generateStaticParams() {
  return VEHICLES.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = VEHICLES.find((v) => v.slug === slug) ?? null;

  return <VehicleDetailView slug={slug} initialVehicle={vehicle} />;
}
