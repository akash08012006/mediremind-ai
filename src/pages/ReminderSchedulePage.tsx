import React, { useState, useEffect, FormEvent } from 'react';
import { fakeApi } from '../services/fakeApi';
import { Reminder } from '../types';
import ReminderTable from '../components/ReminderTable';
import { Pill, Plus, X, Calendar, Clock, Edit3, Trash2, Check, Sparkles } from 'lucide-react';

export default function ReminderSchedulePage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor form toggle states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form values state
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [foodInstruction, setFoodInstruction] = useState<'Before food' | 'After food'>('After food');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState<Reminder['status']>('Pending');
  const [feedback, setFeedback] = useState('');

  const loadReminders = async () => {
    setLoading(true);
    const data = await fakeApi.getReminders();
    setReminders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleMarkTaken = async (id: string) => {
    await fakeApi.updateReminder(id, { status: 'Taken' });
    await loadReminders();
  };

  const handleMarkMissed = async (id: string) => {
    await fakeApi.updateReminder(id, { status: 'Missed' });
    await loadReminders();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await fakeApi.deleteReminder(id);
      await loadReminders();
    }
  };

  const handleEditInit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setMedName(reminder.medicineName);
    setDosage(reminder.dosage);
    setTime(reminder.time);
    setFoodInstruction(reminder.foodInstruction);
    setDuration(reminder.duration);
    setStatus(reminder.status);
    setShowForm(true);
    
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !dosage.trim() || !time.trim() || !duration.trim()) {
      alert('Please fill out all medication parameters.');
      return;
    }

    if (editingId) {
      // Update action
      await fakeApi.updateReminder(editingId, {
        medicineName: medName,
        dosage,
        time,
        foodInstruction,
        duration,
        status
      });
      setFeedback('Medication reminder details updated!');
    } else {
      // Create action
      await fakeApi.addReminder({
        medicineName: medName,
        dosage,
        time,
        foodInstruction,
        duration,
        status: 'Pending'
      });
      setFeedback('New medicine reminder generated successfully!');
    }

    // Reset Form
    resetFormState();
    await loadReminders();
    setTimeout(() => setFeedback(''), 2000);
  };

  const resetFormState = () => {
    setEditingId(null);
    setMedName('');
    setDosage('');
    setTime('');
    setFoodInstruction('After food');
    setDuration('');
    setStatus('Pending');
    setShowForm(false);
  };

  return (
    <div className="space-y-8" id="schedule-page-root">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="font-sans font-extrabold text-slate-900 text-3xl tracking-tight">
            Prescription Reminder Schedules
          </h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Update medicine adherence indicators, modify duration frequencies, or introduce new prescriptions to your log.
          </p>
        </div>

        {!showForm && (
          <button
            id="schedule-new-btn"
            onClick={() => setShowForm(true)}
            className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Reminder
          </button>
        )}
      </div>

      {/* Interactive feedback toast banner */}
      {feedback && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          {feedback}
        </div>
      )}

      {/* Editor/Adder Form Drawer (Only shows when triggered) */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg space-y-6" id="schedule-creation-form">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="font-sans font-bold text-slate-900 text-base flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-600" />
              {editingId ? 'Edit Medicine Reminder parameters' : 'Formulate New Medicine Reminder'}
            </h3>
            <button
              onClick={resetFormState}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Med Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Medicine Name
              </label>
              <input
                type="text"
                id="form-med-name"
                placeholder="e.g. Paracetamol 500mg, Atorvastatin..."
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white"
                required
              />
            </div>

            {/* Dosage */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Dosage Guidelines
              </label>
              <input
                type="text"
                id="form-med-dosage"
                placeholder="e.g. 1 tablet, 2 drops, 10ml liquid"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white"
                required
              />
            </div>

            {/* Timing */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Alert Timing (Clock/Intervals)
              </label>
              <input
                type="text"
                id="form-med-time"
                placeholder="e.g. 8:00 AM, Night Only, Every 8 Hours"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Treatment Duration Calendar
              </label>
              <input
                type="text"
                id="form-med-duration"
                placeholder="e.g. 5 days, 3 weeks, Ongoing"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white"
                required
              />
            </div>

            {/* Food Instruction */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Food Guidelines
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Before food', 'After food'] as const).map((instr) => (
                  <button
                    key={instr}
                    type="button"
                    onClick={() => setFoodInstruction(instr)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      foodInstruction === instr
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {instr}
                  </button>
                ))}
              </div>
            </div>

            {/* Status (Only available during edit) */}
            {editingId && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Medication Adherence Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Reminder['status'])}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white font-semibold text-slate-800"
                >
                  <option value="Pending">Pending</option>
                  <option value="Taken">Taken</option>
                  <option value="Missed">Missed</option>
                </select>
              </div>
            )}

            <div className="md:col-span-2 pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={resetFormState}
                className="px-5 py-2.5 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                id="form-submit-btn"
                className="px-6 py-2.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs cursor-pointer shadow-xs"
              >
                {editingId ? 'Update Reminder' : 'Create Reminder'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main List Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
          Loading medication reminder catalogs...
        </div>
      ) : (
        <ReminderTable
          reminders={reminders}
          onMarkTaken={handleMarkTaken}
          onMarkMissed={handleMarkMissed}
          onEdit={handleEditInit}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}
