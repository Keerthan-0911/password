import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  User,
  Sliders,
  LogOut,
  Sparkles,
  Code,
  Share2,
  Copy,
  Check,
  Globe,
  UserPlus
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  user: UserProfile | null;
  onOpenMobileMenu: () => void;
  onOpenFlaskModal: () => void;
  onSearchQuery?: (q: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  user,
  onOpenMobileMenu,
  onOpenFlaskModal,
  onShowToast,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const publicUrl = typeof window !== 'undefined' && window.location.origin.includes('ais-dev-')
    ? window.location.origin.replace('ais-dev-', 'ais-pre-')
    : typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedShare(true);
      if (onShowToast) {
        onShowToast('Public Share URL copied! Accessible by any laptop & any Gmail.', 'success');
      }
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      if (onShowToast) {
        onShowToast('Public URL: ' + publicUrl, 'info');
      }
    }
  };

  const getTitles = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: 'Security Dashboard', sub: 'Threat intelligence and credential hygiene monitoring' };
      case 'analyze':
        return { title: 'Password Strength Analyzer', sub: 'Real-time cryptographic entropy and requirement verification' };
      case 'generator':
        return { title: 'Password Generator', sub: 'Hardware-grade CSPRNG entropy generator' };
      case 'history':
        return { title: 'Audit History', sub: 'Zero-knowledge verification logs' };
      case 'statistics':
        return { title: 'Security Statistics', sub: 'Interactive distribution and compliance analytics' };
      case 'settings':
        return { title: 'Settings & Security Policy', sub: 'Configure credential requirements and client preferences' };
      default:
        return { title: 'SecurePass Platform', sub: 'Enterprise credential defense system' };
    }
  };

  const { title, sub } = getTitles();

  return (
    <header id="top-navbar" className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          id="btn-mobile-nav-toggle"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base lg:text-lg font-bold text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 font-normal">
            {sub}
          </p>
        </div>
      </div>

      {/* Right side: Search, Code Hub, Notifications, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Public Share Button */}
        <button
          id="nav-quick-share-btn"
          onClick={handleCopyShareLink}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all shadow-sm"
          title="Copy Public link to open on any laptop or desktop with any Gmail"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
          <span className="hidden sm:inline">{copiedShare ? 'Copied Public Link!' : 'Share Public Link'}</span>
        </button>

        {/* Quick Flask VS Code Modal Button */}
        <button
          id="nav-quick-flask-btn"
          onClick={onOpenFlaskModal}
          className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all shadow-sm"
          title="Inspect and copy Python Flask source code"
        >
          <Code className="w-3.5 h-3.5 text-purple-400" />
          <span>VS Code / Flask Code</span>
        </button>

        {/* Global Search Input */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 w-60 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id="navbar-search-input"
            type="text"
            placeholder="Search security checks..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="nav-notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
          </button>

          {showNotifications && (
            <div
              id="notification-popover"
              className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
                <span>Security Alerts & Logs</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">All clear</span>
              </div>
              <div className="py-3 space-y-2.5 text-xs">
                <div className="flex gap-2.5 items-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-200">Zero-Knowledge Guard Active</div>
                    <div className="text-slate-400 text-[11px]">No plaintext passwords recorded in memory.</div>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-200">Python 3.10 Engine Ready</div>
                    <div className="text-slate-400 text-[11px]">CSPRNG seeds verified from OS hardware entropy.</div>
                  </div>
                </div>
              </div>
              <button
                id="btn-close-notifs"
                onClick={() => setShowNotifications(false)}
                className="w-full text-center py-1 text-xs text-cyan-400 hover:underline pt-2 border-t border-slate-800"
              >
                Dismiss Notifications
              </button>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            id="nav-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-900 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-cyan-500/20">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-semibold text-slate-200">
                {user?.username || 'SecOps Admin'}
              </div>
              <div className="text-[10px] text-slate-400">
                {user?.role || 'SOC Operator'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div
              id="profile-dropdown-menu"
              className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95"
            >
              <div className="px-4 py-2 border-b border-slate-800">
                <div className="font-semibold text-slate-200">{user?.username || 'SecOps Admin'}</div>
                <div className="text-slate-400 text-[11px] truncate">{user?.email || 'admin@securepass.io'}</div>
              </div>

              <button
                id="profile-dropdown-settings"
                onClick={() => {
                  setActivePage('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Sliders className="w-4 h-4 text-slate-400" />
                <span>Security Policy & Settings</span>
              </button>

              <button
                id="profile-dropdown-analyze"
                onClick={() => {
                  setActivePage('analyze');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Open Password Studio</span>
              </button>

              <button
                id="profile-dropdown-switch-gmail"
                onClick={() => {
                  setActivePage('login');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Switch / Sign in with any Gmail</span>
              </button>

              <div className="border-t border-slate-800 my-1"></div>

              <button
                id="profile-dropdown-logout"
                onClick={() => {
                  setActivePage('logout');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
