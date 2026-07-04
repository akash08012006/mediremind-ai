import { Reminder } from '../types';
import { Check, X, Edit, Trash2, Pill, Clock, Calendar, AlertCircle } from 'lucide-react';

interface ReminderTableProps {
  reminders: Reminder[];
  onMarkTaken: (id: string) => void;
  onMarkMissed: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export default function ReminderTable({
  reminders,
  onMarkTaken,
  onMarkMissed,
  onEdit,
  onDelete,
}: ReminderTableProps) {
  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3" id="reminder-empty-state">
        <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Pill className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="font-sans font-bold text-slate-800 text-base">No active medicine reminders</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Create new reminders manually or extract details from a prescription upload to populate your treatment schedule.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: Reminder['status']) => {
    switch (status) {
      case 'Taken':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-green-100 text-green-700">
            <Check className="w-3 h-3" /> Taken
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" /> Missed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4" id="reminder-table-container">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-tight">Medicine</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-tight">Dosage</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-tight">Schedule Time</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-tight">Food Guideline</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-tight">Duration</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-tight">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-tight">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reminders.map((reminder) => (
              <tr key={reminder.id} id={`reminder-row-${reminder.id}`} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Pill className="w-4 h-4" />
                    </div>
                    <span className="font-sans font-bold text-slate-900 text-sm">
                      {reminder.medicineName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4.5 text-sm text-slate-600 font-medium">
                  {reminder.dosage}
                </td>
                <td className="px-6 py-4.5 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {reminder.time}
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                    reminder.foodInstruction === 'After food'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-indigo-50 text-indigo-800'
                  }`}>
                    {reminder.foodInstruction}
                  </span>
                </td>
                <td className="px-6 py-4.5 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {reminder.duration}
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  {getStatusBadge(reminder.status)}
                </td>
                <td className="px-6 py-4.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {reminder.status !== 'Taken' && (
                      <button
                        onClick={() => onMarkTaken(reminder.id)}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Mark as Taken"
                        id={`action-take-${reminder.id}`}
                      >
                        <Check className="w-4.5 h-4.5" />
                      </button>
                    )}
                    {reminder.status !== 'Missed' && (
                      <button
                        onClick={() => onMarkMissed(reminder.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Mark as Missed"
                        id={`action-miss-${reminder.id}`}
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(reminder)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Details"
                      id={`action-edit-${reminder.id}`}
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => onDelete(reminder.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Reminder"
                      id={`action-delete-${reminder.id}`}
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet List View */}
      <div className="lg:hidden space-y-3" id="reminder-mobile-list">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            id={`reminder-card-${reminder.id}`}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-slate-900 text-sm">
                    {reminder.medicineName}
                  </h4>
                  <p className="text-xs text-slate-500">{reminder.dosage}</p>
                </div>
              </div>
              {getStatusBadge(reminder.status)}
            </div>

            {/* Timing, Food, Duration Info */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time: {reminder.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Days: {reminder.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 border-t border-slate-200/60 pt-2">
                <span className="font-medium">Guideline:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  reminder.foodInstruction === 'After food'
                    ? 'bg-amber-100 text-amber-950'
                    : 'bg-indigo-100 text-indigo-950'
                }`}>
                  {reminder.foodInstruction}
                </span>
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => onEdit(reminder)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => onDelete(reminder.id)}
                className="px-3 py-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              {reminder.status !== 'Taken' && (
                <button
                  onClick={() => onMarkTaken(reminder.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Taken
                </button>
              )}
              {reminder.status !== 'Missed' && (
                <button
                  onClick={() => onMarkMissed(reminder.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Missed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
