import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage';
import ReminderSchedulePage from './pages/ReminderSchedulePage';
import CaretakerAlertPage from './pages/CaretakerAlertPage';
import LoginRegisterPage from './pages/LoginRegisterPage';
import AIChatPage from './pages/AIChatPage';
import AIChatWidget from './components/AIChatWidget';
import { api } from './services/api';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('mediremind_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored?.id) {
      api.getProfile(stored.id)
        .then(profile => {
          setUser(profile);
          setCurrentPage('dashboard');
          setAuthChecked(true);
        })
        .catch(() => {
          localStorage.removeItem('mediremind_user');
          setUser(null);
          setCurrentPage('login');
          setAuthChecked(true);
        });
    } else {
      setCurrentPage('login');
      setAuthChecked(true);
    }
  }, []);

  const handleLoginSuccess = (userData: { id: string; name: string; email: string; role: string }) => {
    localStorage.setItem('mediremind_user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('mediremind_user');
    setUser(null);
    setCurrentPage('login');
  };

  const renderActivePage = () => {
    const protectedPages = ['dashboard', 'upload', 'reminders', 'caretaker', 'ai-chat', 'landing'];
    const publicPages = ['login'];
    const isPublicPage = publicPages.includes(currentPage);

    if (protectedPages.includes(currentPage) && !user) {
      setCurrentPage('login');
      return <LoginRegisterPage onLoginSuccess={handleLoginSuccess} isPublic />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return (
          <DashboardPage
            userName={user?.name}
            userRole={user?.role}
            onNavigate={setCurrentPage}
          />
        );
      case 'upload':
        return <UploadPrescriptionPage onSuccess={() => setCurrentPage('reminders')} />;
      case 'reminders':
        return <ReminderSchedulePage />;
      case 'caretaker':
        return <CaretakerAlertPage />;
      case 'ai-chat':
        return <AIChatPage userName={user?.name} />;
      case 'login':
        return <LoginRegisterPage onLoginSuccess={handleLoginSuccess} isPublic />;
      default:
        return <LoginRegisterPage onLoginSuccess={handleLoginSuccess} isPublic />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between" id="app-root">
      {currentPage !== 'login' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole={user?.role}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="main-content-region">
        {renderActivePage()}
      </main>

      {currentPage !== 'login' && <Footer />}
      <AIChatWidget visible={currentPage === 'dashboard'} />
    </div>
  );
}
