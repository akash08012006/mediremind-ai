import React, { useState, useEffect, FormEvent } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import FeatureTabs from '../components/FeatureTabs';
import UploadBox from '../components/UploadBox';
import MedicineCard from '../components/MedicineCard';
import ReminderTable from '../components/ReminderTable';
import AlertCard from '../components/AlertCard';
import { fakeApi } from '../services/fakeApi';
import { Reminder, Caretaker, CaretakerAlert } from '../types';
import { 
  FileScan, 
  CalendarClock, 
  Activity, 
  UserCheck, 
  LayoutDashboard,
  Brain, 
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Hospital,
  Globe,
  Mic,
  Languages,
  PlusCircle,
  Pill,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Bell,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  // Features lists
  const features = [
    {
      icon: FileScan,
      title: 'AI/OCR Prescription Demo',
      description: 'Upload doctor prescriptions or bills to trigger mock OCR intelligence, extracting medicines, dosages, and daily timings instantly.',
      badge: 'Interactive'
    },
    {
      icon: CalendarClock,
      title: 'Medicine Reminder Scheduling',
      description: 'Set custom medication logs with dosages, daily frequencies, food instructions (before/after food), and treatment durations.',
      badge: 'Core'
    },
    {
      icon: Activity,
      title: 'Medicine Status Tracking',
      description: 'Review interactive stats counters and mark logs as Taken or Missed, updating adherence ratings dynamically.',
    },
    {
      icon: UserCheck,
      title: 'Caretaker Missed-Dose Alerts',
      description: 'Automatically alert designated family members or caretakers via mock SMS notifications if a critical dose is flagged as missed.',
      badge: 'Safety'
    },
    {
      icon: LayoutDashboard,
      title: 'Patient Dashboard',
      description: 'Review overall health reports, pending tablets, taken ratios, and caregiver details inside a high-contrast hub.',
    }
  ];

  const steps = [
    { step: '01', title: 'Upload Prescription', desc: 'Drag & drop your doctor prescription scan or key in the medicine details manually.' },
    { step: '02', title: 'OCR Extraction', desc: 'Let our demo AI scan parse instructions, dosages, and duration boundaries with single-click accuracy.' },
    { step: '03', title: 'Create Schedule', desc: 'The app automatically generates structured morning, noon, or night reminder cycles.' },
    { step: '04', title: 'Track Compliance', desc: 'Patient logs medicines as Taken or Missed. Adherence counts populate the dashboard.' },
    { step: '05', title: 'Caretaker Alerted', desc: 'If a medicine is marked as Missed, the caretakers dashboard triggers a critical notification.' }
  ];

  const benefits = [
    { title: 'Reduces Missed Medicines', desc: 'Helps patients follow rigorous dosage durations without forgetting, optimizing treatment outcomes.' },
    { title: 'Empowers Elderly Patients', desc: 'High-contrast displays, descriptive labels, and voice-ready text blocks simplify interactions for seniors.' },
    { title: 'Seamless Prescription Log', desc: 'Avoid confusing paper logs. Maintain all current pill inventories and schedules in a single local app.' },
    { title: 'Real-Time Caretaker Monitoring', desc: 'Provides relatives with peace of mind. Keeps a secondary supervisor connected to treatment adherence.' },
    { title: 'Intuitive Healthcare Interface', desc: 'Elegant, uncluttered cards, crisp typography, and responsive menus built with Tailwind CSS.' }
  ];

  // ----------------------------------------------------------------
  // interactive SANDBOX REGION (SHARED RECT STATE WITH LOCALSTORAGE)
  // ----------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'ocr' | 'schedule' | 'caretaker'>('ocr');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [caretaker, setCaretaker] = useState<Caretaker | null>(null);
  const [alerts, setAlerts] = useState<CaretakerAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Sandboxed Form variables
  const [ocrMeds, setOcrMeds] = useState<any[] | null>(null);
  const [ocrFileMsg, setOcrFileMsg] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);

  // Manual scheduling form variables
  const [formMedName, setFormMedName] = useState('');
  const [formDosage, setFormDosage] = useState('1 tablet');
  const [formTime, setFormTime] = useState('8:00 AM');
  const [formFood, setFormFood] = useState<'Before food' | 'After food'>('After food');
  const [formDuration, setFormDuration] = useState('5 days');
  const [sandboxSuccessMsg, setSandboxSuccessMsg] = useState('');

  // Caretaker form variables
  const [pName, setPName] = useState('');
  const [cName, setCName] = useState('');
  const [cContact, setCContact] = useState('');
  const [caretakerSuccessMsg, setCaretakerSuccessMsg] = useState('');
  const [sendDemoAlertSuccess, setSendDemoAlertSuccess] = useState('');

  const reloadSandboxData = async () => {
    setLoading(true);
    const loadedReminders = await fakeApi.getReminders();
    const loadedCaretaker = await fakeApi.getCaretaker();
    const loadedAlerts = await fakeApi.getMissedAlerts();

    setReminders(loadedReminders);
    setCaretaker(loadedCaretaker);
    setAlerts(loadedAlerts);

    if (loadedCaretaker) {
      setPName(loadedCaretaker.patientName);
      setCName(loadedCaretaker.caretakerName);
      setCContact(loadedCaretaker.caretakerContact);
    }
    setLoading(false);
  };

  useEffect(() => {
    reloadSandboxData();
  }, []);

  // Sandbox OCR Handlers
  const handleOcrFileUpload = (file: { name: string; size: string }) => {
    setOcrFileMsg(`"${file.name}" received in Sandbox! Click the button below to extract details.`);
    setOcrMeds(null);
  };

  const handleSandboxOcrExtract = () => {
    setOcrLoading(true);
    setOcrFileMsg('');
    setTimeout(() => {
      const demoMeds = fakeApi.getOcrDemoData();
      setOcrMeds(demoMeds);
      setOcrLoading(false);
    }, 1000);
  };

  const handleAddOcrToSchedule = async () => {
    if (!ocrMeds) return;
    for (const med of ocrMeds) {
      await fakeApi.addReminder({
        medicineName: med.medicineName,
        dosage: med.dosage,
        time: med.time,
        foodInstruction: med.foodInstruction,
        duration: med.duration,
        status: 'Pending'
      });
    }
    setOcrMeds(null);
    setOcrFileMsg('Success! OCR-extracted medicines merged with your actual treatment schedule.');
    await reloadSandboxData();
  };

  // Sandbox Scheduling Handlers
  const handleSandboxAddMed = async (e: FormEvent) => {
    e.preventDefault();
    if (!formMedName.trim()) return;

    await fakeApi.addReminder({
      medicineName: formMedName,
      dosage: formDosage,
      time: formTime,
      foodInstruction: formFood,
      duration: formDuration,
      status: 'Pending'
    });

    setFormMedName('');
    setSandboxSuccessMsg('Medicine added to schedule!');
    await reloadSandboxData();
    setTimeout(() => setSandboxSuccessMsg(''), 2000);
  };

  const handleSandboxMarkTaken = async (id: string) => {
    await fakeApi.updateReminder(id, { status: 'Taken' });
    await reloadSandboxData();
  };

  const handleSandboxMarkMissed = async (id: string) => {
    await fakeApi.updateReminder(id, { status: 'Missed' });
    await reloadSandboxData();
  };

  const handleSandboxDelete = async (id: string) => {
    await fakeApi.deleteReminder(id);
    await reloadSandboxData();
  };

  // Sandbox Caretaker Handlers
  const handleSandboxCaretakerSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !cName.trim() || !cContact.trim()) return;

    const saved = await fakeApi.saveCaretaker({
      patientName: pName,
      caretakerName: cName,
      caretakerContact: cContact
    });

    setCaretaker(saved);
    setCaretakerSuccessMsg('Caretaker configuration updated!');
    setTimeout(() => setCaretakerSuccessMsg(''), 2000);
    await reloadSandboxData();
  };

  const handleSandboxSendAlert = async () => {
    const activePatientName = caretaker?.patientName || 'Akash';
    const activeCaretakerName = caretaker?.caretakerName || 'Ramesh Kumar';
    const contactInfo = caretaker?.caretakerContact || 'ramesh.kumar@example.com';

    const alertMsg = `Alert: ${activePatientName} missed Paracetamol 500mg at 8:00 PM`;
    await fakeApi.addMissedAlert(activePatientName, alertMsg);
    await reloadSandboxData();

    setSendDemoAlertSuccess(`Demo SMS notification dispatched to caretaker "${activeCaretakerName}" (${contactInfo})!`);
    setTimeout(() => setSendDemoAlertSuccess(''), 3000);
  };

  const handleSandboxDeleteAlert = async (id: string) => {
    await fakeApi.deleteAlert(id);
    await reloadSandboxData();
  };

  return (
    <div className="space-y-20 pb-16" id="landing-page-root">
      
      {/* 1. Hero Section */}
      <HeroSection 
        onGetStarted={() => onNavigate('dashboard')} 
        onUploadClick={() => onNavigate('upload')} 
      />

      {/* 2. Interactive Main Live Feature Tabs Sandbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24" id="live-demo-playground">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Live Sandbox
          </span>
          <h2 className="font-sans font-extrabold text-slate-900 text-3xl sm:text-4xl tracking-tight">
            Try the Live System Sandbox
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Experience the three core workflows of the medical system below. Select a tab to play with the mock engines.
          </p>
        </div>

        {/* The required FeatureTabs Selector Component */}
        <FeatureTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab display sandbox area */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
          
          {/* TAB 1: OCR DEMO */}
          {activeTab === 'ocr' && (
            <div className="space-y-6" id="sandbox-ocr-tab">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
                  <FileScan className="w-5 h-5 text-blue-600" />
                  Prescription OCR Simulator Sandbox
                </h3>
                <p className="text-xs text-slate-500">
                  Select a fake prescription slip, run our mock AI, and add the medicines straight to the treatment database.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <UploadBox onFileUploaded={handleOcrFileUpload} disabled={ocrLoading} />
                  
                  {ocrFileMsg && (
                    <div className="p-3 bg-blue-50 text-blue-800 text-xs font-semibold rounded-xl border border-blue-100">
                      {ocrFileMsg}
                    </div>
                  )}

                  <button
                    id="sandbox-extract-btn"
                    onClick={handleSandboxOcrExtract}
                    disabled={ocrLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {ocrLoading ? 'Scanning Prescription...' : 'Extract Demo Prescription'}
                  </button>
                </div>

                {/* Extracted medicines pane */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Extracted OCR Output Card Panel
                  </span>

                  {ocrMeds ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        {ocrMeds.map((med, idx) => (
                          <MedicineCard
                            key={idx}
                            id={`sandbox-ocr-med-${idx}`}
                            medicineName={med.medicineName}
                            dosage={med.dosage}
                            time={med.time}
                            foodInstruction={med.foodInstruction}
                            duration={med.duration}
                          />
                        ))}
                      </div>

                      <button
                        id="sandbox-add-ocr-schedule-btn"
                        onClick={handleAddOcrToSchedule}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Add Extracted Medicines to Reminder Schedule
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs space-y-2">
                      <p>Awaiting OCR trigger. Click "Extract Demo Prescription" to populate simulated doctor data.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REMINDER SCHEDULING */}
          {activeTab === 'schedule' && (
            <div className="space-y-6" id="sandbox-schedule-tab">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-blue-600" />
                  Medication Scheduling & Database Management
                </h3>
                <p className="text-xs text-slate-500">
                  Update database records. Mark logs as Taken or Missed, insert items, or clear reminders dynamically.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form column (4 cols) */}
                <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="font-sans font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Add Medicine Reminders
                  </h4>

                  {sandboxSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100">
                      ✓ {sandboxSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSandboxAddMed} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Medicine Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Vitamin D3"
                        value={formMedName}
                        onChange={(e) => setFormMedName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Dosage Amount</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 capsule"
                        value={formDosage}
                        onChange={(e) => setFormDosage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Timing</label>
                        <input
                          type="text"
                          placeholder="8:00 AM"
                          value={formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Duration</label>
                        <input
                          type="text"
                          placeholder="10 days"
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Food Instruction</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Before food', 'After food'].map((food) => (
                          <button
                            key={food}
                            type="button"
                            onClick={() => setFormFood(food as any)}
                            className={`py-1.5 text-[11px] font-bold border rounded-lg ${
                              formFood === food 
                                ? 'bg-blue-50 text-blue-700 border-blue-600' 
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            {food}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all mt-1"
                    >
                      Add Reminder Item
                    </button>
                  </form>
                </div>

                {/* Table column (8 cols) */}
                <div className="lg:col-span-8 space-y-3">
                  <h4 className="font-sans font-bold text-slate-900 text-xs uppercase tracking-wide flex justify-between items-center">
                    <span>Active Live Reminder List</span>
                    <span className="text-[10px] text-slate-400 normal-case">Direct state connection</span>
                  </h4>

                  {loading ? (
                    <p className="text-xs text-slate-500">Loading schedules...</p>
                  ) : (
                    <ReminderTable
                      reminders={reminders}
                      onMarkTaken={handleSandboxMarkTaken}
                      onMarkMissed={handleSandboxMarkMissed}
                      onEdit={() => onNavigate('reminders')}
                      onDelete={handleSandboxDelete}
                    />
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CARETAKER ALERTS */}
          {activeTab === 'caretaker' && (
            <div className="space-y-6" id="sandbox-caretaker-tab">
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Caretaker Supervisor Hub & Missed Alert Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Update caretaker coordinates. Test automatic Twilio alerts dispatch simulation using fake triggers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Profile Form card */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="font-sans font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Configure Supervisor Contacts
                  </h4>

                  {caretakerSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100">
                      ✓ {caretakerSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSandboxCaretakerSave} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Patient Name</label>
                      <input
                        type="text"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Supervisor Name</label>
                      <input
                        type="text"
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Supervisor Email/Phone</label>
                      <input
                        type="text"
                        value={cContact}
                        onChange={(e) => setCContact(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Store Supervisor Details
                    </button>
                  </form>
                </div>

                {/* Alerts log panel */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Missed Med alerts list
                    </span>

                    <button
                      type="button"
                      onClick={handleSandboxSendAlert}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" /> Send Demo Alert
                    </button>
                  </div>

                  {sendDemoAlertSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100">
                      ✓ {sendDemoAlertSuccess}
                    </div>
                  )}

                  {alerts.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                      No missed medication alert warnings reported. Try marking a medicine as Missed in the Scheduling tab.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {alerts.map((alert) => (
                        <AlertCard
                          key={alert.id}
                          alert={alert}
                          onDeleteAlert={handleSandboxDeleteAlert}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. Core Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="landing-features">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Key Modules
          </span>
          <h2 className="font-sans font-extrabold text-slate-900 text-3xl sm:text-4xl tracking-tight">
            How MediRemind AI Protects Your Health
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
            Explore the high-fidelity features driving patient safety, treatment follow-through, and connected remote care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <FeatureCard 
              key={index}
              id={`feature-${index}`}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
              badge={feat.badge}
            />
          ))}
        </div>
      </section>

      {/* 4. Interactive How It Works Section */}
      <section className="bg-slate-50 py-16 sm:py-24" id="landing-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-100/50 px-3 py-1 rounded-full">
              System Cycle
            </span>
            <h2 className="font-sans font-extrabold text-slate-900 text-3xl sm:text-4xl tracking-tight">
              A 5-Step Path to Better Recovery
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">
              From uploading your doctor prescription files to caretaker safety check-ins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="space-y-4">
                  <span className="text-4xl font-extrabold text-blue-100 block">
                    {step.step}
                  </span>
                  <h3 className="font-sans font-bold text-slate-900 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="landing-benefits">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Patient Value
          </span>
          <h2 className="font-sans font-extrabold text-slate-900 text-3xl sm:text-4xl tracking-tight">
            Designed for Simplicity and Reliability
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Focusing on what matters most: helping patients get well through secure adherence support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-slate-900 text-base">
                  {benefit.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Future Roadmap Scope Section */}
      <section className="bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-800 text-white py-16 sm:py-24 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="landing-future-scope">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Brain className="w-80 h-80 text-blue-400" />
        </div>

        <div className="relative space-y-12 max-w-4xl">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-800/60 inline-block">
              Roadmap Vision
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
              Future Scope & Expansion Blueprint
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We are expanding MediRemind AI with next-generation tele-health integrations to create a unified medical-reminder environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[
              { icon: Brain, title: 'Real OCR Integration', desc: 'Connect production Google Cloud Vision or Tesseract model nodes for immediate, complex prescription parsing.' },
              { icon: Smartphone, title: 'SMS/WhatsApp reminders', desc: 'Direct alerts powered by Twilio endpoints to bridge notifications for patients without internet access.' },
              { icon: Hospital, title: 'Doctor/Clinic Portal', desc: 'Let physicians upload, revise, or override medical schedules on behalf of patients instantly.' },
              { icon: Users, title: 'Pharmacy Integration', desc: 'Automatic dosage refills and medical checkups connected to local pharmacies.' },
              { icon: Languages, title: 'Regional Languages', desc: 'Access alerts, lists, and audio guidelines in various regional/vernacular languages.' },
              { icon: Mic, title: 'Voice Reminder Guides', desc: 'Interactive audio narration explaining guidelines like "Take immediately after lunch".' }
            ].map((scope, index) => {
              const ScopeIcon = scope.icon;
              return (
                <div key={index} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <ScopeIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans font-bold text-sm text-white">{scope.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{scope.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Medical Safety Disclaimer Section */}
      <section className="max-w-3xl mx-auto px-4" id="landing-safety-alert">
        <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6 sm:p-8 space-y-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-sans font-extrabold text-amber-950 text-lg">
              Critical Safety Disclaimer
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed max-w-2xl mx-auto">
              This system does not provide medical advice. It only helps users follow their doctor’s prescription. Always consult a qualified medical professional, nurse, or physician for any queries concerning medical conditions, dosages, or general wellness.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
