import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import {
  Shield,
  KeyRound,
  User,
  Eye,
  EyeOff,
  Fingerprint,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Terminal,
  Loader2,
  AlertCircle,
  Mail,
  Laptop,
  Check,
  Globe
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (page: ActivePage) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
  onShowToast,
}) => {
  const [authMode, setAuthMode] = useState<'gmail' | 'operator'>('gmail');
  
  // Gmail auth state
  const [gmailInput, setGmailInput] = useState('');
  const [gmailPassword, setGmailPassword] = useState('');
  
  // Operator ID state
  const [username, setUsername] = useState('secops_admin');
  const [operatorPassword, setOperatorPassword] = useState('Admin@2025');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const publicUrl = window.location.origin.includes('ais-dev-')
    ? window.location.origin.replace('ais-dev-', 'ais-pre-')
    : window.location.origin;

  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailToUse = gmailInput.trim();
    if (!emailToUse) {
      setErrorMessage('Please enter any Gmail address (e.g., yourname@gmail.com)');
      return;
    }

    if (!emailToUse.includes('@')) {
      setErrorMessage('Please include a valid email domain (e.g., user@gmail.com)');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const usernameDerived = emailToUse.split('@')[0];
      const user: UserProfile = {
        username: usernameDerived,
        email: emailToUse,
        role: 'SecOps Analyst',
      };
      onLoginSuccess(user);
      onShowToast(`Signed in successfully as ${emailToUse}!`, 'success');
    }, 600);
  };

  const handleOperatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username or security identifier.');
      return;
    }

    if (operatorPassword.length < 4) {
      setErrorMessage('Security credential must contain at least 4 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        username: username.trim(),
        email: username.includes('@') ? username.trim() : `${username.trim().toLowerCase()}@securepass.io`,
        role: 'SecOps Analyst',
      };
      onLoginSuccess(user);
      onShowToast(`Welcome back, ${user.username}! Zero-knowledge session active.`, 'success');
    }, 600);
  };

  const handleQuickLogin = (email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const usernameDerived = email.split('@')[0];
      const user: UserProfile = {
        username: usernameDerived,
        email: email,
        role: 'SecOps Analyst',
      };
      onLoginSuccess(user);
      onShowToast(`Logged in instantly with ${email}`, 'success');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Cross-Device Notice Pill */}
      <div className="mb-4 max-w-4xl w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Works across all Laptops, Desktops, & any Gmail address</span>
        </div>
        <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Public Access Ready
        </span>
      </div>

      {/* Main Dual-Column Auth Card */}
      <div className="w-full max-w-4xl bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Column: Cybersecurity Graphics & Universal Access Highlights */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Secure<span className="text-cyan-400">Pass</span>
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Any Gmail Supported
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Sign in with any Gmail account.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              Accessible across any laptop or desktop computer. Enter any Gmail address to authenticate your private zero-knowledge session.
            </p>

            {/* Feature badges */}
            <div className="space-y-3 mb-6 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Works with ANY personal or workspace Gmail</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Universal cross-device browser compatibility</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero plaintext password transmission or cloud leaks</span>
              </div>
            </div>
          </div>

          {/* Cross-Device Share Tip */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 font-mono text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] uppercase tracking-wider font-bold">
              <Laptop className="w-3.5 h-3.5" />
              <span>To Avoid "Page Not Found":</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Click the <strong className="text-cyan-300">Share</strong> button at the top right of Google AI Studio to activate the public link for all laptops & Gmail accounts:
            </p>
            <p className="text-cyan-300 text-[10px] break-all bg-slate-900 p-1.5 rounded border border-slate-800 select-all">
              {publicUrl}
            </p>
          </div>

          <div className="mt-4 pt-4 text-[11px] text-slate-500">
            &copy; 2025 SecurePass Cyber Systems. All rights reserved.
          </div>
        </div>

        {/* Right Column: Interactive Login Form */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-center bg-slate-900/40">
          <div className="max-w-sm w-full mx-auto">
            {/* Tab Selection */}
            <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
              <button
                type="button"
                id="tab-auth-gmail"
                onClick={() => setAuthMode('gmail')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'gmail'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Any Gmail</span>
              </button>
              <button
                type="button"
                id="tab-auth-operator"
                onClick={() => setAuthMode('operator')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'operator'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Operator ID</span>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {authMode === 'gmail' ? 'Gmail Authentication' : 'Operator Sign In'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'gmail'
                  ? 'Enter any Gmail account to start testing credential hygiene.'
                  : 'Enter operator credentials to access the SOC terminal.'}
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div
                id="login-error-alert"
                className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {authMode === 'gmail' ? (
              /* Gmail Login Form */
              <form onSubmit={handleGmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-gmail">
                    Enter ANY Gmail Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                    <input
                      id="login-gmail"
                      type="email"
                      value={gmailInput}
                      onChange={(e) => setGmailInput(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Any @gmail.com or Google Workspace address is accepted
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300" htmlFor="login-gmail-pass">
                      Password (Optional for Demo)
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                    <input
                      id="login-gmail-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={gmailPassword}
                      onChange={(e) => setGmailPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-500 hover:text-slate-300 p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick 1-Click Login Pill Options */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400 block mb-1.5">
                    Or select a quick profile:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGmailInput('nanikeerthankumar@gmail.com')}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 text-cyan-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      nanikeerthankumar@gmail.com
                    </button>
                    <button
                      type="button"
                      onClick={() => setGmailInput('security.auditor@gmail.com')}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      security.auditor@gmail.com
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-gmail"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>Sign In with Gmail</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Standard Operator Form */
              <form onSubmit={handleOperatorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-username">
                    Username or Security ID
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. secops_admin"
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300" htmlFor="login-password">
                      Password
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={operatorPassword}
                      onChange={(e) => setOperatorPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-500 hover:text-slate-300 p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Keep session authenticated</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-submit-operator"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>Authenticate & Enter</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <button
                onClick={() => onNavigate('landing')}
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Homepage</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
