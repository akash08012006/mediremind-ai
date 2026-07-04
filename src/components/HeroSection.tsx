import { ArrowRight, FileUp, HeartPulse, Sparkles, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onUploadClick: () => void;
}

export default function HeroSection({ onGetStarted, onUploadClick }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-b from-blue-50/50 via-white to-white overflow-hidden py-16 sm:py-24" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Health Assistant
            </div>
            
            <h1 className="font-sans font-extrabold text-slate-900 text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none">
              Your smart AI-powered <br />
              <span className="text-blue-600">prescription reminder</span>
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              MediRemind AI streamlines prescription management. Effortlessly upload medical prescriptions, trigger automated reminders, track schedules, and notify caretakers immediately of any missed doses.
            </p>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-slate-600 pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Free OCR Scanner Demo
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Caretaker Alerts
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Local & Secure State
              </span>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="hero-get-started-btn"
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                id="hero-upload-btn"
                onClick={onUploadClick}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileUp className="w-5 h-5 text-blue-500" />
                Upload Prescription
              </button>
            </div>

            {/* Safety Alert disclaimer box */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 text-left max-w-xl mx-auto lg:mx-0" id="hero-safety-banner">
              <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Important Safety Note:</span> This system does not provide medical advice. It only helps users follow their doctor’s prescription.
              </p>
            </div>
          </div>

          {/* Hero visual representation */}
          <div className="lg:col-span-5 mt-12 lg:mt-0 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer glowing decor */}
              <div className="absolute inset-0 bg-blue-200 rounded-full filter blur-3xl opacity-30 -z-10 transform scale-110"></div>
              
              {/* Main medical card illustration */}
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative p-6 space-y-6">
                
                {/* Simulated mobile UI reminder card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-slate-900 text-sm">Active Treatment</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Updated 2 mins ago</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full">
                    90% Adherence
                  </span>
                </div>

                {/* Example pills items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">Paracetamol 500mg</h5>
                      <p className="text-[10px] text-slate-500">Dosage: 1 Tab • Next: 8:00 AM</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Morning
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">Cetirizine 10mg</h5>
                      <p className="text-[10px] text-slate-500">Dosage: 1 Tab • Next: 9:00 PM</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Night Only
                    </span>
                  </div>
                </div>

                {/* Floating alert simulator */}
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-3.5 flex gap-2.5 items-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <div className="text-[11px]">
                    <span className="font-bold text-amber-900">Caretaker Alert Simulation:</span>
                    <p className="text-amber-800">Missed Paracetamol reported. SMS triggered.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
