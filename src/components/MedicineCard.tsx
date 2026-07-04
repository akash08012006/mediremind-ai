import React from 'react';
import { Pill, Clock, Calendar, CheckSquare } from 'lucide-react';

interface MedicineCardProps {
  key?: any;
  id: string;
  medicineName: string;
  dosage: string;
  time: string;
  foodInstruction: 'Before food' | 'After food';
  duration: string;
}

export default function MedicineCard({ id, medicineName, dosage, time, foodInstruction, duration }: MedicineCardProps) {
  return (
    <div
      id={id}
      className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex justify-between items-center hover:border-blue-200 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 bg-blue-100/60 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
          <Pill className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{medicineName}</p>
          <p className="text-xs text-slate-500 font-semibold tracking-tight uppercase mt-0.5 truncate">
            {dosage} • {time} • {foodInstruction}
          </p>
        </div>
      </div>
      <span className="text-xs font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-md flex-shrink-0 ml-3">
        {duration}
      </span>
    </div>
  );
}
