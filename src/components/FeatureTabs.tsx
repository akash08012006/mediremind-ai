import { FileScan, CalendarClock, UserCheck } from 'lucide-react';

interface FeatureTabsProps {
  activeTab: 'ocr' | 'schedule' | 'caretaker';
  onChange: (tab: 'ocr' | 'schedule' | 'caretaker') => void;
}

export default function FeatureTabs({ activeTab, onChange }: FeatureTabsProps) {
  const tabs = [
    {
      id: 'ocr' as const,
      label: 'OCR Demo',
      icon: FileScan,
      description: 'AI Extract Scan',
    },
    {
      id: 'schedule' as const,
      label: 'Reminder Scheduling',
      icon: CalendarClock,
      description: 'Prescription Tracking',
    },
    {
      id: 'caretaker' as const,
      label: 'Caretaker Alerts',
      icon: UserCheck,
      description: 'Adherence Monitoring',
    },
  ];

  return (
    <div className="w-full flex justify-center" id="feature-tabs-wrapper">
      {/* Tab Button container */}
      <div className="flex gap-2 p-1 bg-slate-200/50 w-fit rounded-full shrink-0 border border-slate-200/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
