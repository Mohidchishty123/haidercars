"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@haidercars.pk");
  const [password, setPassword] = useState("haider1234");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    // Frontend-only demo gate (accepts demo credentials or any non-empty staff test login)
    if (
      email.trim().toLowerCase() === "admin@haidercars.pk" &&
      password !== "haider1234"
    ) {
      setError("Incorrect demo password. Use haider1234.");
      return;
    }

    setAdminAuthenticated(true);
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-admin-bg px-4 py-12 text-[#141517]">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-[#686661] hover:text-[#141517]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Showroom</span>
        </Link>

        <div className="rounded-[4px] border border-admin-border bg-admin-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-admin-border pb-4">
            <div>
              <div className="font-display text-lg font-bold uppercase tracking-widest text-[#141517]">
                HAIDER CARS
              </div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-[#686661]">
                Showroom Staff Admin Portal
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-admin-border bg-admin-bg text-[#141517]">
              <Lock className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-4 rounded-[4px] border border-admin-border bg-admin-bg px-3.5 py-2.5 font-mono text-[11px] text-[#686661]">
            <span className="font-semibold text-[#141517]">Demo Mode:</span>{" "}
            admin@haidercars.pk / haider1234
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
              >
                Staff Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-[4px] border border-admin-border bg-admin-surface px-3.5 py-2.5 text-sm text-[#141517] focus:border-[#141517] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686661]"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-[4px] border border-admin-border bg-admin-surface px-3.5 py-2.5 font-mono text-sm text-[#141517] focus:border-[#141517] focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-[4px] border border-[#B8332A]/30 bg-[#B8332A]/10 px-3 py-2 text-xs font-medium text-[#B8332A]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-[4px] bg-[#141517] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#B8332A]"
            >
              Sign In to Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
