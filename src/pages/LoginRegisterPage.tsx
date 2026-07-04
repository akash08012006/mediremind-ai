import { useState, FormEvent } from 'react';
import { ShieldCheck, Mail, Lock, User, Check, Sparkles, HeartPulse, ArrowRight, Eye, EyeOff, Chrome } from 'lucide-react';
import { api } from '../services/api';

interface LoginRegisterPageProps {
  onLoginSuccess: (user: { id: string; name: string; email: string; role: string }) => void;
  isPublic?: boolean;
}

export default function LoginRegisterPage({ onLoginSuccess, isPublic = false }: LoginRegisterPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'Patient' | 'Caretaker' | 'Doctor/Admin'>('Patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleQuickDemoFill = (selectedRole: 'Patient' | 'Caretaker' | 'Doctor/Admin') => {
    setRole(selectedRole);
    if (selectedRole === 'Patient') {
      setName('Akash Kumar');
      setEmail('akash@example.com');
    } else if (selectedRole === 'Caretaker') {
      setName('Ramesh Kumar');
      setEmail('ramesh.kumar@example.com');
    } else {
      setName('Dr. Sarah Lin');
      setEmail('dr.lin@mediremind.com');
    }
    setPassword('demo1234');
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsSubmitting(true);

    try {
      let result;
      if (isLogin) {
        if (!email || !password) {
          throw new Error('Please fill in email and password.');
        }
        result = await api.login({ email, password });
      } else {
        if (!name || !email || !password) {
          throw new Error('Please fill in name, email, and password.');
        }
        result = await api.register({ name, email, password, role });
      }

      onLoginSuccess(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setIsGoogleModalOpen(true);
    setGoogleEmail('');
    setGoogleName('');
    setError('');
  };

  const handleGoogleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!googleEmail) {
      setError('Please enter your Google email.');
      return;
    }

    setGoogleLoading(true);
    setError('');

    try {
      const result = await api.googleAuth({ email: googleEmail, name: googleName || 'Google User' });
      onLoginSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-white relative overflow-hidden" id="login-page-root">
      
      {/* Background Elements matching project theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl" />
        
        {/* Grid pattern matching project style */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60" id="login-container" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.03)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side - Branding */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 sm:p-12 lg:p-16 text-white overflow-hidden hidden lg:block">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              {/* Decorative shapes */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-10">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                      <HeartPulse className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="font-sans font-bold text-xl tracking-tight">MediRemind</h1>
                      <p className="text-blue-100 text-xs font-medium">AI-Powered Healthcare</p>
                    </div>
                  </div>

                  <h2 className="font-sans font-extrabold text-3xl xl:text-4xl tracking-tight leading-tight mb-4">
                    Smart Medication<br />
                    <span className="text-blue-200">Reminder System</span>
                  </h2>
                  <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
                    Never miss a dose again. Intelligent reminders, caretaker alerts, and prescription tracking — all in one secure platform.
                  </p>
                </div>

                <div className="space-y-4 mt-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Smart Scheduling</p>
                      <p className="text-blue-200 text-xs">AI-powered reminder optimization</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Secure & Private</p>
                      <p className="text-blue-200 text-xs">Your health data stays protected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">AI Assistant</p>
                      <p className="text-blue-200 text-xs">24/7 medication guidance</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10">
                  <p className="text-blue-200 text-xs">
                    Trusted by patients and healthcare providers worldwide
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="max-w-sm mx-auto lg:max-w-none">
                
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="font-sans font-bold text-lg text-slate-900">MediRemind AI</span>
                </div>

                {/* Header */}
                <div className="text-center lg:text-left mb-8">
                  <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
                    {isLogin ? 'Sign in to access your medication dashboard' : 'Join MediRemind AI to manage your health'}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="relative bg-slate-100 p-1 rounded-2xl mb-8">
                  <div className="relative flex">
                    <button
                      onClick={() => { setIsLogin(true); setError(''); }}
                      className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer relative z-10 ${
                        isLogin ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'
                      }`}
                      id="tab-toggle-login"
                    >
                      {isLogin && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg" style={{ boxShadow: '0 4px 14px -2px rgba(37, 99, 235, 0.4)' }} />
                      )}
                      <span className="relative">Sign In</span>
                    </button>
                    <button
                      onClick={() => { setIsLogin(false); setError(''); }}
                      className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer relative z-10 ${
                        !isLogin ? 'text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'
                      }`}
                      id="tab-toggle-register"
                    >
                      {!isLogin && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg" style={{ boxShadow: '0 4px 14px -2px rgba(16, 185, 129, 0.4)' }} />
                      )}
                      <span className="relative">Register</span>
                    </button>
                  </div>
                </div>

                 {/* Form */}
                 <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
                   {error && (
                     <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-100 flex items-center gap-2" id="login-error-banner">
                       <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                         <span className="text-xs">!</span>
                       </div>
                       {error}
                     </div>
                   )}

                   {/* Role selection */}
                   {!isLogin && (
                     <div className="space-y-2.5">
                       <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                         Select Your Role
                       </label>
                       <div className="grid grid-cols-3 gap-2">
                         {(['Patient', 'Caretaker', 'Doctor/Admin'] as const).map((r) => {
                           const roleColors = {
                             'Patient': 'blue',
                             'Caretaker': 'emerald',
                             'Doctor/Admin': 'amber'
                           };
                           const color = roleColors[r];
                           const isActive = role === r;
                           return (
                             <button
                               key={r}
                               type="button"
                               id={`role-btn-${r.replace('/', '-')}`}
                               onClick={() => setRole(r)}
                               className={`
                                 py-3 rounded-xl text-xs font-bold border-2 transition-all text-center cursor-pointer
                                 ${isActive
                                   ? color === 'blue' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10' :
                                     color === 'emerald' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/10' :
                                     'border-amber-600 bg-amber-50 text-amber-700 shadow-md shadow-amber-500/10'
                                   : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                 }
                               `}
                             >
                               <div className="flex flex-col items-center gap-1">
                                 <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                   isActive
                                     ? color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                       color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                       'bg-amber-100 text-amber-700'
                                     : 'bg-slate-100 text-slate-400'
                                 }`}>
                                   <User className="w-4 h-4" />
                                 </div>
                                 <span className="text-[10px]">{r}</span>
                               </div>
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   )}

                   {/* Name Field (Register only) */}
                   {!isLogin && (
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                         Full Name
                       </label>
                       <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                           <User className="w-4 h-4" />
                         </div>
                         <input
                           type="text"
                           id="reg-name-input"
                           placeholder="e.g. Akash Kumar"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="pl-11 w-full py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-0 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
                           required={!isLogin}
                         />
                       </div>
                     </div>
                   )}

                   {/* Email Field */}
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                       Email Address
                     </label>
                     <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                         <Mail className="w-4 h-4" />
                       </div>
                       <input
                         type="email"
                         id="login-email-input"
                         placeholder="e.g. akash@example.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="pl-11 w-full py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-0 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
                         required
                       />
                     </div>
                   </div>

                   {/* Password Field */}
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                       Password
                     </label>
                     <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                         <Lock className="w-4 h-4" />
                       </div>
                       <input
                         type={showPassword ? 'text' : 'password'}
                         id="login-password-input"
                         placeholder="••••••••"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="pl-11 pr-11 w-full py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-0 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all"
                         required
                       />
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                       >
                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                     </div>
                   </div>

                   {/* Submit Action */}
                   <button
                     type="submit"
                     id="login-submit-btn"
                     disabled={loading || isSubmitting}
                     className={`
                       w-full py-3.5 rounded-xl font-bold text-white transition-all cursor-pointer mt-2
                       ${isLogin 
                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                         : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
                       }
                       shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                     `}
                     style={{ boxShadow: loading || isSubmitting ? 'none' : isLogin ? '0 4px 14px -2px rgba(37, 99, 235, 0.4)' : '0 4px 14px -2px rgba(16, 185, 129, 0.4)' }}
                   >
                     {loading ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                       <>
                         {isLogin ? 'Sign In' : 'Create Account'}
                         <ArrowRight className="w-4 h-4" />
                       </>
                     )}
                   </button>

                    {isLogin && (
                      <>
                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-slate-400 text-[11px] font-medium">or continue with</span>
                          </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-1 gap-3">
                          <button
                            type="button"
                            onClick={handleGoogleClick}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.3v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.08z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-xs font-semibold text-slate-700">Continue with Google</span>
                          </button>
                        </div>
                      </>
                    )}
                 </form>

                 {/* Footer */}
                 <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                   <p className="text-[11px] text-slate-400 leading-relaxed">
                     By continuing, you agree to our Terms of Service and Privacy Policy.<br />
                     This system does not provide medical advice.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Google Auth Modal */}
       {isGoogleModalOpen && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5 border border-slate-200">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                 <Chrome className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="font-bold text-sm text-slate-900">Sign in with Google</h3>
                 <p className="text-[11px] text-slate-500">Enter your Google email to continue</p>
               </div>
             </div>

             <form onSubmit={handleGoogleSubmit} className="space-y-4">
               {error && (
                 <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">
                   {error}
                 </div>
               )}

               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                   Email
                 </label>
                 <input
                   type="email"
                   value={googleEmail}
                   onChange={(e) => setGoogleEmail(e.target.value)}
                   placeholder="you@gmail.com"
                   className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                   required
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                   Full Name
                 </label>
                 <input
                   type="text"
                   value={googleName}
                   onChange={(e) => setGoogleName(e.target.value)}
                   placeholder="Your Name"
                   className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                 />
               </div>

               <button
                 type="submit"
                 disabled={googleLoading}
                 className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
               >
                 {googleLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>
                     <svg className="w-4 h-4" viewBox="0 0 24 24">
                       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.3v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.08z"/>
                       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                     </svg>
                     Continue with Google
                   </>
                 )}
               </button>

               <button
                 type="button"
                 onClick={() => setIsGoogleModalOpen(false)}
                 className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
               >
                 Cancel
               </button>
             </form>
           </div>
         </div>
       )}
     </div>
   );
 }
