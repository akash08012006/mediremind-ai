import React, { useState, useEffect, FormEvent } from 'react';
import { fakeApi } from '../services/fakeApi';
import { Caretaker, CaretakerAlert, Reminder } from '../types';
import AlertCard from '../components/AlertCard';
import { 
  Users, 
  UserPlus, 
  Bell, 
  Send, 
  Smartphone, 
  Mail, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Trash2
} from 'lucide-react';

export default function CaretakerAlertPage() {
  const [caretaker, setCaretaker] = useState<Caretaker | null>(null);
  const [alerts, setAlerts] = useState<CaretakerAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerContact, setCaretakerContact] = useState('');
  
  // Feedback messages states
  const [saveSuccess, setSaveSuccess] = useState('');
  const [alertSentSuccess, setAlertSentSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    const loadedCaretaker = await fakeApi.getCaretaker();
    const loadedAlerts = await fakeApi.getMissedAlerts();
    
    setCaretaker(loadedCaretaker);
    setAlerts(loadedAlerts);

    if (loadedCaretaker) {
      setPatientName(loadedCaretaker.patientName);
      setCaretakerName(loadedCaretaker.caretakerName);
      setCaretakerContact(loadedCaretaker.caretakerContact);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveCaretaker = async (e: FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !caretakerName.trim() || !caretakerContact.trim()) {
      alert('Please fill in all caregiver details.');
      return;
    }

    const saved = await fakeApi.saveCaretaker({
      patientName,
      caretakerName,
      caretakerContact,
    });

    setCaretaker(saved);
    setSaveSuccess('Supervisor details stored successfully!');
    setTimeout(() => setSaveSuccess(''), 2000);
  };

  const handleSendDemoAlert = async () => {
    const pName = caretaker?.patientName || 'Akash';
    const cName = caretaker?.caretakerName || 'Ramesh Kumar';
    const contact = caretaker?.caretakerContact || 'ramesh.kumar@example.com';

    // Formulate a fun text message simulation
    const simulatedMsg = `Alert: ${pName} missed Paracetamol 500mg at 8:00 PM`;
    
    await fakeApi.addMissedAlert(pName, simulatedMsg);
    await loadData();

    setAlertSentSuccess(`Demo alert message dispatched successfully to caretaker ${cName} via (${contact})!`);
    setTimeout(() => setAlertSentSuccess(''), 3500);
  };

  const handleDeleteAlert = async (id: string) => {
    await fakeApi.deleteAlert(id);
    await loadData();
  };

  return (
    <div className="space-y-8" id="caretaker-page-root">
      
      {/* Page description */}
      <div className="space-y-2">
        <h1 className="font-sans font-extrabold text-slate-900 text-3xl tracking-tight">
          Caretaker Connection & Adherence Alerts
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
          Provide family supervisors or medical workers with real-time reassurance. Register your supervisor credentials below to trigger instant warning alerts upon any missed schedule marks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Caregiver configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSaveCaretaker} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4" id="caretaker-config-form">
            <div className="space-y-1">
              <h2 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Configure Caregiver Supervisor
              </h2>
              <p className="text-xs text-slate-500">
                Register contact details of the supervising person below.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100" id="save-feedback">
                ✓ {saveSuccess}
              </div>
            )}

            {/* Patient Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Patient Name
              </label>
              <input
                type="text"
                id="patient-name-input"
                placeholder="e.g. Akash Kumar"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white font-medium text-slate-800"
                required
              />
            </div>

            {/* Caretaker Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Caretaker Name
              </label>
              <input
                type="text"
                id="caretaker-name-input"
                placeholder="e.g. Ramesh Kumar"
                value={caretakerName}
                onChange={(e) => setCaretakerName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white font-medium text-slate-800"
                required
              />
            </div>

            {/* Caretaker Contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Caretaker Contact (Email/Phone)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  id="caretaker-contact-input"
                  placeholder="e.g. ramesh.kumar@example.com or +91 9876543210"
                  value={caretakerContact}
                  onChange={(e) => setCaretakerContact(e.target.value)}
                  className="pl-10 w-full py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/40 focus:bg-white font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="save-caretaker-btn"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Save Caretaker Details
            </button>
          </form>

          {/* Current Saved Caregiver Card */}
          {caretaker && (
            <div className="bg-slate-900 p-5 rounded-xl text-white space-y-4" id="saved-caretaker-card">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                    Active Caregiver Supervisor
                  </span>
                  <h3 className="font-sans font-extrabold text-base text-white">
                    {caretaker.caretakerName}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/20 text-[10px] font-bold uppercase tracking-wider">
                  Linked
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Contact: {caretaker.caretakerContact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Patient Supervised: {caretaker.patientName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Missed Meds Alerts and simulated SMS triggers (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Action triggering simulated SMS alert */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-slate-900 text-base flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-500 animate-bounce" />
                  Real-time Missed Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Trigger or review instant warnings based on missed medicine lists.
                </p>
              </div>

              <button
                type="button"
                id="send-demo-alert-btn"
                onClick={handleSendDemoAlert}
                className="px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send Demo Alert
              </button>
            </div>

            {/* Simulated notification dispatched warning feedback banner */}
            {alertSentSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex gap-2" id="alert-sent-banner">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="leading-relaxed">{alertSentSuccess}</p>
              </div>
            )}

            {/* Alerts List */}
            {alerts.length === 0 ? (
              <div className="text-center py-12 space-y-3" id="alerts-empty-state">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No warnings logged</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Excellent! There are no missed treatment alerts. Mark a medicine as Missed in reminders to generate an automatic alert.
                </p>
              </div>
            ) : (
              <div className="space-y-3" id="alerts-list">
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onDeleteAlert={handleDeleteAlert}
                  />
                ))}
              </div>
            )}

            {/* Note alert */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Demo Supervisor Alerts Simulator:</strong> This section emulates Twilio/WhatsApp notification protocols. Missed medicine triggers automatically send warnings when a patient skips scheduling.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
