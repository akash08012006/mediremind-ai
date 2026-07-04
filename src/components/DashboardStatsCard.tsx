import { LucideIcon } from 'lucide-react';

interface DashboardStatsCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  value: number | string;
  subtext: string;
  themeColor: 'blue' | 'emerald' | 'rose' | 'amber';
}

export default function DashboardStatsCard({ id, icon: Icon, title, value, subtext, themeColor }: DashboardStatsCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      border: 'border-blue-100',
      textAccent: 'text-blue-700',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-100',
      textAccent: 'text-emerald-700',
    },
    rose: {
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      border: 'border-rose-100',
      textAccent: 'text-rose-700',
    },
    amber: {
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      border: 'border-amber-100',
      textAccent: 'text-amber-700',
    },
  };

  const selectedColors = colorMap[themeColor];

  return (
    <div
      id={id}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight block">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-extrabold tracking-tight ${
            themeColor === 'rose' ? 'text-red-500' : themeColor === 'emerald' ? 'text-green-600' : themeColor === 'blue' ? 'text-blue-600' : 'text-slate-800'
          }`}>
            {typeof value === 'number' && value < 10 ? `0${value}` : value}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          {subtext}
        </p>
      </div>

      {/* Decorative Icon Circle */}
      <div className={`h-11 w-11 rounded-lg ${selectedColors.bg} ${selectedColors.iconColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
