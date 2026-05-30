"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

interface Template {
  id: string;
  name: string;
  category: string;
  lastModified: string;
  version: string;
  status: 'published' | 'draft';
}

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  
  const templates: Template[] = [
    { id: "1", name: "Welcome Email - v2", category: "Onboarding", lastModified: "2 hours ago", version: "2.1.0", status: 'published' },
    { id: "2", name: "Password Reset Link", category: "Security", lastModified: "Yesterday", version: "1.0.4", status: 'published' },
  ];

  const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <ShieldCheck className="text-[var(--accent)]" size={24} />
                Email Templates
              </h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Manage and version your responsive email templates.</p>
            </div>
            <button className="flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-lg">
              <Plus size={18} />
              Create Template
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input 
                type="text" 
                placeholder="Search templates..."
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-[var(--accent)] outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
              <Filter size={16} />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <div key={t.id} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--accent)] transition-all group shadow-sm hover:shadow-xl">
                <div className="h-40 bg-[var(--bg-elevated)] flex items-center justify-center relative">
                  <div className="w-24 h-32 bg-white/5 border border-white/10 rounded shadow-inner flex flex-col gap-2 p-2 overflow-hidden opacity-40 group-hover:opacity-60 transition-opacity">
                    <div className="h-2 w-full bg-white/20 rounded" />
                    <div className="h-1 w-3/4 bg-white/10 rounded" />
                    <div className="h-10 w-full bg-white/5 rounded" />
                    <div className="h-1 w-full bg-white/10 rounded" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      t.status === 'published' ? 'bg-[var(--accent-dim)] text-[var(--accent)]' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">{t.version}</span>
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1 truncate">{t.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mb-4">{t.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
