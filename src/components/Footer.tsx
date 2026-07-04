import { HeartPulse, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-blue-500" />
              <span className="font-sans font-bold text-lg tracking-tight text-white">
                MediRemind <span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An intelligent, responsive healthcare companion designed to assist patients in organizing, managing, and tracking prescription schedules with seamless caretaker integration.
            </p>
          </div>

          {/* Project Credentials */}
          <div className="space-y-4" id="project-credentials">
            <h4 className="font-sans font-semibold text-white text-sm uppercase tracking-wider">Project Scope & Team</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p>🏫 <span className="font-medium text-slate-300">College Mini Project</span> / Hackathon Edition</p>
              <p>👥 <span className="font-medium text-slate-300">Development Team:</span> Group Delta (Placeholder)</p>
              <p>💻 <span className="font-medium text-slate-300">Supervised by:</span> Dept. of Computer Science & Healthcare Systems</p>
            </div>
          </div>

          {/* Core Safety Disclaimer Panel */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3" id="footer-disclaimer">
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>Important Medical Disclaimer</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This system does not provide medical advice. It only helps users follow their doctor’s prescription. Always consult a qualified medical professional for health concerns.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} MediRemind AI. All rights reserved.</p>
          <p className="text-slate-500">Crafted with modern React, Tailwind CSS, and local persistence engines.</p>
        </div>
      </div>
    </footer>
  );
}
