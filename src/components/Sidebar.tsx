import React from 'react';
import { ActivePage, UserProfile } from '../types';
import {
  Shield,
  PieChart,
  ShieldAlert,
  KeyRound,
  History,
  BarChart3,
  Sliders,
  LogOut,
  X,
  Code2,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFlaskModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isOpen,
  onClose,
  onOpenFlaskModal,
}) => {
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: PieChart },
    { id: 'analyze' as ActivePage, label: 'Analyze Password', icon: ShieldAlert, badge: 'Live' },
    { id: 'generator' as ActivePage, label: 'Password Generator', icon: KeyRound },
    { id: 'history' as ActivePage, label: 'Audit History', icon: History },
    { id: 'statistics' as ActivePage, label: 'Security Statistics', icon: BarChart3 },
    { id: 'settings' as ActivePage, label: 'Settings & Policy', icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <div
            id="brand-header-link"
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center">
                Secure<span className="text-cyan-400">Pass</span>
              </div>
              <div className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                v2.4 Enterprise
              </div>
            </div>
          </div>

          <button
            id="sidebar-close-toggle"
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Core Security
            </div>
            <nav className="space-y-1">
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => {
                      setActivePage(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 font-semibold border-l-2 border-cyan-400 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Management
            </div>
            <nav className="space-y-1">
              {navItems.slice(5).map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => {
                      setActivePage(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 font-semibold border-l-2 border-cyan-400 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* View Flask Source Code Modal Trigger */}
              <button
                id="btn-open-flask-code"
                onClick={() => {
                  onOpenFlaskModal();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 transition-colors border border-purple-500/20"
              >
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="flex-1 text-left">Flask & VS Code Hub</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  python app.py
                </span>
              </button>

              <button
                id="nav-btn-logout"
                onClick={() => {
                  setActivePage('logout');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
                <span>Logout Session</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Footer info badge */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/60">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-300">CSPRNG / Zero-Knowledge</span>
          </div>
        </div>
      </aside>
    </>
  );
};
