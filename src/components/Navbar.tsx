import { useState } from 'react';
import { Menu, X, HeartPulse, LogOut, User } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onNavigate, userRole, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'upload', label: 'Upload Prescription' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'caretaker', label: 'Caretaker Alerts' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick(userRole ? 'dashboard' : 'login')}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
              id="nav-logo-btn"
            >
              <HeartPulse className="h-8 w-8 text-blue-600" />
              <span className="font-sans font-bold text-xl tracking-tight text-slate-900">
                MediRemind <span className="text-blue-600">AI</span>
              </span>
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

            {userRole ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {userRole}
                </span>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={() => handleNavClick('login')}
                className="ml-2 px-5 py-2 rounded-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {userRole && (
              <span className="mr-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {userRole}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-950 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-mobile-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="border-t border-slate-100 my-2 pt-2"></div>

            {userRole ? (
              <button
                id="nav-logout-btn-mobile"
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <button
                id="nav-login-btn-mobile"
                onClick={() => handleNavClick('login')}
                className="w-full text-center block px-4 py-2.5 rounded-full text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
