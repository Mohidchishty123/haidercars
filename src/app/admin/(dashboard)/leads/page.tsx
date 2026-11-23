"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ImportLead, LeadStatus } from "@/types/database";
import { getStoredLeads, saveStoredLeads } from "@/lib/adminStore";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<ImportLead[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const sorted = [...getStoredLeads()].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setLeads(sorted);
  }, []);

  function handleStatusChange(id: string, status: LeadStatus) {
    const next = leads.map((l) => (l.id === id ? { ...l, status } : l));
    setLeads(next);
    saveStoredLeads(next);
    setToast("Lead status updated");
    setTimeout(() => setToast(null), 2200);
  }

  function buildReplyWhatsAppUrl(lead: ImportLead) {
    const clean = lead.whatsapp_number.replace(/[^0-9]/g, "");
    const message = `Assalam-o-Alaikum ${lead.customer_name}, thank you for reaching out to Haider Cars regarding importing ${lead.desired_car} (${lead.preferred_year}, Grade ${lead.preferred_grade}+). Our team is ready to assist you.`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 border-b border-admin-border pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#141517]">
            Import Leads Inbox
          </h1>
          <p className="mt-1 text-xs text-[#686661]">
            Custom vehicle import requests sorted newest first.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#686661]">
          {toast && (
            <span className="rounded-[4px] bg-[#141517] px-2.5 py-1 text-[11px] text-white">
              {toast}
            </span>
          )}
          <span className="tabular-nums">{leads.length} REQUESTS</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-[4px] border border-admin-border bg-admin-surface p-5"
          >
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-base font-bold text-[#141517]">
                    {lead.customer_name}
                  </h2>
                  <span className="font-mono text-xs font-medium tabular-nums text-[#686661]">
                    {lead.whatsapp_number}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-[#686661]">
                    • {new Date(lead.created_at).toLocaleDateString("en-PK")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#141517]">
                  <span className="font-semibold">{lead.desired_car}</span>
                  <span className="text-[#686661]">
                    YEAR: {lead.preferred_year}
                  </span>
                  <span className="text-[#686661]">
                    GRADE: {lead.preferred_grade}+
                  </span>
                  <span className="font-semibold text-[#B8332A]">
                    BUDGET: {lead.budget_pkr}
                  </span>
                </div>

                {lead.notes && (
                  <p className="text-xs leading-relaxed text-[#686661]">
                    Notes: {lead.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  aria-label={`Lead status for ${lead.customer_name}`}
                  value={lead.status}
                  onChange={(e) =>
                    handleStatusChange(lead.id, e.target.value as LeadStatus)
                  }
                  className="rounded-[4px] border border-admin-border bg-admin-bg px-3 py-2 font-mono text-xs font-medium text-[#141517] focus:border-[#141517] focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>

                <a
                  href={buildReplyWhatsAppUrl(lead)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#141517] px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#B8332A]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Reply on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
