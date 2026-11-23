import { VEHICLES } from "@/data/vehicles";
import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  const featuredVehicles = VEHICLES.filter((v) => v.is_featured).slice(0, 6);

  return <HomeClient featuredVehicles={featuredVehicles} />;
}
