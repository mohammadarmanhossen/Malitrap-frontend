"use client";
import {
  Building2,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Eye,
  ArrowUpRight,
  Info,
  Lock,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function OrganizationPage() {
  const features = [
    {
      icon: <CreditCard size={20} />,
      title: "Centralized billing",
      desc: "One invoice for all accounts under your organization.",
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Per-account tracking",
      desc: "View usage and stats by account.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Account-level isolation",
      desc: "Keep projects, resources, and data strictly separated.",
    },
    {
      icon: <Lock size={20} />,
      title: "Granular access control",
      desc: "Give teammates access only to the accounts they need.",
    },
    {
      icon: <Eye size={20} />,
      title: "Full visibility for admins",
      desc: "Organization admins see and manage all accounts.",
    },
    {
      icon: <Building2 size={20} />,
      title: "Isolated workspaces",
      desc: "Designed for companies managing multiple projects.",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)] px-[30px] py-[40px]">
        <div className="max-w-[1000px] mx-auto">
          
          {/* Header */}
          <header className="mb-8">
            <h1 className="flex items-center gap-3 text-[28px] font-extrabold tracking-tight">
              <Building2 size={28} className="text-[var(--accent)]" />
              Organization
            </h1>
            <p className="text-[15px] text-[var(--text-secondary)] max-w-[700px] leading-relaxed mt-2">
              One invoice, fully isolated workspaces. Designed for companies managing multiple projects.
              Keep your team organized and your billing simple.
            </p>
          </header>

          {/* Promo Card */}
          <div className="relative overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-elevated)] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">

            {/* Glow */}
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              {/* Features */}
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4 items-start p-3">
                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)] shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-1">
                        {f.title}
                      </h3>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <button className="flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[var(--accent)] text-black text-sm font-bold transition-transform duration-200 hover:-translate-y-1">
                  Upgrade to Organization <ArrowUpRight size={16} />
                </button>

                <button className="flex items-center gap-2 px-6 py-3 rounded-[10px] border border-[var(--border-medium)] text-sm font-semibold transition-colors duration-200 hover:bg-[var(--bg-hover)]">
                  Check how it works <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Plan Banner */}
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-white/5 px-5 py-4">
            <Info size={18} className="text-[var(--accent)] shrink-0" />
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
              This feature is available on{" "}
              <strong>
                Business, Enterprise, Business 100K, Business 250K, Business 500K,
                Business 750K, Enterprise 1.5M, or Enterprise 2.5M
              </strong>{" "}
              plans.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}