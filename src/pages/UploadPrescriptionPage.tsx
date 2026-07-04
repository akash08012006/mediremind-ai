import React, { useState, FormEvent } from 'react';
import { fakeApi } from '../services/fakeApi';
import UploadBox from '../components/UploadBox';
import MedicineCard from '../components/MedicineCard';
import { Reminder } from '../types';
import { 
  FileText, 
  Pill, 
  Clock, 
  Sparkles, 
  Calendar, 
  Check, 
  AlertTriangle,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  RefreshCw,
  Star
} from 'lucide-react';

interface UploadPrescriptionPageProps {
  onSuccess: () => void;
}

export default function UploadPrescriptionPage({ onSuccess }: UploadPrescriptionPageProps) {
  // Manual Form States
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 tablet');
  const [time, setTime] = useState('Morning and Night');
  const [foodInstruction, setFoodInstruction] = useState<'Before food' | 'After food'>('After food');
  const [duration, setDuration] = useState('5 days');
  
  // OCR Demo States
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMeds, setExtractedMeds] = useState<any[] | null>(null);
  const [ocrAccuracy, setOcrAccuracy] = useState<{ level: string; score: number; color: string; message: string } | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [manualFormSuccess, setManualFormSuccess] = useState('');

  // Handle Mock File Drop or Click
  const handleFileUploaded = (file: { name: string; size: string }) => {
    setUploadSuccessMsg(`"${file.name}" received successfully! Click "Extract Demo Prescription" to trigger mock OCR AI.`);
    setExtractedMeds(null); // Reset extracted until user triggers OCR
  };

  // Mock OCR trigger
  const handleOcrExtract = () => {
    setIsExtracting(true);
    setUploadSuccessMsg('');
    setExtractedMeds(null);
    setOcrAccuracy(null);
    setTimeout(() => {
      const demoData = fakeApi.getOcrDemoData();
      const accuracy = fakeApi.getOcrAccuracy();
      setExtractedMeds(demoData);
      setOcrAccuracy(accuracy);
      setIsExtracting(false);
    }, 1500);
  };

  // Save extracted OCR to database
  const handleAddExtractedToSchedule = async () => {
    if (!extractedMeds) return;
    
    for (const med of extractedMeds) {
      await fakeApi.addReminder({
        medicineName: med.medicineName,
        dosage: med.dosage,
        time: med.time,
        foodInstruction: med.foodInstruction,
        duration: med.duration,
        status: 'Pending'
      });
    }

    setExtractedMeds(null);
    setUploadSuccessMsg('Success! All extracted medicines have been added to your Reminder Schedule.');
    setTimeout(() => {
      onSuccess(); // redirect to dashboard or reminders list
    }, 1500);
  };

  // Manual Form Submission
  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) {
      alert('Please enter a medicine name.');
      return;
    }

    await fakeApi.addReminder({
      medicineName: medName,
      dosage,
      time,
      foodInstruction,
      duration,
      status: 'Pending'
    });

    // Reset Form
    setMedName('');
    setDosage('1 tablet');
    setTime('Morning and Night');
    setFoodInstruction('After food');
    setDuration('5 days');

    setManualFormSuccess('Medicine added manually to schedule successfully!');
    setTimeout(() => {
      setManualFormSuccess('');
      onSuccess(); // Redirect
    }, 1500);
  };

  return (
    <div className="space-y-8" id="upload-page-root">
      
      {/* Page Title header */}
      <div className="space-y-2">
        <h1 className="font-sans font-extrabold text-slate-900 text-3xl tracking-tight">
          Prescription Intake Management
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
          Initialize your medicine reminder by dragging in a doctor slip scan for instant AI analysis, or enter the medicine parameters manually using the medication log form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - OCR File Scanner (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-1">
              <h2 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
                AI Optical Character Recognition (OCR) Scanner
              </h2>
              <p className="text-xs text-slate-500">
                Simulate standard hospital smart scanning. Upload any medicine slip file or photo to populate schedules.
              </p>
            </div>

            <UploadBox onFileUploaded={handleFileUploaded} disabled={isExtracting} />

            {uploadSuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200" id="upload-feedback-message">
                ✓ {uploadSuccessMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                id="extract-demo-btn"
                onClick={handleOcrExtract}
                disabled={isExtracting}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span className="animate-pulse">AI is analyzing prescription...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Demo Prescription
                  </>
                )}
              </button>
            </div>

            {/* Simulated OCR Extraction Outcomes */}
            {extractedMeds && ocrAccuracy && (
              <div className="space-y-5 pt-4 border-t border-slate-100" id="ocr-extraction-results">
                
                {/* Quality Score Display - Big Animated Tick */}
                <div className={`relative p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 overflow-hidden ${
                  ocrAccuracy.color === 'emerald' ? 'bg-emerald-50 border-emerald-300' :
                  ocrAccuracy.color === 'blue' ? 'bg-blue-50 border-blue-300' :
                  ocrAccuracy.color === 'amber' ? 'bg-amber-50 border-amber-300' :
                  ocrAccuracy.color === 'orange' ? 'bg-orange-50 border-orange-300' :
                  'bg-red-50 border-red-300'
                }`}>
                  {/* Background pattern for excellent */}
                  {ocrAccuracy.level === 'Excellent' && (
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  )}
                  
                  <div className="relative flex items-center gap-4">
                    {/* Animated Tick Circle */}
                    <div className="relative">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                        ocrAccuracy.color === 'emerald' ? 'bg-emerald-100' :
                        ocrAccuracy.color === 'blue' ? 'bg-blue-100' :
                        ocrAccuracy.color === 'amber' ? 'bg-amber-100' :
                        ocrAccuracy.color === 'orange' ? 'bg-orange-100' :
                        'bg-red-100'
                      }`}>
                        {ocrAccuracy.level === 'Excellent' ? (
                          <div className="relative">
                            <Check className={`w-8 h-8 ${
                              ocrAccuracy.color === 'emerald' ? 'text-emerald-600' :
                              ocrAccuracy.color === 'blue' ? 'text-blue-600' :
                              ocrAccuracy.color === 'amber' ? 'text-amber-600' :
                              ocrAccuracy.color === 'orange' ? 'text-orange-600' :
                              'text-red-600'
                            }`} />
                            <div className="absolute -inset-2 rounded-full bg-emerald-400/20 animate-ping" />
                          </div>
                        ) : ocrAccuracy.level === 'Good' ? (
                          <Check className={`w-8 h-8 ${
                            ocrAccuracy.color === 'blue' ? 'text-blue-600' :
                            ocrAccuracy.color === 'emerald' ? 'text-emerald-600' :
                            ocrAccuracy.color === 'amber' ? 'text-amber-600' :
                            ocrAccuracy.color === 'orange' ? 'text-orange-600' :
                            'text-red-600'
                          }`} />
                        ) : ocrAccuracy.level === 'Fair' ? (
                          <AlertTriangle className={`w-8 h-8 ${
                            ocrAccuracy.color === 'amber' ? 'text-amber-600' :
                            ocrAccuracy.color === 'orange' ? 'text-orange-600' :
                            'text-red-600'
                          }`} />
                        ) : ocrAccuracy.level === 'Poor' ? (
                          <AlertTriangle className={`w-8 h-8 ${
                            ocrAccuracy.color === 'orange' ? 'text-orange-600' :
                            'text-red-600'
                          }`} />
                        ) : (
                          <HelpCircle className="w-8 h-8 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 text-center">
                      <h3 className={`text-lg font-extrabold ${
                        ocrAccuracy.color === 'emerald' ? 'text-emerald-800' :
                        ocrAccuracy.color === 'blue' ? 'text-blue-800' :
                        ocrAccuracy.color === 'amber' ? 'text-amber-800' :
                        ocrAccuracy.color === 'orange' ? 'text-orange-800' :
                        'text-red-800'
                      }`}>
                        {ocrAccuracy.level === 'Excellent' ? 'Excellent Scan!' :
                         ocrAccuracy.level === 'Good' ? 'Good Scan' :
                         ocrAccuracy.level === 'Fair' ? 'Fair Scan' :
                         ocrAccuracy.level === 'Poor' ? 'Poor Scan' :
                         'Scan Failed'}
                      </h3>
                      <p className={`text-sm font-medium mt-1 ${
                        ocrAccuracy.color === 'emerald' ? 'text-emerald-600' :
                        ocrAccuracy.color === 'blue' ? 'text-blue-600' :
                        ocrAccuracy.color === 'amber' ? 'text-amber-600' :
                        ocrAccuracy.color === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {ocrAccuracy.score > 0 ? `${ocrAccuracy.score}% Accuracy` : '0% Accuracy'}
                      </p>
                    </div>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="w-full mt-3">
                    <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          ocrAccuracy.color === 'emerald' ? 'bg-emerald-500' :
                          ocrAccuracy.color === 'blue' ? 'bg-blue-500' :
                          ocrAccuracy.color === 'amber' ? 'bg-amber-500' :
                          ocrAccuracy.color === 'orange' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${ocrAccuracy.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <p className={`text-xs text-center mt-2 ${
                    ocrAccuracy.color === 'emerald' ? 'text-emerald-700' :
                    ocrAccuracy.color === 'blue' ? 'text-blue-700' :
                    ocrAccuracy.color === 'amber' ? 'text-amber-700' :
                    ocrAccuracy.color === 'orange' ? 'text-orange-700' :
                    'text-red-700'
                  }`}>
                    {ocrAccuracy.message}
                  </p>
                </div>

                {/* Extracted Medicines Section */}
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Extracted Medicines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {extractedMeds.map((med, idx) => (
                      <MedicineCard
                        key={idx}
                        id={`extracted-card-${idx}`}
                        medicineName={med.medicineName}
                        dosage={med.dosage}
                        time={med.time}
                        foodInstruction={med.foodInstruction}
                        duration={med.duration}
                      />
                    ))}
                  </div>
                </div>

                {/* Confirm Extracted Button */}
                <button
                  type="button"
                  id="add-extracted-schedule-btn"
                  onClick={handleAddExtractedToSchedule}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  Add Extracted Medicines to Reminder Schedule
                </button>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  <strong>Notice:</strong> This is a demo OCR extraction. The system only helps users follow doctor prescriptions and does not provide medical advice.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Manual entry Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleManualSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4" id="manual-entry-form">
            <div className="space-y-1">
              <h2 className="font-sans font-bold text-slate-900 text-lg flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Manual Prescription Logger
              </h2>
              <p className="text-xs text-slate-500">
                Create an individual prescription log if no file upload is available.
              </p>
            </div>

            {manualFormSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
                ✓ {manualFormSuccess}
              </div>
            )}

            {/* Med Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Medicine Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Pill className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  id="manual-med-name"
                  placeholder="e.g. Paracetamol 500mg, Amoxicillin..."
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="pl-10 w-full py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/30 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Dosage */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Dosage Amount
              </label>
              <input
                type="text"
                id="manual-med-dosage"
                placeholder="e.g. 1 tablet, 5ml, 2 capsules"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/30 focus:bg-white"
                required
              />
            </div>

            {/* Time / Frequency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Dosage Schedule / Hour
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  id="manual-med-time"
                  placeholder="e.g. 8:00 AM, Morning and Night, Afternoon"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10 w-full py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/30 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Food instructions Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Food Guideline
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

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Treatment Duration
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  id="manual-med-duration"
                  placeholder="e.g. 5 days, 3 weeks, 1 month"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="pl-10 w-full py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/30 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <button
              type="submit"
              id="manual-generate-reminder-btn"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Generate Reminder
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
