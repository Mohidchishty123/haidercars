"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Car, ExternalLink, Inbox, LogOut, Settings } from "lucide-react";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminStore";

const ADMIN_TABS = [
  { label: "Vehicles", href: "/admin", icon: Car },
  { label: "Import Leads", href: "/admin/leads", icon: Inbox },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  function handleLogout() {
    setAdminAuthenticated(false);
    router.push("/admin/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg font-mono text-xs text-[#686661]">
        Verifying showroom staff session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-bg text-[#141517]">
      {/* High-Contrast Daylight Utility Top Bar */}
      <header className="sticky top-0 z-30 border-b border-admin-border bg-admin-surface">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display text-base font-bold uppercase tracking-widest text-[#141517]">
                HAIDER CARS
              </span>
              <span className="rounded-[4px] border border-admin-border bg-admin-bg px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#686661]">
                ADMIN
              </span>
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-[4px] border border-admin-border px-2.5 py-1.5 font-mono text-[11px] font-medium text-[#141517]"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Site</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out"
                className="inline-flex items-center justify-center rounded-[4px] border border-admin-border p-1.5 text-[#686661] hover:text-[#141517]"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Simple 3-Tab Navigation */}
          <nav
            aria-label="Admin tabs"
            className="flex items-center gap-1 overflow-x-auto"
          >
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                tab.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-[4px] border px-3.5 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-[#141517] bg-[#141517] text-white"
                      : "border-transparent text-[#686661] hover:border-admin-border hover:bg-admin-bg hover:text-[#141517]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-admin-border bg-admin-surface px-3 py-1.5 font-mono text-xs font-medium text-[#141517] transition-colors hover:border-[#141517]"
            >
              <span>View Showroom</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-admin-border bg-admin-bg px-3 py-1.5 font-mono text-xs font-medium text-[#686661] transition-colors hover:border-[#141517] hover:text-[#141517]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </main>
    </div>
  );
}
