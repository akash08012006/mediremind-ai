import { useState, useEffect } from 'react';
import { fakeApi } from '../services/fakeApi';
import { Reminder, Caretaker, DashboardStats } from '../types';
import DashboardStatsCard from '../components/DashboardStatsCard';
import ReminderTable from '../components/ReminderTable';
import { 
  Pill, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  Sparkles,
  Heart,
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';

interface DashboardPageProps {
  userName: string | null;
  userRole: string | null;
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ userName, userRole, onNavigate }: DashboardPageProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, taken: 0, missed: 0, pending: 0 });
  const [caretaker, setCaretaker] = useState<Caretaker | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const allReminders = await fakeApi.getReminders();
      const loadedStats = await fakeApi.getDashboardStats();
      const loadedCaretaker = await fakeApi.getCaretaker();
      setReminders(allReminders);
      setStats(loadedStats);
      setCaretaker(loadedCaretaker);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkTaken = async (id: string) => {
    await fakeApi.updateReminder(id, { status: 'Taken' });
    await loadData();
  };

  const handleMarkMissed = async (id: string) => {
    await fakeApi.updateReminder(id, { status: 'Missed' });
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await fakeApi.deleteReminder(id);
    await loadData();
  };

  const handleEdit = (reminder: Reminder) => {
    // Navigate to Reminders page and trigger editor
    onNavigate('reminders');
  };

  const adherenceRate = stats.total > 0 
    ? Math.round((stats.taken / (stats.total - stats.pending || 1)) * 100) 
    : 100;

  // Pick tip of the day based on local day of week
  const healthTips = [
    { title: 'Stay Hydrated', body: 'Drink 8oz of water when taking oral medications to ensure swift absorption.' },
    { title: 'Consistency is Key', body: 'Try taking maintenance medicines at identical hours daily to optimize serum levels.' },
    { title: 'Meal Alignment', body: 'Pay close attention to before/after food instructions. Certain pills require acidic/fatty stomachs.' },
    { title: 'Report Side Effects', body: 'Log or note any custom dizzy feelings and inform your physician during regular reviews.' }
  ];

  const greetingRole = userRole || 'Patient';
  const greetingName = userName || 'Akash';

  return (
    <div className="space-y-8" id="dashboard-page-root">
      
      {/* 1. Welcoming header & Adherence score banner */}
      <div className="bg-blue-600 rounded-xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden" id="dashboard-hero-banner">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-6 -translate-y-6">
          <Heart className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wide backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              Patient Health Portal
            </div>
            <h1 className="font-sans font-extrabold text-3xl tracking-tight">
              Welcome back, <span className="text-blue-100">{greetingName}</span>
            </h1>
            <p className="text-blue-100/80 text-sm max-w-xl">
              You are signed in as a <span className="font-bold text-white uppercase tracking-wider text-[11px] bg-blue-500/30 px-2 py-0.5 rounded-md">{greetingRole}</span>. Track adherence status, upload medical sheets, or update caretaker credentials below.
            </p>
          </div>

          {/* Adherence Circle metric */}
          <div className="flex items-center gap-4 bg-white/10 p-4.5 rounded-2xl backdrop-blur-xs border border-white/10 w-full md:w-auto">
            <div className="h-14 w-14 rounded-full border-4 border-emerald-400 border-t-transparent flex items-center justify-center font-bold text-lg text-emerald-300">
              {adherenceRate}%
            </div>
            <div>
              <h4 className="font-sans font-bold text-sm text-white">Daily Adherence Rate</h4>
              <p className="text-xs text-blue-200">Excellent dose completion!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        <DashboardStatsCard
          id="stat-total"
          icon={Pill}
          title="Total Medicines"
          value={stats.total}
          subtext="Configured treatment schedule"
          themeColor="blue"
        />
        <DashboardStatsCard
          id="stat-taken"
          icon={CheckCircle}
          title="Taken Medicines"
          value={stats.taken}
          subtext="Marked as taken today"
          themeColor="emerald"
        />
        <DashboardStatsCard
          id="stat-missed"
          icon={AlertTriangle}
          title="Missed Medicines"
          value={stats.missed}
          subtext="Requires caretaker attention"
          themeColor="rose"
        />
        <DashboardStatsCard
          id="stat-pending"
          icon={Clock}
          title="Pending Medicines"
          value={stats.pending}
          subtext="Awaiting dosage time"
          themeColor="amber"
        />
      </div>

      {/* 3. Main Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-main-columns">
        
        {/* Left Column - Today's Reminders (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="font-sans font-extrabold text-slate-900 text-xl tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Today's Medicine Checklist
              </h2>
              <p className="text-slate-500 text-xs">
                Review and update status logs for morning, noon, or evening pills.
              </p>
            </div>

            <button
              id="dash-add-new-reminder-btn"
              onClick={() => onNavigate('reminders')}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500 text-sm">
              Loading active health schedules...
            </div>
          ) : (
            <ReminderTable
              reminders={reminders}
              onMarkTaken={handleMarkTaken}
              onMarkMissed={handleMarkMissed}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Right Column - Sidebar Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Caretaker Status Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs" id="caretaker-sidebar-widget">
            <h3 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-blue-600" /> Caregiver Status
            </h3>
            {caretaker ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Supervisor Name</p>
                  <p className="text-sm font-bold text-slate-800">{caretaker.caretakerName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Alert Phone / Email</p>
                  <p className="text-sm font-bold text-slate-800 break-all">{caretaker.caretakerContact}</p>
                </div>
                <button
                  id="dash-manage-caretaker-btn"
                  onClick={() => onNavigate('caretaker')}
                  className="w-full py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  Configure Supervisor Alerts <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-center py-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  No caretaker alerts configured. Secure family monitoring by registering a phone or email immediately.
                </p>
                <button
                  id="dash-add-caretaker-btn"
                  onClick={() => onNavigate('caretaker')}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  Set Caretaker Profile
                </button>
              </div>
            )}
          </div>

          {/* Quick Health Tips Carousel */}
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-5 space-y-4" id="health-tips-sidebar-widget">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider">
              <Activity className="w-4.5 h-4.5 text-emerald-600" />
              <span>Smart Health Tips</span>
            </div>
            <div className="space-y-4">
              {healthTips.map((tip, idx) => (
                <div key={idx} className="space-y-1 border-l-2 border-emerald-400 pl-3">
                  <h4 className="text-xs font-bold text-slate-800">{tip.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Safety Banner */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 space-y-2 text-left" id="dashboard-safety-alert">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>System Safety Policy</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              This system does not provide medical advice. It only helps users follow their doctor’s prescription. Consult a professional physician for health adjustments.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
