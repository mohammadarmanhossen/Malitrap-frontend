"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { format } from "date-fns";
import {
  Inbox as InboxIcon, Plus, Trash2, Search, X, Send,
  Paperclip, ChevronDown, RefreshCw, Mail,
  AlertCircle, CheckCircle,
} from "lucide-react";

interface Inbox {
  id: string;
  name: string;
  email_address: string;
  smtp_username?: string;
  smtp_password?: string;
}

interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body_text: string;
  body_html: string;
  received_at: string;
  attachments: { id: string; filename: string; size: number }[];
}

export default function SendboxPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [selectedInbox, setSelectedInbox] = useState<Inbox | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"HTML" | "TEXT" | "RAW">("HTML");
  const [compose, setCompose] = useState(false);
  const [sending, setSending] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null);
  const [inboxDrop, setInboxDrop] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.push("/login");

    api.get("/inboxes/")
      .then(r => {
        setInboxes(r.data);
        if (r.data.length > 0) setSelectedInbox(r.data[0]);
      })
      .catch(console.error);
  }, [isAuthenticated, isLoading]);

  const fetchEmails = useCallback(() => {
    if (!selectedInbox) return;
    api.get(`/emails/?inbox=${selectedInbox.id}`)
      .then(r => setEmails(r.data))
      .catch(console.error);
  }, [selectedInbox]);

  useEffect(() => {
    fetchEmails();
    const t = setInterval(fetchEmails, 5000);
    return () => clearInterval(t);
  }, [fetchEmails]);

  const filtered = emails.filter(e =>
    e.subject?.toLowerCase().includes(search.toLowerCase()) ||
    e.sender?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-[calc(100vh-56px)] bg-gray-950 text-white overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-[220px] bg-gray-900 border-r border-gray-800 p-3 flex flex-col gap-2">
        <p className="text-[10px] uppercase text-gray-400 font-bold px-2">Inboxes</p>

        <div ref={dropRef} className="relative">
          <button
            onClick={() => setInboxDrop(!inboxDrop)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
          >
            <span className="flex items-center gap-2">
              <InboxIcon size={14} className="text-green-400" />
              {selectedInbox?.name || "Select inbox"}
            </span>
            <ChevronDown size={14} />
          </button>

          {inboxDrop && (
            <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg p-1 z-50">
              {inboxes.map(inbox => (
                <button
                  key={inbox.id}
                  onClick={() => {
                    setSelectedInbox(inbox);
                    setInboxDrop(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded"
                >
                  {inbox.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setCompose(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-500 text-green-400 bg-green-500/10 text-sm"
        >
          <Plus size={14} /> Compose
        </button>

        <div className="flex-1" />

        <button
          onClick={() => router.push("/smtp")}
          className="text-sm text-gray-400 hover:text-white"
        >
          API / SMTP Settings
        </button>
      </aside>

      {/* EMAIL LIST */}
      <div className="w-[320px] bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">
              {selectedInbox?.name || "No inbox"}
            </span>
            <button onClick={fetchEmails}>
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
            <Search size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search emails..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        <div className="overflow-auto flex-1">
          {filtered.map(email => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className="p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
            >
              <p className="text-sm font-medium">{email.sender}</p>
              <p className="text-xs text-gray-400 truncate">{email.subject}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW */}
      <main className="flex-1 flex flex-col">
        {!selectedEmail ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <Mail size={40} className="opacity-20" />
            <p>Select an email</p>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-gray-800 flex justify-between">
              <h2 className="font-bold">{selectedEmail.subject}</h2>
              <button onClick={() => setSelectedEmail(null)}>
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              {viewMode === "HTML" ? (
                <iframe
                  className="w-full h-full bg-white"
                  srcDoc={selectedEmail.body_html}
                />
              ) : (
                <pre className="text-sm whitespace-pre-wrap">
                  {selectedEmail.body_text}
                </pre>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}