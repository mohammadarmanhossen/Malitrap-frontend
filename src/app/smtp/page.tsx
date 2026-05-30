"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  Server,
  ShieldCheck,
  Activity,
  Lock,
  Code,
  Check,
  Copy,
  ChevronDown,
  Inbox as InboxIcon,
  RefreshCw,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

interface Inbox {
  id: string;
  name: string;
  email_address: string;
  smtp_username?: string;
  smtp_password?: string;
}

export default function SmtpPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [selectedInbox, setSelectedInbox] = useState<Inbox | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.push("/login");

    api.get("/inboxes/").then((res) => {
      setInboxes(res.data);
      if (res.data.length > 0) setSelectedInbox(res.data[0]);
    });
  }, [isAuthenticated, isLoading]);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-wrap justify-between items-end mb-6 gap-3">
            <div>
              <h1 className="text-2xl font-bold">API / SMTP</h1>
              <p className="text-sm text-gray-500">
                Use credentials to send emails from your app.
              </p>
            </div>

            {/* Inbox dropdown */}
            {inboxes.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow-sm text-sm"
                >
                  <InboxIcon size={14} className="text-green-500" />
                  {selectedInbox?.name}
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg p-1">
                    {inboxes.map((inbox) => (
                      <button
                        key={inbox.id}
                        onClick={() => {
                          setSelectedInbox(inbox);
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        {inbox.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* EMPTY STATE */}
          {inboxes.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <InboxIcon size={40} className="mx-auto opacity-30" />
              <p className="mt-3">No inboxes found</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 bg-green-100 text-green-600 rounded"
              >
                Go Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">

                {/* SMTP CARD */}
                <div className="bg-white border rounded-xl shadow-sm">
                  <div className="flex items-center justify-between px-5 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Server size={16} className="text-blue-500" />
                      <span className="font-semibold text-sm">SMTP Credentials</span>
                    </div>
                  </div>

                  <div className="p-5 grid grid-cols-2 gap-4 text-sm">

                    {[
                      ["Host", "localhost"],
                      ["Port", "2525"],
                      ["Username", selectedInbox?.smtp_username],
                      ["Password", showPassword ? selectedInbox?.smtp_password : "••••••••••••"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400 uppercase">{label}</p>
                        <div className="flex justify-between items-center bg-gray-50 border rounded px-3 py-2 mt-1">
                          <code className="text-blue-600 text-xs truncate">
                            {value}
                          </code>
                          {label === "Password" && (
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-xs text-gray-500"
                            >
                              {showPassword ? "Hide" : "Show"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SNIPPETS */}
                <div className="bg-white border rounded-xl shadow-sm">
                  <div className="px-5 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code size={16} className="text-green-500" />
                      <span className="font-semibold text-sm">Integration</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {["Node.js", "Python", "PHP"].map((lang) => (
                      <div key={lang}>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-bold uppercase text-gray-500">
                            {lang}
                          </span>
                          <button
                            onClick={() => handleCopy(lang, lang)}
                            className="text-xs text-blue-500"
                          >
                            {copied === lang ? "Copied" : "Copy"}
                          </button>
                        </div>

                        <pre className="bg-gray-900 text-green-300 p-3 rounded text-xs overflow-x-auto">
                          {`// ${lang} SMTP config`}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="space-y-4">

                <div className="bg-white border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={14} className="text-blue-500" />
                    <span className="font-semibold text-sm">Server Status</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p>Host: localhost</p>
                    <p>Port: 2525</p>
                    <p>TLS: Disabled</p>
                    <p className="text-green-600 font-medium">Running</p>
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span className="text-sm font-semibold">Security</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Never expose credentials in frontend code.
                  </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={14} className="text-yellow-500" />
                    <span className="text-sm font-semibold">Access</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Each inbox has unique credentials.
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}