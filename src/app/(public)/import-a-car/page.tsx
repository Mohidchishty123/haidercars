import { Metadata } from "next";
import { CustomImportForm } from "@/components/CustomImportForm";

export const metadata: Metadata = {
  title: "Import a Car From Japan | Haider Cars Lahore",
  description:
    "Step-by-step transparent Japanese vehicle sourcing, auction bidding, sea freight, and Karachi customs clearance delivered to DHA Phase 8, Lahore.",
};

const TRANSPARENCY_POINTS = [
  {
    code: "01",
    title: "Live Japanese Auction Access",
    detail:
      "We bid directly on USS, TAA, and HAA auctions in Japan based on your exact grade, mileage, and color criteria.",
  },
  {
    code: "02",
    title: "Original Auction Sheet Verification",
    detail:
      "Every candidate vehicle's inspection sheet is translated and verified before a single rupee is committed.",
  },
  {
    code: "03",
    title: "End-to-End Freight & Port Clearance",
    detail:
      "We manage Japanese export certificates, sea freight, Karachi Port customs assessment, and carrier transport to Lahore.",
  },
  {
    code: "04",
    title: "DHA Phase 8 Showroom Handover",
    detail:
      "Inspect your imported vehicle in person at our Ring Road showroom with complete import and auction documentation.",
  },
];

export default function ImportACarPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-16">
      <div className="border-b border-border pb-6">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
          Custom Vehicle Sourcing
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
          Import Your Desired Vehicle Through Us
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          From Tokyo auction lanes to our DHA Phase 8 showroom in Lahore —
          complete transparency on auction grade, landed cost, and delivery
          timelines.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left: Transparent Import Breakdown */}
        <div className="space-y-4 lg:col-span-6">
          <div className="divide-y divide-border rounded-[4px] border border-border bg-surface">
            {TRANSPARENCY_POINTS.map((item) => (
              <div key={item.code} className="p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-semibold tabular-nums text-accent">
                    {item.code}
                  </span>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    {item.title}
                  </h2>
                </div>
                <p className="mt-2 pl-7 text-sm leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[4px] border border-border bg-surface p-5">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
              Typical Transit Window
            </div>
            <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
              6 – 8 Weeks (Japan Port to Lahore Showroom)
            </div>
          </div>
        </div>

        {/* Right: Custom Import Request Form */}
        <div className="lg:col-span-6">
          <CustomImportForm />
        </div>
      </div>
    </div>
  );
}
