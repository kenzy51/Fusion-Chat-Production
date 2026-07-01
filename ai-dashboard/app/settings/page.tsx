// frontend/app/settings/page.tsx
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, User, Check, Loader2, ExternalLink } from "lucide-react";
import { BASE_URL } from "@/app/login/page";

// 🎯 HELPER: Safely extract a cookie value by its key name
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const getToken = (): string | null =>
  getCookie("access_token") ||
  (typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null);

type TabKey = "billing" | "account";

const TABS: { key: TabKey; label: string; icon: typeof CreditCard }[] = [
  { key: "billing", label: "Billing & Plan", icon: CreditCard },
  { key: "account", label: "Account", icon: User },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("billing");

  return (
    <div className="p-6 space-y-6 bg-[#0a0a0a] min-h-screen text-white font-sans antialiased">
      <div className="flex flex-col gap-1 border-b border-white/5 pb-5">
        <h2 className="text-xl font-black tracking-tight uppercase italic text-white">
          Workspace Settings
        </h2>
        <p className="text-zinc-500 text-xs font-medium">
          Manage your subscription, billing details and workspace preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-4xl">
        {/* TAB RAIL */}
        <nav className="flex md:flex-col gap-2 md:w-56 shrink-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors w-full text-left ${
                  isActive
                    ? "bg-[#1a1a1a] text-zinc-100 border border-white/10"
                    : "text-zinc-400 hover:bg-[#151515] border border-transparent"
                }`}
              >
                <tab.icon
                  className={`h-4 w-4 ${isActive ? "text-[#d4ff33]" : ""}`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB CONTENT */}
        <div className="flex-1 min-w-0">
          {activeTab === "billing" ? <BillingPanel /> : <AccountPanel />}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── BILLING PANEL ───────────────────────── */

interface BillingState {
  status?: string; // active | trialing | canceled | past_due | none
  plan?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

const PRO_FEATURES = [
  "Unlimited conversational sessions",
  "Real-time AI response streaming",
  "Multi-tenant lead capture & analytics",
  "Embeddable widget on unlimited domains",
  "Priority support",
];

function BillingPanel() {
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/tenant/billing`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 404) return { status: "none" }; // no billing record yet
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load billing.");
        return data;
      })
      .then((data) => setBilling(data.data || data))
      .catch((err) => {
        console.error("Billing fetch failure:", err);
        setBilling({ status: "none" });
      })
      .finally(() => setLoading(false));
  }, []);

  const isSubscribed =
    billing?.status === "active" || billing?.status === "trialing";

  const handleSubscribe = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Please sign in again to manage billing.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/tenant/billing/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "pro_monthly" }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.message || "Could not start checkout session.");
      }
      // 🚀 Redirect to Stripe-hosted checkout.
      window.location.href = data.url;
    } catch (err: unknown) {
      console.error("Checkout session failure:", err);
      toast.error(
        err instanceof Error ? err.message : "Unable to start checkout.",
      );
      setActionLoading(false);
    }
  };

  const handleManage = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Please sign in again to manage billing.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/tenant/billing/portal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.message || "Could not open billing portal.");
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      console.error("Billing portal failure:", err);
      toast.error(
        err instanceof Error ? err.message : "Unable to open billing portal.",
      );
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-zinc-500 font-mono text-xs tracking-widest flex items-center gap-2 py-16 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" /> LOADING BILLING PROFILE...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* CURRENT STATUS */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black font-mono">
              Current Plan
            </p>
            <h3 className="text-lg font-black tracking-tight text-white">
              {isSubscribed ? "Pro — $20/month" : "Free / Not Subscribed"}
            </h3>
            {isSubscribed && billing?.currentPeriodEnd && (
              <p className="text-xs text-zinc-400 font-medium">
                {billing.cancelAtPeriodEnd ? "Cancels" : "Renews"} on{" "}
                {new Date(billing.currentPeriodEnd).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </p>
            )}
          </div>
          <StatusBadge status={billing?.status || "none"} />
        </div>
      </div>

      {/* PRO PLAN CARD */}
      <div className="relative bg-zinc-900/40 backdrop-blur-md border border-[#d4ff33]/20 rounded-3xl p-6 shadow-xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#d4ff33]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[9px] bg-[#d4ff33] text-black px-3 py-1 rounded-full uppercase tracking-widest font-black font-mono">
              Pro
            </span>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="text-4xl font-black tracking-tighter text-white">
                $20
              </span>
              <span className="text-sm text-zinc-500 font-medium">/month</span>
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Everything you need to run Fusion AI in production.
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {PRO_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2.5 text-sm text-zinc-300 font-medium"
            >
              <span className="w-4 h-4 rounded-full bg-[#d4ff33]/15 flex items-center justify-center shrink-0">
                <Check className="h-2.5 w-2.5 text-[#d4ff33]" />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {isSubscribed ? (
            <button
              onClick={handleManage}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 hover:border-white/20 text-zinc-100 rounded-2xl py-3 text-sm font-bold transition-colors disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Manage Subscription
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={actionLoading}
              className="flex items-center justify-center gap-2 w-full bg-[#d4ff33] hover:bg-[#c2ee1f] text-black rounded-2xl py-3 text-sm font-black uppercase tracking-wide transition-colors disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Subscribe — $20/month
            </button>
          )}
        </div>

        <p className="text-[10px] text-zinc-600 font-mono text-center mt-3 leading-relaxed">
          Secure payments powered by Stripe. Cancel anytime from the billing
          portal.
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: {
      label: "Active",
      className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    trialing: {
      label: "Trial",
      className: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    },
    past_due: {
      label: "Past Due",
      className: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
    canceled: {
      label: "Canceled",
      className: "bg-red-500/10 border-red-500/20 text-red-400",
    },
    none: {
      label: "Inactive",
      className: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
    },
  };
  const { label, className } = map[status] || map.none;
  return (
    <span
      className={`text-[9px] border px-3 py-1 rounded-full uppercase tracking-widest font-black font-mono ${className}`}
    >
      {label}
    </span>
  );
}

/* ───────────────────────── ACCOUNT PANEL ───────────────────────── */

function AccountPanel() {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl">
      <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black font-mono mb-2">
        Account
      </p>
      <p className="text-sm text-zinc-400 font-medium leading-relaxed">
        Account preferences are managed from the{" "}
        <span className="text-zinc-200 font-semibold">Bot Config</span> section.
        More workspace controls are coming soon.
      </p>
    </div>
  );
}
