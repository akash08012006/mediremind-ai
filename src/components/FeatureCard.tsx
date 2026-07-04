import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  key?: any;
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export default function FeatureCard({ icon: Icon, title, description, badge }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 flex flex-col justify-between" id={`feature-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="space-y-4">
        {/* Icon frame */}
        <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        
        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
            {title}
            {badge && (
              <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {badge}
              </span>
            )}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
