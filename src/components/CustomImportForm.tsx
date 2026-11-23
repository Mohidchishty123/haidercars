"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { SHOWROOM_SETTINGS } from "@/data/settings";
import { appendStoredLead } from "@/lib/adminStore";
import { MECHANICAL_EASE, RevealOnScroll } from "@/components/MotionEffects";

interface FormDataState {
  customerName: string;
  whatsappNumber: string;
  desiredCar: string;
  preferredYear: string;
  preferredGrade: string;
  budgetPkr: string;
  notes: string;
}

const INITIAL_STATE: FormDataState = {
  customerName: "",
  whatsappNumber: "",
  desiredCar: "",
  preferredYear: "2022–2024",
  preferredGrade: "4.5",
  budgetPkr: "",
  notes: "",
};

const GRADE_OPTIONS = [
  { value: "5", label: "Grade 5.0", desc: "Showroom Mint" },
  { value: "4.5", label: "Grade 4.5", desc: "Near Mint" },
  { value: "4", label: "Grade 4.0", desc: "Verified Clean" },
  { value: "3.5", label: "Grade 3.5", desc: "Standard" },
];

export function CustomImportForm() {
  const [form, setForm] = useState<FormDataState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState<FormDataState | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    appendStoredLead({
      customer_name: form.customerName.trim(),
      whatsapp_number: form.whatsappNumber.trim(),
      desired_car: form.desiredCar.trim(),
      preferred_year: form.preferredYear.trim(),
      preferred_grade: form.preferredGrade,
      budget_pkr: form.budgetPkr.trim(),
      notes: form.notes.trim() || null,
    });
    setSubmitted(form);
  }

  function buildWhatsAppLeadUrl(data: FormDataState) {
    const text = [
      `Assalam-o-Alaikum Haider Cars, I would like to request a custom vehicle import:`,
      `• Name: ${data.customerName}`,
      `• WhatsApp: ${data.whatsappNumber}`,
      `• Desired Car: ${data.desiredCar}`,
      `• Preferred Year: ${data.preferredYear}`,
      `• Minimum Grade: ${data.preferredGrade}`,
      `• Target Budget: ${data.budgetPkr}`,
      data.notes ? `• Notes: ${data.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${SHOWROOM_SETTINGS.whatsapp_number}?text=${encodeURIComponent(
      text
    )}`;
  }

  return (
    <RevealOnScroll delay={0.12}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: MECHANICAL_EASE }}
            className="rounded-[4px] border border-accent bg-surface p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 text-ink">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-bold">
                Import Request Logged
              </h2>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Thank you,{" "}
              <span className="font-semibold text-ink">
                {submitted.customerName}
              </span>
              . Our Japan sourcing desk has logged your request for a{" "}
              <span className="font-semibold text-accent">
                {submitted.desiredCar}
              </span>{" "}
              (Grade <span className="font-mono">{submitted.preferredGrade}+</span>
              ).
            </p>

            <div className="mt-5 rounded-[4px] border border-border bg-canvas p-4 font-mono text-xs text-ink">
              <div>YEAR: {submitted.preferredYear}</div>
              <div className="mt-1">BUDGET: {submitted.budgetPkr}</div>
              <div className="mt-1">WHATSAPP: {submitted.whatsappNumber}</div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppLeadUrl(submitted)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-[4px] bg-accent px-5 py-3 text-xs font-bold uppercase tracking-wider text-accent-ink"
              >
                <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <MessageCircle className="relative z-10 h-4 w-4" />
                <span className="relative z-10">
                  Send Details via WhatsApp Now
                </span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setForm(INITIAL_STATE);
                  setSubmitted(null);
                }}
                className="rounded-[4px] border border-border bg-surface-elevated px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-accent"
              >
                Submit Another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: MECHANICAL_EASE }}
            className="rounded-[4px] border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/60 sm:p-8"
          >
            <div className="border-b border-border pb-4">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
                Custom Order Brief
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-ink">
                Request a Custom Vehicle Import
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                  >
                    Customer Name *
                  </label>
                  <input
                    id="customerName"
                    required
                    type="text"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    placeholder="e.g. Ali Raza"
                    className="mt-1.5 w-full rounded-[4px] border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="whatsappNumber"
                    className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                  >
                    WhatsApp Number *
                  </label>
                  <input
                    id="whatsappNumber"
                    required
                    type="tel"
                    value={form.whatsappNumber}
                    onChange={(e) =>
                      setForm({ ...form, whatsappNumber: e.target.value })
                    }
                    placeholder="e.g. 0300 1234567"
                    className="mt-1.5 w-full rounded-[4px] border border-border bg-canvas px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="desiredCar"
                  className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                >
                  Desired Car Make &amp; Model *
                </label>
                <input
                  id="desiredCar"
                  required
                  type="text"
                  value={form.desiredCar}
                  onChange={(e) =>
                    setForm({ ...form, desiredCar: e.target.value })
                  }
                  placeholder="e.g. Honda Vezel e:HEV Z"
                  className="mt-1.5 w-full rounded-[4px] border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="preferredYear"
                    className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                  >
                    Preferred Year *
                  </label>
                  <input
                    id="preferredYear"
                    required
                    type="text"
                    value={form.preferredYear}
                    onChange={(e) =>
                      setForm({ ...form, preferredYear: e.target.value })
                    }
                    placeholder="e.g. 2022–2023"
                    className="mt-1.5 w-full rounded-[4px] border border-border bg-canvas px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="budgetPkr"
                    className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                  >
                    Target Budget in PKR *
                  </label>
                  <input
                    id="budgetPkr"
                    required
                    type="text"
                    value={form.budgetPkr}
                    onChange={(e) =>
                      setForm({ ...form, budgetPkr: e.target.value })
                    }
                    placeholder="e.g. 95 Lac – 1.05 Crore"
                    className="mt-1.5 w-full rounded-[4px] border border-border bg-canvas px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Interactive Auction Grade Selector Pills */}
              <div>
                <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Minimum Japanese Auction Grade
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {GRADE_OPTIONS.map((g) => {
                    const isSelected = form.preferredGrade === g.value;
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, preferredGrade: g.value })
                        }
                        className={`relative rounded-[4px] border px-3 py-2 text-left transition-colors ${
                          isSelected
                            ? "border-accent text-accent-ink"
                            : "border-border bg-canvas text-ink hover:border-accent/60"
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="grade-pill-active"
                            transition={{
                              duration: 0.35,
                              ease: MECHANICAL_EASE,
                            }}
                            className="absolute inset-0 rounded-[3px] bg-accent"
                          />
                        )}
                        <span className="relative z-10 block font-mono text-xs font-bold">
                          {g.label}
                        </span>
                        <span
                          className={`relative z-10 block text-[10px] ${
                            isSelected ? "text-accent-ink/80" : "text-muted"
                          }`}
                        >
                          {g.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                >
                  Additional Notes (Color, Trim, Mileage Cap)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Preferred exterior color, package, or maximum mileage..."
                  className="mt-1.5 w-full rounded-[4px] border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.99 }}
              className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[4px] bg-accent px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-accent-ink"
            >
              <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10">
                Submit Custom Import Request
              </span>
              <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </RevealOnScroll>
  );
}
