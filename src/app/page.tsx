"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
// import "./globals.css";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
  Inbox as InboxIcon, 
  Trash2, 
  Search, 
  Paperclip, 
  Settings, 
  Code, 
  X, 
  Plus,
  Building2,
  Send,
  Globe,
  BarChart3,
  ShieldCheck,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';


interface Inbox {
  id: string;
  name: string;
  email_address: string;
  smtp_username?: string;
  smtp_password?: string;
}

interface Attachment {
  id: string;
  filename: string;
  content_type: string;
  size: number;
}

interface Email {
  id: string;
  sender: string;
  subject: string;
  body_text: string;
  body_html: string;
  received_at: string;
  attachments: Attachment[];
}

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [selectedInbox, setSelectedInbox] = useState<Inbox | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'HTML' | 'HTML_SOURCE' | 'TEXT' | 'RAW'>('HTML');
  const [projectsOpen, setProjectsOpen] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    api.get('/inboxes/').then(res => {
      setInboxes(res.data);
      if (res.data.length > 0) {
        setSelectedInbox(res.data[0]);
      }
    }).catch(err => console.error(err));
  }, [isAuthenticated, isLoading, router]);

  const fetchEmails = useCallback(() => {
    if (!selectedInbox) return;
    api.get(`/emails/?inbox=${selectedInbox.id}`).then(res => {
      setEmails(res.data);
    }).catch(err => console.error(err));
  }, [selectedInbox]);

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, [fetchEmails]);

  const handleDelete = async (id: string) => {
    await api.delete(`/emails/${id}/`);
    fetchEmails();
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  const handleClearInbox = async () => {
    if (!selectedInbox) return;
    if (!confirm('Are you sure you want to clear all emails in this inbox?')) return;
    await api.delete(`/inboxes/${selectedInbox.id}/clear/`);
    fetchEmails();
    setSelectedEmail(null);
  };

  const openCreateModal = () => {
    setModalName('');
    setModalEmail('');
    setModalError('');
    setShowModal(true);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalError('');
  };

  const deleteInbox = async (e: React.MouseEvent, inboxId: string) => {
    e.stopPropagation(); // don't select the inbox
    if (!confirm('Delete this inbox and all its emails? This cannot be undone.')) return;
    try {
      await api.delete(`/inboxes/${inboxId}/`);
      setInboxes(prev => prev.filter(i => i.id !== inboxId));
      if (selectedInbox?.id === inboxId) {
        setSelectedInbox(null);
        setSelectedEmail(null);
        setEmails([]);
      }
    } catch {
      alert('Failed to delete inbox.');
    }
  };

  const submitCreateInbox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) { setModalError('Inbox name is required.'); return; }
    if (!modalEmail.trim()) { setModalError('Email address is required.'); return; }
    setModalLoading(true);
    setModalError('');
    try {
      const res = await api.post('/inboxes/', { name: modalName.trim(), email_address: modalEmail.trim() });
      setInboxes(prev => [...prev, res.data]);
      setSelectedInbox(res.data);
      closeModal();
    } catch (err: unknown) {
      const errorRes = (err as { response?: { data?: { email_address?: string[], detail?: string } } });
      const msg = errorRes?.response?.data?.email_address?.[0] || errorRes?.response?.data?.detail || 'Failed to create inbox. Check the email address.';
      setModalError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredEmails = emails.filter(e =>
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.sender.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-[calc(100vh-56px)] bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">

      {/* LEFT SIDEBAR */}
      <aside className="w-60 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col p-3">

        {/* MAIN MENU */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase mb-2 px-2">
            Main Menu
          </p>

          {[
            { name: "Home", path: "/home", icon: <Building2 size={16} /> },
            { name: "Sendbox", path: "/sendbox", icon: <Send size={16} /> },
            { name: "API / SMTP", path: "/smtp", icon: <Globe size={16} /> },
            { name: "Marketing", path: "/marketing", icon: <BarChart3 size={16} /> }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-[var(--bg-hover)] flex items-center gap-3 transition-colors group"
            >
              <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
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
            {[
              { name: "Domain", path: "/domain", icon: <Globe size={16} /> },
              { name: "Organization", path: "/organization", icon: <Building2 size={16} /> },
              { name: "Template", path: "/templates", icon: <ShieldCheck size={16} /> },
              { name: "Subscriptions", path: "/subscriptions", icon: <CreditCard size={16} /> },
              { name: "Webhook", path: "/webhooks", icon: <RefreshCw size={16} /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => item.path !== "#" && router.push(item.path)}
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-[var(--bg-hover)] flex items-center gap-3 transition-colors group"
              >
                <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* HEADER */}
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

          {/* ADD BUTTON */}
          <button
            onClick={openCreateModal}
            className="mb-3 w-full text-left p-2 px-2.5 text-sm font-medium text-[var(--accent)] border border-dashed rounded-md hover:bg-[var(--accent-dim)] flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add Project
          </button>

          {/* PROJECT LIST */}
          {projectsOpen && (
            <div className="flex-1 overflow-y-auto space-y-1">
              {inboxes.map((inbox) => {
                const active = selectedInbox?.id === inbox.id;

                return (
                  <div
                    key={inbox.id}
                    onClick={() => {
                      setSelectedInbox(inbox);
                      setSelectedEmail(null);
                    }}
                    className={`group p-2 px-2.5 rounded-md cursor-pointer flex items-center gap-2 transition border-l-2 ${active
                      ? "bg-[var(--accent-dim)] border-[var(--accent)] text-[var(--text-primary)]"
                      : "hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] border-transparent"
                      }`}
                  >
                    <InboxIcon size={14} className="flex-shrink-0" />
                    <span className="text-sm truncate flex-1">{inbox.name}</span>
                    <button
                      onClick={(e) => deleteInbox(e, inbox.id)}
                      title="Delete inbox"
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--danger-dim)] hover:text-[var(--danger)] transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </aside>
      
      {/* MIDDLE COLUMN - Email List */}
      <div className="w-[340px] flex-shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-[var(--border-subtle)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-[var(--radius-md)] py-2 pl-9 pr-4 text-xs focus:border-[var(--accent)] outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="p-10 text-center">
              <InboxIcon className="mx-auto text-[var(--text-muted)] opacity-20 mb-3" size={32} />
              <p className="text-xs text-[var(--text-muted)] font-medium">No emails found</p>
            </div>
          ) : (
            filteredEmails.map((email) => {
              const active = selectedEmail?.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 border-b border-[var(--border-subtle)] cursor-pointer transition-all hover:bg-[var(--bg-hover)] ${active ? 'bg-[var(--bg-elevated)] border-l-4 border-l-[var(--accent)]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-xs font-bold truncate flex-1 ${active ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                      {email.sender}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium ml-2 flex-shrink-0">
                      {format(new Date(email.received_at), 'HH:mm')}
                    </span>
                  </div>
                  <h3 className={`text-xs font-semibold mb-1 truncate ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {email.subject || '(No Subject)'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {email.body_text}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column - Email Content or Settings */}
      <main className="flex-1 flex flex-col bg-[var(--bg-primary)] overflow-hidden">
        {!selectedEmail ? (
          /* Empty State / SMTP Settings */
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-[26px] font-bold text-[var(--text-primary)] mb-1.5 tracking-tight">{selectedInbox?.name}</h1>
                    <p className="text-[var(--text-secondary)] flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                      Ready to receive emails at <strong className="text-[var(--text-primary)]">{selectedInbox?.email_address}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleClearInbox}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold text-[var(--danger)] border border-[var(--danger)] hover:bg-[var(--danger-dim)] transition-colors"
                  >
                    <Trash2 size={13} />
                    Clear Inbox
                  </button>
                </div>

              {/* SMTP Credentials Card */}
              <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] overflow-hidden mb-5">
                <div className="p-3.5 px-5 border-b border-[var(--border-subtle)] flex items-center gap-2">
                  <Settings size={16} className="text-[var(--accent)]" />
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">SMTP Credentials</h2>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Host', value: 'localhost' },
                    { label: 'Port', value: '2525' },
                    { label: 'Username', value: selectedInbox?.smtp_username || '—' },
                    { label: 'Password', value: selectedInbox?.smtp_password || '—' },
                  ].map(item => (
                    <div key={item.label}>
                      <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{item.label}</label>
                      <div className="font-mono text-sm bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-[var(--radius-sm)] p-2 px-3 text-[var(--text-primary)]">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Integrations Card */}
              <div className="bg-[var(--bg-surface)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] overflow-hidden">
                <div className="p-3.5 px-5 border-b border-[var(--border-subtle)] flex items-center gap-2">
                  <Code size={16} className="text-[var(--blue)]" />
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Integrations</h2>
                </div>
                <div className="p-5 flex flex-col gap-6 max-h-[600px] overflow-y-auto">
                  {[
                    {
                      label: 'ASP.NET Core (appsettings.json)',
                      lang: 'json',
                      code: `"EmailSettings": {\n  "Host": "localhost",\n  "Port": 2525,\n  "Username": "${selectedInbox?.smtp_username}",\n  "Password": "${selectedInbox?.smtp_password}"\n}`
                    },
                    {
                      label: 'PHP (PHPMailer)',
                      lang: 'php',
                      code: `$mail->isSMTP();\n$mail->Host = 'localhost';\n$mail->Port = 2525;\n$mail->SMTPAuth = true;\n$mail->Username = '${selectedInbox?.smtp_username}';\n$mail->Password = '${selectedInbox?.smtp_password}';`
                    },
                    {
                      label: 'Laravel (.env)',
                      lang: 'bash',
                      code: `MAIL_MAILER=smtp\nMAIL_HOST=localhost\nMAIL_PORT=2525\nMAIL_USERNAME=${selectedInbox?.smtp_username}\nMAIL_PASSWORD=${selectedInbox?.smtp_password}\nMAIL_ENCRYPTION=null`
                    },
                    {
                      label: 'Python (smtplib)',
                      lang: 'python',
                      code: `import smtplib\nwith smtplib.SMTP("localhost", 2525) as server:\n    server.login("${selectedInbox?.smtp_username}", "${selectedInbox?.smtp_password}")`
                    },
                    {
                      label: 'Ruby on Rails (development.rb)',
                      lang: 'ruby',
                      code: `config.action_mailer.delivery_method = :smtp\nconfig.action_mailer.smtp_settings = {\n  :user_name => '${selectedInbox?.smtp_username}',\n  :password => '${selectedInbox?.smtp_password}',\n  :address => 'localhost',\n  :port => 2525,\n  :authentication => :plain\n}`
                    },
                    {
                      label: 'Go (gomail)',
                      lang: 'go',
                      code: `d := gomail.NewDialer("localhost", 2525, "${selectedInbox?.smtp_username}", "${selectedInbox?.smtp_password}")`
                    },
                    {
                      label: 'Java (Spring Boot)',
                      lang: 'properties',
                      code: `spring.mail.host=localhost\nspring.mail.port=2525\nspring.mail.username=${selectedInbox?.smtp_username}\nspring.mail.password=${selectedInbox?.smtp_password}`
                    },
                    {
                      label: 'Rust (Lettre)',
                      lang: 'rust',
                      code: `let credentials = Credentials::new("${selectedInbox?.smtp_username}".to_string(), "${selectedInbox?.smtp_password}".to_string());\nlet mailer = SmtpTransport::relay("localhost")?.credentials(credentials).port(2525).build();`
                    },
                    {
                      label: 'Symfony (mailer.yaml)',
                      lang: 'yaml',
                      code: `# .env\nMAILER_DSN=smtp://${selectedInbox?.smtp_username}:${selectedInbox?.smtp_password}@localhost:2525`
                    },
                    {
                      label: 'WordPress (functions.php)',
                      lang: 'php',
                      code: `add_action( 'phpmailer_init', function( $phpmailer ) {\n  $phpmailer->isSMTP();\n  $phpmailer->Host = 'localhost';\n  $phpmailer->SMTPAuth = true;\n  $phpmailer->Port = 2525;\n  $phpmailer->Username = '${selectedInbox?.smtp_username}';\n  $phpmailer->Password = '${selectedInbox?.smtp_password}';\n});`
                    }
                  ].map(item => (
                    <div key={item.label} className="group">
                      <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-tight">
                        {item.label}
                      </label>
                      <div className="bg-[#0d1117] rounded-[var(--radius-md)] border border-white/10 relative group-hover:border-[var(--blue)] transition-colors">
                        <button
                          onClick={() => navigator.clipboard.writeText(item.code)}
                          className="absolute top-2 right-2 text-[10px] font-bold uppercase p-1 px-2 rounded bg-[var(--blue)] text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95"
                        >
                          Copy
                        </button>
                        <pre className="p-4 text-[13px] text-[#d4d4d4] font-mono overflow-x-auto m-0 leading-relaxed">
                          {item.code}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Email Content View */
          <>
            {/* Tab bar */}
            <div className="px-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between h-12 flex-shrink-0">
              <div className="flex gap-0.5">
                {(['HTML', 'HTML_SOURCE', 'TEXT', 'RAW'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`p-1 px-3 text-xs font-medium rounded-[var(--radius-sm)] transition-colors ${viewMode === tab
                      ? 'bg-[var(--blue-dim)] text-[var(--blue)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    onClick={() => setViewMode(tab)}
                  >
                    {tab === 'HTML_SOURCE' ? 'HTML Source' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleDelete(selectedEmail.id)}
                className="w-8 h-8 rounded-[var(--radius-sm)] text-[var(--text-muted)] flex items-center justify-center transition-colors hover:bg-[var(--danger-dim)] hover:text-[var(--danger)]"
                title="Delete Email"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Email header */}
            <div className="p-5 px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex-shrink-0">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">{selectedEmail.subject || '(No Subject)'}</h2>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm bg-[var(--bg-elevated)] rounded-[var(--radius-md)] p-3 px-4 border border-[var(--border-subtle)]">
                <div className="text-[var(--text-muted)] font-medium text-right">From</div>
                <div className="text-[var(--text-primary)]">{selectedEmail.sender}</div>
                <div className="text-[var(--text-muted)] font-medium text-right">To</div>
                <div className="text-[var(--text-primary)]">{selectedInbox?.email_address}</div>
                <div className="text-[var(--text-muted)] font-medium text-right">Date</div>
                <div className="text-[var(--text-primary)]">{format(new Date(selectedEmail.received_at), 'PPpp')}</div>
              </div>
            </div>

            {/* Email body */}
            <div className="flex-1 overflow-auto p-4 bg-[var(--bg-primary)]">
              <div className="h-full rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)]">
                {viewMode === 'HTML' && (
                  <iframe
                    srcDoc={selectedEmail.body_html || '<div style="font-family:sans-serif;color:#666;padding:20px;">No HTML content</div>'}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-same-origin"
                  />
                )}
                {viewMode === 'HTML_SOURCE' && (
                  <pre className="p-5 whitespace-pre-wrap text-sm text-[var(--text-primary)] font-mono bg-[var(--bg-elevated)] h-full overflow-auto m-0">
                    {selectedEmail.body_html || 'No HTML content'}
                  </pre>
                )}
                {viewMode === 'TEXT' && (
                  <pre className="p-5 whitespace-pre-wrap text-sm text-[var(--text-primary)] font-mono bg-[var(--bg-surface)] h-full overflow-auto m-0">
                    {selectedEmail.body_text || 'No text content'}
                  </pre>
                )}
                {viewMode === 'RAW' && (
                  <pre className="p-5 whitespace-pre-wrap text-sm text-[var(--text-primary)] font-mono bg-[var(--bg-elevated)] h-full overflow-auto m-0">
                    {selectedEmail.body_text || 'No raw content available'}
                  </pre>
                )}
              </div>
            </div>

            {/* Attachments */}
            {selectedEmail.attachments?.length > 0 && (
              <div className="p-3 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex-shrink-0">
                <h4 className="text-[12px] font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-2.5">
                  <Paperclip size={13} /> Attachments ({selectedEmail.attachments.length})
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedEmail.attachments.map(att => (
                    <div key={att.id} className="border border-[var(--border-medium)] rounded-[var(--radius-md)] p-2 px-3 text-sm flex flex-col bg-[var(--bg-elevated)] cursor-pointer hover:border-[var(--text-muted)] transition-colors w-40">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[var(--text-primary)] mb-0.5" title={att.filename}>{att.filename}</span>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">{(att.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── CREATE INBOX MODAL ─────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              animation: 'modalIn 0.2s ease',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>Create New Inbox</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Set up a new email capture inbox</p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'none', border: '1px solid var(--border-subtle)',
                  cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitCreateInbox}>
              {/* Inbox Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: '7px' }}>
                  Inbox Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={modalName}
                  onChange={e => setModalName(e.target.value)}
                  placeholder="e.g. My Test Inbox"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                />
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: '7px' }}>
                  Email Address
                </label>
                <input
                  type="text"
                  value={modalEmail}
                  onChange={e => setModalEmail(e.target.value)}
                  placeholder="e.g. test@mailtrap.local"
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Must be unique. Used to route captured emails.
                </p>
              </div>

              {/* Error */}
              {modalError && (
                <div style={{
                  background: 'var(--danger-dim)', border: '1px solid rgba(240,94,110,0.3)',
                  borderRadius: '8px', padding: '10px 14px',
                  fontSize: '13px', color: 'var(--danger)', marginBottom: '16px',
                }}>
                  {modalError}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1, padding: '10px',
                    background: 'none',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    flex: 2, padding: '10px',
                    background: 'linear-gradient(135deg, #25c77a 0%, #1db86e 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px', fontWeight: 600,
                    cursor: modalLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    opacity: modalLoading ? 0.7 : 1,
                    boxShadow: '0 2px 8px rgba(37,199,122,0.3)',
                    transition: 'opacity 0.15s, transform 0.15s',
                  }}
                  onMouseEnter={e => { if (!modalLoading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  {modalLoading ? 'Creating…' : 'Create Inbox'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}