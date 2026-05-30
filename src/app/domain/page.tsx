"use client";
import { useState, useCallback } from "react";
import {
  Globe, Plus, X, Copy, Check, RefreshCw, ShieldCheck,
  AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronRight,
  Trash2, Send, ExternalLink, Info,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

/* ─── Types ─────────────────────────────────────────── */
type RecordStatus = "verified" | "missing" | "checking";
type DomainStatus = "verified" | "unverified" | "partial";

interface DnsRecord {
  id: string;
  type: "CNAME" | "TXT";
  purpose: string;
  name: string;
  value: string;
  status: RecordStatus;
}

interface Domain {
  id: string;
  name: string;
  status: DomainStatus;
  addedAt: string;
  records: DnsRecord[];
  expanded: boolean;
}

/* ─── Helpers ───────────────────────────────────────── */
function makeDnsRecords(domain: string): DnsRecord[] {
  return [
    {
      id: "verification",
      type: "CNAME",
      purpose: "Domain Verification",
      name: `mailtrap._domainkey.${domain}`,
      value: `dkim.mailtrap.io`,
      status: "missing",
    },
    {
      id: "dkim",
      type: "CNAME",
      purpose: "DKIM",
      name: `mt1._domainkey.${domain}`,
      value: `dkim.mt1.mailtrap.io`,
      status: "missing",
    },
    {
      id: "dmarc",
      type: "TXT",
      purpose: "DMARC",
      name: `_dmarc.${domain}`,
      value: `v=DMARC1; p=none;`,
      status: "missing",
    },
    {
      id: "tracking",
      type: "CNAME",
      purpose: "Domain Tracking",
      name: `track.${domain}`,
      value: `track.mailtrap.io`,
      status: "missing",
    },
  ];
}

function statusColor(s: RecordStatus | DomainStatus) {
  if (s === "verified") return "text-emerald-500";
  if (s === "missing" || s === "unverified") return "text-red-500";
  return "text-amber-500";
}

function statusBg(s: RecordStatus | DomainStatus) {
  if (s === "verified") return "bg-emerald-500/10";
  if (s === "missing" || s === "unverified") return "bg-red-500/10";
  return "bg-amber-500/10";
}

function statusLabel(s: RecordStatus | DomainStatus) {
  if (s === "verified") return "Verified";
  if (s === "missing" || s === "unverified") return "Not Verified";
  if (s === "partial") return "Partial";
  return "Checking…";
}

function StatusBadge({ s }: { s: RecordStatus | DomainStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border ${statusBg(s)} ${statusColor(
        s
      )}`}
    >
      {s === "verified" && <CheckCircle2 size={11} />}
      {(s === "missing" || s === "unverified") && <AlertTriangle size={11} />}
      {(s === "checking" || s === "partial") && <Clock size={11} />}
      {statusLabel(s)}
    </span>
  );
}

/* ─── Page ─────────────────────────────────────────── */
export default function DomainPage() {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: "1",
      name: "example.com",
      status: "unverified",
      addedAt: "2026-05-01",
      expanded: true,
      records: makeDnsRecords("example.com"),
    },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [addError, setAddError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [checking, setChecking] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<string | null>(null);
  const [instrEmail, setInstrEmail] = useState("");

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const toggleExpand = (id: string) => {
    setDomains(ds =>
      ds.map(d => (d.id === id ? { ...d, expanded: !d.expanded } : d))
    );
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newDomain.trim().toLowerCase();

    if (!val) return setAddError("Please enter a domain name.");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(val))
      return setAddError("Enter a valid domain.");
    if (domains.find(d => d.name === val))
      return setAddError("Domain already exists.");

    setDomains(ds => [
      ...ds,
      {
        id: Date.now().toString(),
        name: val,
        status: "unverified",
        addedAt: new Date().toISOString().slice(0, 10),
        expanded: true,
        records: makeDnsRecords(val),
      },
    ]);

    setNewDomain("");
    setAddError("");
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this domain?")) return;
    setDomains(ds => ds.filter(d => d.id !== id));
  };

  const handleRecheck = (domainId: string) => {
    setChecking(domainId);

    setDomains(ds =>
      ds.map(d =>
        d.id === domainId
          ? {
              ...d,
              records: d.records.map(r => ({
                ...r,
                status: "checking",
              })),
            }
          : d
      )
    );

    setTimeout(() => {
      setDomains(ds =>
        ds.map(d => {
          if (d.id !== domainId) return d;

          const updated = d.records.map(r => ({
            ...r,
            status: Math.random() > 0.5 ? "verified" : "missing",
          }));

          const allOk = updated.every(r => r.status === "verified");

          return {
            ...d,
            records: updated,
            status: allOk ? "verified" : "unverified",
          };
        })
      );
      setChecking(null);
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Globe className="text-[var(--accent)]" />
                Sending Domains
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Add and verify your domains.
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
            >
              <Plus size={14} /> Add Domain
            </button>
          </div>

          {/* Domains */}
          {domains.map(domain => (
            <div key={domain.id} className="mb-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">

              {/* Header */}
              <div
                onClick={() => toggleExpand(domain.id)}
                className="flex items-center gap-3 p-4 cursor-pointer border-b border-[var(--border-subtle)]"
              >
                {domain.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Globe size={16} className="text-[var(--accent)]" />

                <span className="flex-1 font-semibold">{domain.name}</span>

                <StatusBadge s={domain.status} />

                <button
                  onClick={(e) => { e.stopPropagation(); handleRecheck(domain.id); }}
                  className="text-xs px-3 py-1 rounded bg-blue-500/10 text-blue-400"
                >
                  {checking === domain.id ? "Checking..." : "Re-check"}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(domain.id); }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Records */}
              {domain.expanded && (
                <div className="p-4 space-y-2">
                  {domain.records.map(rec => (
                    <div
                      key={rec.id}
                      className="grid grid-cols-5 gap-2 text-sm items-center"
                    >
                      <span>{rec.purpose}</span>
                      <span className="text-xs font-mono">{rec.type}</span>

                      <div
                        onClick={() => handleCopy(rec.name, rec.id + "n")}
                        className="cursor-pointer bg-[var(--bg-elevated)] p-2 rounded"
                      >
                        {rec.name}
                      </div>

                      <div
                        onClick={() => handleCopy(rec.value, rec.id + "v")}
                        className="cursor-pointer bg-[var(--bg-elevated)] p-2 rounded"
                      >
                        {rec.value}
                      </div>

                      <StatusBadge s={rec.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-[var(--bg-elevated)] p-6 rounded-xl w-[420px]">
            <h2 className="text-lg font-bold mb-3">Add Domain</h2>

            <form onSubmit={handleAddDomain} className="space-y-3">
              <input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full p-2 rounded bg-[var(--bg-surface)] border"
                placeholder="yourdomain.com"
              />

              {addError && (
                <p className="text-red-500 text-xs">{addError}</p>
              )}

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border p-2 rounded">
                  Cancel
                </button>
                <button className="flex-1 bg-emerald-500 text-white rounded p-2">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
