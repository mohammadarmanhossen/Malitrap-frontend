"use client";

import React from "react";
import { 
  Check
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function SubscriptionsPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for personal projects",
      features: ["500 emails / month", "1 Inbox", "7 days retention"],
      current: true
    },
    {
      name: "Individual",
      price: "$14.99",
      desc: "Best for freelance developers",
      features: ["5,000 emails / month", "5 Inboxes", "30 days retention"],
      popular: true
    },
  ];

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)] p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
              Plans & Subscriptions
            </h1>
            <p className="text-[var(--text-secondary)]">Manage your billing and choose the plan that fits your needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map(plan => (
              <div key={plan.name} className={`relative bg-[var(--bg-surface)] border rounded-2xl p-8 flex flex-col ${
                plan.popular ? 'border-[var(--accent)] shadow-2xl' : 'border-[var(--border-subtle)]'
              }`}>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{plan.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-[var(--text-primary)]">{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)]">/ month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <Check className="text-[var(--accent)] mt-0.5" size={16} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  plan.current 
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-muted)]' 
                    : 'bg-[var(--accent)] text-black'
                }`}>
                  {plan.current ? 'Current Plan' : 'Upgrade Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
