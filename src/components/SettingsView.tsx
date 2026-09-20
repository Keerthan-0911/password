import React, { useState } from 'react';
import { PasswordPolicy, UserProfile } from '../types';
import {
  Sliders,
  User,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  Key,
  Palette
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile | null;
  onUpdateUser: (updated: UserProfile) => void;
  policy: PasswordPolicy;
  onUpdatePolicy: (updated: PasswordPolicy) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  policy,
  onUpdatePolicy,
  onShowToast,
}) => {
  // Local profile state
  const [username, setUsername] = useState(user?.username || 'SecOps Admin');
  const [email, setEmail] = useState(user?.email || 'admin@securepass.io');

  // Local policy state
  const [minLength, setMinLength] = useState(policy.minLength);
  const [requireUpper, setRequireUpper] = useState(policy.requireUpper);
  const [requireLower, setRequireLower] = useState(policy.requireLower);
  const [requireNumber, setRequireNumber] = useState(policy.requireNumber);
  const [requireSpecial, setRequireSpecial] = useState(policy.requireSpecial);

  // Appearance / system prefs
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showTips, setShowTips] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      username: username.trim(),
      email: email.trim(),
      role: user?.role || 'SecOps Analyst',
    });
    onShowToast('Profile credentials updated successfully.', 'success');
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePolicy({
      minLength,
      requireUpper,
      requireLower,
      requireNumber,
      requireSpecial,
    });
    onShowToast(`Enterprise policy updated! Minimum length set to ${minLength} characters.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Application Settings & Security Policies
            </h2>
            <p className="text-xs text-slate-400">
              Configure system-wide cryptographic validation parameters and operator profile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>Policies Enforced Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Security Policy Settings */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSavePolicy}
            className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Enterprise Password Complexity Policy
                </h3>
                <p className="text-xs text-slate-400">
                  Defines the criteria and threshold enforced by the Analyzer engine.
                </p>
              </div>
            </div>

            {/* Minimum Length Slider */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Minimum Required Length
                </label>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {minLength} characters
                </span>
              </div>

              <input
                id="policy-min-length-slider"
                type="range"
                min={6}
                max={32}
                value={minLength}
                onChange={(e) => setMinLength(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>6 chars</span>
                <span>8 (Standard)</span>
                <span>16 (Enterprise)</span>
                <span>32 (Max)</span>
              </div>
            </div>

            {/* Criteria Toggles */}
            <div className="space-y-3 text-xs">
              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Enforce Uppercase Letters</div>
                  <div className="text-[11px] text-slate-400">Requires at least one capital letter [A-Z]</div>
                </div>
                <input
                  type="checkbox"
                  checked={requireUpper}
                  onChange={(e) => setRequireUpper(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Enforce Lowercase Letters</div>
                  <div className="text-[11px] text-slate-400">Requires at least one lowercase letter [a-z]</div>
                </div>
                <input
                  type="checkbox"
                  checked={requireLower}
                  onChange={(e) => setRequireLower(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Enforce Numeric Digits</div>
                  <div className="text-[11px] text-slate-400">Requires at least one digit [0-9]</div>
                </div>
                <input
                  type="checkbox"
                  checked={requireNumber}
                  onChange={(e) => setRequireNumber(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Enforce Special Symbols</div>
                  <div className="text-[11px] text-slate-400">Requires special characters [!@#$%^&*...]</div>
                </div>
                <input
                  type="checkbox"
                  checked={requireSpecial}
                  onChange={(e) => setRequireSpecial(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>

            <button
              type="submit"
              id="btn-save-policy"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Enforce Policy</span>
            </button>
          </form>
        </div>

        {/* Right Column: Profile & Appearance Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Operator Profile */}
          <form
            onSubmit={handleSaveProfile}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <User className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Operator Profile</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="settings-username">
                Security Identifier / Username
              </label>
              <input
                id="settings-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="settings-email">
                Alert Notification Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Designated Access Role
              </label>
              <input
                type="text"
                disabled
                value={user?.role || 'SecOps Analyst'}
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              id="btn-save-profile"
              className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
          </form>

          {/* System & Appearance Preferences */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Palette className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">System Preferences</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Theme Atmosphere</div>
                  <div className="text-[11px] text-slate-400">Cyber Dark Glassmorphism</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Active
                </span>
              </div>

              <label className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Toast Notifications</div>
                  <div className="text-[11px] text-slate-400">Show transient verification alerts</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200">Cryptographic Tips</div>
                  <div className="text-[11px] text-slate-400">Display hardening recommendations</div>
                </div>
                <input
                  type="checkbox"
                  checked={showTips}
                  onChange={(e) => setShowTips(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
