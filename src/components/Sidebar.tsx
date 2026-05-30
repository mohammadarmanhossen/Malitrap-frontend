"use client";
import { useRouter, usePathname } from 'next/navigation';
import { 
  Inbox as InboxIcon, 
  Building2,
  Send,
  Globe,
  BarChart3,
  ShieldCheck,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Inbox {
  id: string;
  name: string;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [projectsOpen, setProjectsOpen] = useState(true);

  useEffect(() => {
    api.get('/inboxes/').then(res => setInboxes(res.data)).catch(() => {});
  }, []);

  const menuItems = [
    { name: "Home", path: "/home", icon: <Building2 size={16} /> },
    { name: "Sendbox", path: "/sendbox", icon: <Send size={16} /> },
    { name: "API / SMTP", path: "/smtp", icon: <Globe size={16} /> },
    { name: "Marketing", path: "/marketing", icon: <BarChart3 size={16} /> }
  ];

  const generalItems = [
    { name: "Domain", path: "/domain", icon: <Globe size={16} /> },
    { name: "Organization", path: "/organization", icon: <Building2 size={16} /> },
    { name: "Template", path: "/templates", icon: <ShieldCheck size={16} /> },
    { name: "Subscriptions", path: "/subscriptions", icon: <CreditCard size={16} /> },
    { name: "Webhook", path: "/webhooks", icon: <RefreshCw size={16} /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-60 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col p-3 shrink-0 h-full">
      
      {/* MAIN MENU */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase mb-2 px-2">
          Main Menu
        </p>
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors group ${
              isActive(item.path) ? 'bg-[var(--accent-dim)] text-[var(--accent)]' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
            }`}
          >
            <span className={`${isActive(item.path) ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--accent)]'} transition-colors`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </div>

      {/* GENERAL MENU */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase mb-2 px-2">
          General
        </p>
        <div className="space-y-1">
          {generalItems.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors group ${
                isActive(item.path) ? 'bg-[var(--accent-dim)] text-[var(--accent)]' : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
              }`}
            >
              <span className={`${isActive(item.path) ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--accent)]'} transition-colors`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PROJECTS (Simplified for other pages) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-2 mb-2">
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">
            Projects
          </p>
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="text-[10px] px-2 py-1 rounded border hover:bg-[var(--bg-hover)]"
          >
            {projectsOpen ? "Hide" : "Show"}
          </button>
        </div>

        {projectsOpen && (
          <div className="flex-1 overflow-y-auto space-y-1">
            {inboxes.map((inbox) => (
              <div
                key={inbox.id}
                onClick={() => router.push(`/?inbox=${inbox.id}`)}
                className="group p-2 px-2.5 rounded-md cursor-pointer flex items-center gap-2 transition hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border-l-2 border-transparent"
              >
                <InboxIcon size={14} className="flex-shrink-0" />
                <span className="text-sm truncate flex-1">{inbox.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
