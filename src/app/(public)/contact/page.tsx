import { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SHOWROOM_SETTINGS } from "@/data/settings";
import { ClipReveal, RevealOnScroll } from "@/components/MotionEffects";

export const metadata: Metadata = {
  title: "Contact & Showroom Location | Haider Cars Lahore",
  description:
    "Visit Haider Cars at Ring Road Service Lane, Adjacent to Main Gate DHA Phase 8, Lahore. Open Monday to Saturday, 10:00 AM – 9:00 PM.",
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${SHOWROOM_SETTINGS.whatsapp_number}?text=${encodeURIComponent(
    "Assalam-o-Alaikum Haider Cars, I would like to visit the showroom or inquire about a vehicle."
  )}`;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-16">
      <div className="border-b border-border pb-6">
        <RevealOnScroll y={10}>
          <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
            Showroom &amp; Consultation Desk
          </div>
        </RevealOnScroll>
        <ClipReveal delay={0.05}>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Contact Haider Cars
          </h1>
        </ClipReveal>
        <RevealOnScroll delay={0.12}>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Visit our DHA Phase 8 showroom in Lahore to inspect ready-stock
            vehicles or sit down with our import specialists for a custom Japan
            auction order.
          </p>
        </RevealOnScroll>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Details Card */}
        <RevealOnScroll
          delay={0.1}
          className="flex flex-col justify-between rounded-[4px] border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/60 sm:p-8 lg:col-span-5"
        >
          <div className="space-y-6">
            <div>
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                01 / Physical Address
              </div>
              <div className="mt-2 flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-ink">
                  {SHOWROOM_SETTINGS.address}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                02 / Operating Hours
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-accent" />
                <p className="font-mono text-xs font-medium tabular-nums text-ink">
                  {SHOWROOM_SETTINGS.hours}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                03 / Primary Phone &amp; WhatsApp
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-semibold tabular-nums text-ink transition-colors hover:text-accent"
                >
                  +92 310 7777844
                </a>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                04 / Official Channels
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={SHOWROOM_SETTINGS.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-[4px] border border-border px-4 py-2 font-mono text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <span>Facebook</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={SHOWROOM_SETTINGS.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-[4px] border border-border px-4 py-2 font-mono text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[4px] bg-accent px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink"
          >
            <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <MessageCircle className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative z-10">
              Message on WhatsApp (+92 310 7777844)
            </span>
          </a>
        </RevealOnScroll>

        {/* Right Map Embed */}
        <RevealOnScroll
          delay={0.18}
          className="overflow-hidden rounded-[4px] border border-border bg-surface transition-colors duration-300 hover:border-accent/60 lg:col-span-7"
        >
          <iframe
            title="Haider Cars DHA Phase 8 Lahore Location"
            src="https://www.google.com/maps?q=Haider+Cars+Ring+Road+Service+Lane+DHA+Phase+8+Lahore&output=embed"
            className="h-full min-h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </RevealOnScroll>
      </div>
    </div>
  );
}
