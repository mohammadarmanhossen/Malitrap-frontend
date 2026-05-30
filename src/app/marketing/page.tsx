import { Megaphone, Mail, BarChart3, Plus, ArrowUpRight } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

interface MarketingCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  stat: string;
  trend: string;
}

const MarketingCard = ({ title, description, icon: Icon, stat, trend }: MarketingCardProps) => (
  <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group cursor-pointer shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
    </div>
    
    <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-400 mb-6 leading-relaxed">{description}</p>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
      <span className="text-2xl font-mono font-bold text-white">{stat}</span>
      <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
        {trend}
      </span>
    </div>
  </div>
);

export default function MarketingPage() {
  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8 bg-[#0f141d] text-gray-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Marketing Hub</h1>
          <p className="text-gray-400 mt-1">Manage and track your internship outreach programs.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MarketingCard 
          title="Campaigns" 
          description="Active internship recruitment drives and university partnerships."
          icon={Megaphone}
          stat="12"
          trend="+2 this month"
        />
        
        <MarketingCard 
          title="Email Templates" 
          description="Standardized outreach emails for student onboarding and feedback."
          icon={Mail}
          stat="48"
          trend="8 new"
        />
        
        <MarketingCard 
          title="Analytics" 
          description="Track open rates, click-throughs, and conversion of internship leads."
          icon={BarChart3}
          stat="84%"
          trend="+12% ROI"
        />
      </div>

      {/* Quick Summary / Activity Section */}
      <div className="mt-10 bg-[#111827] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Recent Outreach Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <p className="text-sm text-gray-300">New batch of &quot;Summer Internship 2026&quot; emails sent.</p>
              </div>
              <span className="text-xs text-gray-500 italic">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
