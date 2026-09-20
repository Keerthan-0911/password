import React, { useState, useEffect } from 'react';
import {
  ActivePage,
  PasswordPolicy,
  SecurityHistoryRecord,
  ToastMessage,
  UserProfile
} from './types';
import { DEFAULT_POLICY, INITIAL_SAMPLE_HISTORY } from './utils/securityEngine';
import { ToastContainer } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AnalyzerView } from './components/AnalyzerView';
import { GeneratorView } from './components/GeneratorView';
import { HistoryView } from './components/HistoryView';
import { StatisticsView } from './components/StatisticsView';
import { SettingsView } from './components/SettingsView';
import { LogoutView } from './components/LogoutView';
import { FlaskCodeViewerModal } from './components/FlaskCodeViewerModal';
import { PublicAccessBanner } from './components/PublicAccessBanner';

export default function App() {
  // Session / User state (Default logged in with clear Gmail/SOC access)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('securepass_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      username: 'SecOps Analyst',
      email: 'operator@gmail.com',
      role: 'SecOps Analyst',
    };
  });

  // Current Active Page
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  // Audit History state (Zero-knowledge: stores ratings & checks only, never plaintext passwords!)
  const [history, setHistory] = useState<SecurityHistoryRecord[]>(() => {
    const saved = localStorage.getItem('securepass_history');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SAMPLE_HISTORY;
  });

  // Enterprise Password Policy state
  const [policy, setPolicy] = useState<PasswordPolicy>(() => {
    const saved = localStorage.getItem('securepass_policy');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_POLICY;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Mobile sidebar drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Flask & VS Code Hub Modal
  const [flaskModalOpen, setFlaskModalOpen] = useState(false);

  // Cross-page transfer buffer (e.g. generator -> analyzer)
  const [transferPassword, setTransferPassword] = useState('');

  // Persist history
  useEffect(() => {
    localStorage.setItem('securepass_history', JSON.stringify(history));
  }, [history]);

  // Persist policy
  useEffect(() => {
    localStorage.setItem('securepass_policy', JSON.stringify(policy));
  }, [policy]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem('securepass_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('securepass_user');
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveToHistory = (recordData: Omit<SecurityHistoryRecord, 'id' | 'timestamp'>) => {
    const newRecord: SecurityHistoryRecord = {
      ...recordData,
      id: `chk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast('Audit record deleted.', 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('All zero-knowledge audit records purged.', 'info');
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('logout');
    showToast('Session terminated securely.', 'info');
  };

  // Standalone full-page views: Landing, Login, Logout
  if (activePage === 'landing') {
    return (
      <>
        <LandingView
          onNavigate={(page) => setActivePage(page)}
          onOpenFlaskModal={() => setFlaskModalOpen(true)}
        />
        <FlaskCodeViewerModal
          isOpen={flaskModalOpen}
          onClose={() => setFlaskModalOpen(false)}
          onShowToast={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (activePage === 'login') {
    return (
      <>
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onNavigate={(page) => setActivePage(page)}
          onShowToast={showToast}
        />
        <FlaskCodeViewerModal
          isOpen={flaskModalOpen}
          onClose={() => setFlaskModalOpen(false)}
          onShowToast={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (activePage === 'logout') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center">
        <LogoutView onNavigate={(page) => setActivePage(page)} />
        <FlaskCodeViewerModal
          isOpen={flaskModalOpen}
          onClose={() => setFlaskModalOpen(false)}
          onShowToast={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Main Dashboard App Shell (Authenticated View)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-cyan-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          if (page === 'logout') {
            handleLogout();
          } else {
            setActivePage(page);
          }
        }}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenFlaskModal={() => setFlaskModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Sticky Top Navbar */}
        <Navbar
          activePage={activePage}
          setActivePage={(page) => {
            if (page === 'logout') {
              handleLogout();
            } else {
              setActivePage(page);
            }
          }}
          user={user}
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onOpenFlaskModal={() => setFlaskModalOpen(true)}
          onShowToast={showToast}
        />

        {/* View Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Universal Cross-Device & Public Access Banner */}
          <PublicAccessBanner onShowToast={showToast} />

          {activePage === 'dashboard' && (
            <DashboardView
              user={user}
              history={history}
              policy={policy}
              onNavigate={(page) => setActivePage(page)}
              onOpenFlaskModal={() => setFlaskModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {activePage === 'analyze' && (
            <AnalyzerView
              policy={policy}
              onSaveToHistory={handleSaveToHistory}
              onNavigate={(page) => setActivePage(page)}
              initialPassword={transferPassword}
              onShowToast={showToast}
            />
          )}

          {activePage === 'generator' && (
            <GeneratorView
              policy={policy}
              onNavigate={(page) => setActivePage(page)}
              onTransferToAnalyzer={(pwd) => {
                setTransferPassword(pwd);
                setActivePage('analyze');
              }}
              onShowToast={showToast}
            />
          )}

          {activePage === 'history' && (
            <HistoryView
              history={history}
              onClearHistory={handleClearHistory}
              onDeleteRecord={handleDeleteHistoryRecord}
              onNavigate={(page) => setActivePage(page)}
              onShowToast={showToast}
            />
          )}

          {activePage === 'statistics' && (
            <StatisticsView
              history={history}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              user={user}
              onUpdateUser={(updated) => {
                setUser(updated);
              }}
              policy={policy}
              onUpdatePolicy={(updated) => {
                setPolicy(updated);
              }}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Modal for viewing and copying the Python Flask backend codebase */}
      <FlaskCodeViewerModal
        isOpen={flaskModalOpen}
        onClose={() => setFlaskModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
