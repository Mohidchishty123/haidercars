"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ShowroomSettings } from "@/types/database";
import { getStoredSettings, saveStoredSettings } from "@/lib/adminStore";
import { SHOWROOM_SETTINGS } from "@/data/settings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ShowroomSettings>(SHOWROOM_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveStoredSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  }

  return (
    <div className="max-w-2xl">
      <div className="border-b border-admin-border pb-5">
        <h1 className="font-display text-2xl font-bold text-[#141517]">
          Showroom Settings
        </h1>
        <p className="mt-1 text-xs text-[#686661]">
          Manage showroom contact phone, WhatsApp number, operating hours, and
          social links.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-[4px] border border-admin-border bg-admin-surface p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="whatsapp-number"
              className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
            >
              WhatsApp Number (Country Code)
            </label>
            <input
              id="whatsapp-number"
              required
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_number: e.target.value })
              }
              className="mt-1.5 w-full rounded-[4px] border border-admin-border px-3.5 py-2 font-mono text-sm tabular-nums focus:border-[#141517] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="display-phone"
              className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
            >
              Display Phone
            </label>
            <input
              id="display-phone"
              required
              type="text"
              value={settings.display_phone}
              onChange={(e) =>
                setSettings({ ...settings, display_phone: e.target.value })
              }
              className="mt-1.5 w-full rounded-[4px] border border-admin-border px-3.5 py-2 font-mono text-sm tabular-nums focus:border-[#141517] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="showroom-address"
            className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
          >
            Showroom Address
          </label>
          <textarea
            id="showroom-address"
            required
            rows={2}
            value={settings.address}
            onChange={(e) =>
              setSettings({ ...settings, address: e.target.value })
            }
            className="mt-1.5 w-full rounded-[4px] border border-admin-border px-3.5 py-2 text-sm focus:border-[#141517] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="operating-hours"
            className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
          >
            Operating Hours
          </label>
          <input
            id="operating-hours"
            required
            type="text"
            value={settings.hours}
            onChange={(e) =>
              setSettings({ ...settings, hours: e.target.value })
            }
            className="mt-1.5 w-full rounded-[4px] border border-admin-border px-3.5 py-2 font-mono text-sm focus:border-[#141517] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="facebook-url"
              className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
            >
              Facebook URL
            </label>
            <input
              id="facebook-url"
              required
              type="url"
              value={settings.facebook_url}
              onChange={(e) =>
                setSettings({ ...settings, facebook_url: e.target.value })
              }
              className="mt-1.5 w-full rounded-[4px] border border-admin-border px-3.5 py-2 font-mono text-xs focus:border-[#141517] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="instagram-url"
              className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
            >
              Instagram URL
            </label>
            <input
              id="instagram-url"
              required
              type="url"
              value={settings.instagram_url}
              onChange={(e) =>
                setSettings({ ...settings, instagram_url: e.target.value })
              }
              className="mt-1.5 w-full rounded-[4px] border border-admin-border px-3.5 py-2 font-mono text-xs focus:border-[#141517] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-admin-border pt-4">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#141517]">
              <CheckCircle2 className="h-4 w-4 text-[#B8332A]" />
              <span>Changes saved</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="rounded-[4px] bg-[#141517] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#B8332A]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
