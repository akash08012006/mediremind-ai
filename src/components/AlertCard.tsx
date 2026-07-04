import React from 'react';
import { CaretakerAlert } from '../types';
import { AlertTriangle, Clock, Trash2 } from 'lucide-react';

interface AlertCardProps {
  key?: any;
  alert: CaretakerAlert;
  onDeleteAlert?: (id: string) => void;
}

export default function AlertCard({ alert, onDeleteAlert }: AlertCardProps) {
  const formattedTime = new Date(alert.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      id={`alert-card-${alert.id}`}
      className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start justify-between relative overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200"
    >
      <div className="flex gap-3.5 items-start">
        {/* Animated warning pulse circle */}
        <div className="p-2.5 bg-red-100 text-red-700 rounded-xl flex-shrink-0 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h4 className="font-sans font-bold text-red-950 text-sm leading-snug">
            {alert.message}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-red-700 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Today, {formattedTime}</span>
          </div>
        </div>
      </div>

      {onDeleteAlert && (
        <button
          onClick={() => onDeleteAlert(alert.id)}
          className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-100/50 transition-colors flex-shrink-0 cursor-pointer"
          title="Dismiss Alert"
          id={`dismiss-alert-${alert.id}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
