"use client";

import React, { useState } from "react";
import { 
  RefreshCw, 
  Plus, 
  Globe,
  Settings2
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastFired: string;
}

export default function WebhooksPage() {
  const [webhooks] = useState<Webhook[]>([
    { id: "1", url: "https://api.yourdomain.com/webhooks/mailtrap", events: ["email.captured", "domain.verified"], status: 'active', lastFired: "10 mins ago" },
    { id: "2", url: "https://hooks.slack.com/services/T0000/B0000/XXXX", events: ["email.captured"], status: 'inactive', lastFired: "Never" },
  ]);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)] p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <RefreshCw className="text-[var(--accent)]" size={24} />
                Webhooks
              </h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Receive real-time notifications about your account events.</p>
            </div>
            <button className="flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-lg">
              <Plus size={18} />
              Add Endpoint
            </button>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
                         <th className="px-6 py-4 text-[11px] font-black uppercase text-[var(--text-muted)] tracking-widest">Endpoint URL</th>
                         <th className="px-6 py-4 text-[11px] font-black uppercase text-[var(--text-muted)] tracking-widest text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[var(--border-subtle)]">
                      {webhooks.map(w => (
                         <tr key={w.id} className="hover:bg-[var(--bg-hover)] transition-colors group">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <Globe size={14} className="text-[var(--text-muted)]" />
                                  <span className="text-sm font-medium text-[var(--text-primary)] font-mono truncate max-w-xs">{w.url}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className="p-2 hover:bg-[var(--bg-elevated)] rounded-lg text-[var(--text-secondary)]">
                                     <Settings2 size={16} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
