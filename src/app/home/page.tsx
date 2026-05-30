import { 
  CheckCircle2, 
  PlayCircle, 
  ChevronDown, 
  X, 
  Settings, 
  Zap,
  ShieldCheck,
  BarChart,
  Server,
  Terminal
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-[#0d1117] text-gray-300 p-8 space-y-8 font-sans custom-scrollbar">
      
      {/* ── TOP ANNOUNCEMENT BANNER ── */}
      <div className="relative bg-gradient-to-r from-[#161b22] to-[#1c2128] border border-white/5 rounded-xl p-6 flex items-center justify-between overflow-hidden shadow-2xl">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase">New</span>
            <h2 className="text-xl font-bold text-white">Save 20% on Email API/SMTP</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">Pay less on live sending for the next 3 months.</p>
          <button className="bg-white text-black px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-all shadow-lg">
            Get Offer
          </button>
        </div>
        <button className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
        <div className="hidden md:block absolute right-10 top-0 bottom-0 w-64 bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN: WORKFLOW & METRICS ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Setup Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
               <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-1 rounded-md mb-2 inline-block border border-blue-400/20">
                    ● Live sending
                  </span>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Get Started with Email API/SMTP</h1>
                  <p className="text-gray-500 text-sm mt-1">Send Transactional Emails</p>
               </div>
               <div className="relative group cursor-pointer border border-white/10 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=250" 
                    className="w-40 h-24 object-cover filter grayscale group-hover:grayscale-0 transition-all" 
                    alt="Guide"
                  />
                  <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-20" size={32} />
               </div>
            </div>

            <div className="space-y-3">
              <StepItem completed title="Create API token for sending" />
              <StepItem completed title="Send a test email" />
              <StepItem 
                active 
                number="3" 
                title="Verify domain" 
                description="Verify your email-sending domain to improve deliverability and trust. Verification can take up to several hours depending on your DNS provider."
              >
                <div className="flex gap-3 mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">
                    Go to Domains
                  </button>
                  <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">View Documentation</button>
                </div>
              </StepItem>
              <StepItem number="4" title="Send a transactional email via API" />
            </div>
          </section>

          {/* New Section: Quick Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <MetricBox icon={<Zap size={16}/>} label="Delivery Rate" value="99.8%" color="text-emerald-400" />
             <MetricBox icon={<ShieldCheck size={16}/>} label="Security" value="Active" color="text-blue-400" />
             <MetricBox icon={<BarChart size={16}/>} label="Daily Limit" value="1,240 / 5,000" color="text-purple-400" />
          </section>

        </div>

        {/* ── RIGHT COLUMN: SIDEBAR UTILS ── */}
        <div className="space-y-6">
          <SideCard title="Migrating from other solution?" icon={<Settings size={16}/>}>
             <p className="text-xs text-gray-500 mb-3">Get a migration guide.</p>
             <div className="relative">
                <select className="w-full bg-[#0d1117] border border-white/10 rounded-md py-2.5 px-3 text-sm text-gray-300 appearance-none outline-none focus:ring-1 ring-blue-500/50">
                   <option>Select provider</option>
                   <option>Mailchimp</option>
                   <option>SendGrid</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={14} />
             </div>
          </SideCard>

          <SideCard title="High inboxing rates">
             <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Built-in deliverability support and infrastructure for reliable inbox placement.
             </p>
             <button className="w-full bg-[#1c2128] border border-white/5 py-2 rounded-md text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors">
                Explore
              </button>
          </SideCard>

          <SideCard title="Service Status" icon={<Server size={14} className="text-emerald-500 animate-pulse"/>}>
             <div className="space-y-3 pt-1">
                <StatusRow label="API Gateway" status="Operational" />
                <StatusRow label="SMTP Server" status="Operational" />
                <StatusRow label="Webhooks" status="Operational" />
             </div>
          </SideCard>
        </div>
      </div>

      {/* ── FOOTER: EMAIL SANDBOX ── */}
      <div className="bg-gradient-to-br from-[#241a06] to-[#1a1405] border border-orange-500/20 rounded-xl p-8 flex items-center justify-between shadow-lg relative overflow-hidden group">
         <div className="z-10">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-400/10 px-2 py-0.5 rounded-full mb-2 inline-block">
              ● Testing
            </span>
            <h2 className="text-2xl font-bold text-white mb-1">Email Sandbox</h2>
            <p className="text-sm text-gray-400">Test email on staging in dev and QA environments.</p>
         </div>
         <div className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20 group-hover:scale-110 transition-transform duration-500">
            <Terminal className="text-orange-500" size={40} />
         </div>
         {/* Decoration */}
         <div className="absolute right-0 bottom-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full" />
      </div>

       <section className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest ml-1">Promotional</h3>
        
        <div className="bg-[#161b22] border border-white/5 rounded-xl overflow-hidden shadow-xl">
          {/* Green Header Banner */}
          <div className="bg-gradient-to-r from-[#062016] to-[#0d1117] p-8 flex justify-between items-center border-b border-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Email Marketing</h2>
              <p className="text-sm text-gray-400 mt-1">Deliver newsletters, promos, and all types of marketing emails.</p>
            </div>
            <div className="bg-[#10b981]/10 p-4 rounded-2xl border border-[#10b981]/20">
              <BarChart className="text-[#10b981]" size={32} />
            </div>
          </div>

          {/* Marketing Sub-Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
            
            {/* Campaigns */}
            <div className="p-8 space-y-4 hover:bg-white/[0.02] transition-colors">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Campaigns</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Send emails to your audience.</p>
              </div>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-md text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                Get Started
              </button>
            </div>

            {/* Contacts */}
            <div className="p-8 space-y-4 hover:bg-white/[0.02] transition-colors">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Contacts</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Manage your contacts in one place.</p>
              </div>
              <button className="bg-[#1c2128] border border-white/10 text-gray-300 px-5 py-2 rounded-md text-xs font-bold hover:bg-white/5 transition-all">
                Explore
              </button>
            </div>

            {/* Templates */}
            <div className="p-8 space-y-4 hover:bg-white/[0.02] transition-colors">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Templates</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Create and manage reusable emails.</p>
              </div>
              <button className="bg-[#1c2128] border border-white/10 text-gray-300 px-5 py-2 rounded-md text-xs font-bold hover:bg-white/5 transition-all">
                Explore
              </button>
            </div>

          </div>
        </div>
      </section>

      </div>
    </div>
  );
}

// ── REUSABLE UI COMPONENTS ──

interface StepItemProps {
  title: string;
  description?: string;
  completed?: boolean;
  active?: boolean;
  number?: string;
  children?: React.ReactNode;
}

function StepItem({ title, description, completed, active, number, children }: StepItemProps) {
  return (
    <div className={`border rounded-xl p-5 transition-all duration-300 ${active ? 'bg-[#161b22] border-blue-500/30 shadow-lg' : 'bg-transparent border-white/5'}`}>
      <div className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-4">
          {completed ? (
            <div className="bg-emerald-500/20 p-1 rounded-full">
              <CheckCircle2 className="text-emerald-500" size={18} />
            </div>
          ) : (
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-bold ${active ? 'border-blue-500 text-blue-500' : 'border-gray-700 text-gray-600'}`}>
              {number}
            </div>
          )}
          <span className={`text-sm font-bold tracking-tight ${completed ? 'text-gray-400' : active ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
            {title}
          </span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 ${active ? 'rotate-180 text-blue-500' : 'text-gray-600'}`} />
      </div>
      {active && (
        <div className="ml-10 mt-3 animate-in fade-in slide-in-from-top-1">
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl font-medium">{description}</p>
          {children}
        </div>
      )}
    </div>
  );
}

interface SideCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function SideCard({ title, icon, children }: SideCardProps) {
  return (
    <div className="bg-[#161b22] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">{title}</h3>
        <span className="text-gray-500">{icon}</span>
      </div>
      {children}
    </div>
  );
}

interface MetricBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function MetricBox({ icon, label, value, color }: MetricBoxProps) {
  return (
    <div className="bg-[#161b22] border border-white/5 rounded-xl p-4 flex items-center gap-4">
       <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
       <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</p>
          <p className={`text-lg font-bold ${color}`}>{value}</p>
       </div>
    </div>
  );
}

function StatusRow({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-500 font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-gray-300 font-bold">{status}</span>
      </div>
    </div>
  );
}