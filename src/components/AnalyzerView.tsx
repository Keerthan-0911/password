import React, { useState, useEffect } from 'react';
import { ActivePage, PasswordPolicy, SecurityHistoryRecord } from '../types';
import { analyzePassword } from '../utils/securityEngine';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  Zap,
  Sparkles,
  Save,
  KeyRound,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AnalyzerViewProps {
  policy: PasswordPolicy;
  onSaveToHistory: (record: Omit<SecurityHistoryRecord, 'id' | 'timestamp'>) => void;
  onNavigate: (page: ActivePage) => void;
  initialPassword?: string;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  policy,
  onSaveToHistory,
  onNavigate,
  initialPassword = '',
  onShowToast,
}) => {
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialPassword) {
      setPassword(initialPassword);
    }
  }, [initialPassword]);

  const analysis = analyzePassword(password, policy);

  const handleClear = () => {
    setPassword('');
    onShowToast('Password cleared.', 'info');
  };

  const handleRecordToHistory = () => {
    if (!password) {
      onShowToast('Please enter a password before recording to audit history.', 'error');
      return;
    }

    onSaveToHistory({
      score: analysis.score,
      strength: analysis.strength,
      statusClass: analysis.statusClass,
      checks: analysis.checks,
      recommendations: analysis.recommendations,
    });

    onShowToast('Analysis logged to Zero-Knowledge history. Plaintext password was discarded.', 'success');
  };

  // Color schemes for score
  let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
  let barGradient = 'from-slate-700 to-slate-600';
  let textColor = 'text-slate-400';

  if (password.length > 0) {
    if (analysis.strength === 'Weak') {
      badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      barGradient = 'from-rose-500 to-red-600';
      textColor = 'text-rose-400';
    } else if (analysis.strength === 'Medium') {
      badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      barGradient = 'from-amber-500 to-orange-500';
      textColor = 'text-amber-400';
    } else {
      badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      barGradient = 'from-emerald-500 to-teal-400';
      textColor = 'text-emerald-400';
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Cryptographic Password Analyzer
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates entropy, dictionary patterns, and NIST complexity guidelines.
            </p>
          </div>
        </div>

        <button
          id="analyzer-quick-gen-btn"
          onClick={() => onNavigate('generator')}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-2"
        >
          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
          <span>Switch to Generator</span>
        </button>
      </div>

      {/* Main Analysis Input Box */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="main-analyzer-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Input Candidate Password</span>
            </label>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono text-cyan-400 font-medium">
                {password.length} characters
              </span>
              {password.length > 0 && (
                <button
                  id="btn-clear-analyzer"
                  onClick={handleClear}
                  className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              id="main-analyzer-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste password to analyze..."
              className="w-full bg-slate-950/90 border border-slate-700 rounded-2xl px-5 py-4 text-base sm:text-lg text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner"
              autoFocus
            />
            <div className="absolute right-3.5 flex items-center gap-1">
              <button
                type="button"
                id="btn-toggle-analyzer-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800/80"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic 5-Segment Strength Meter */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Security Score:</span>
              <span className={`text-sm font-extrabold font-mono ${textColor}`}>
                {analysis.score} / 5
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor} transition-all`}>
              {password.length === 0 ? 'Awaiting Input' : `${analysis.strength} Defense`}
            </div>
          </div>

          {/* 5-Segmented Bar */}
          <div className="grid grid-cols-5 gap-2 h-2.5">
            {[1, 2, 3, 4, 5].map((segIndex) => {
              const isActive = segIndex <= analysis.score;
              return (
                <div
                  key={segIndex}
                  className={`h-full rounded-full transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${barGradient} shadow-sm`
                      : 'bg-slate-800/80'
                  }`}
                />
              );
            })}
          </div>

          {/* Progress fill line */}
          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${barGradient} transition-all duration-300`}
              style={{ width: `${(analysis.score / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Telemetry Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Estimated Crack Time</span>
            </div>
            <div className="text-base font-extrabold text-white font-mono">
              {password.length > 0 ? analysis.crackTime : 'Instant'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Assumes 100B guesses/sec GPU rig</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Information Entropy</span>
            </div>
            <div className="text-base font-extrabold text-purple-300 font-mono">
              {password.length > 0 ? `${analysis.entropy} bits` : '0 bits'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Shannon character diversity score</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Knowledge Status</span>
            </div>
            <div className="text-base font-extrabold text-emerald-400 font-mono">
              Unstored
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Evaluated in transient volatile memory</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: 5 Requirements Checklist + Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checklist Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>5 Security Requirements Checklist</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Meets enterprise credential standards configured in your policy.
          </p>

          <div className="space-y-3 text-xs">
            {/* 1. Length */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                analysis.checks.length
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {analysis.checks.length ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400/80 shrink-0" />
                )}
                <span className="font-medium">Minimum {policy.minLength} characters</span>
              </div>
              <span className="text-[11px] font-mono">
                {password.length}/{policy.minLength}
              </span>
            </div>

            {/* 2. Uppercase */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                analysis.checks.uppercase
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {analysis.checks.uppercase ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400/80 shrink-0" />
                )}
                <span className="font-medium">Uppercase letters (A-Z)</span>
              </div>
              <span className="text-[11px] font-mono">
                {analysis.checks.uppercase ? 'Present' : 'Missing'}
              </span>
            </div>

            {/* 3. Lowercase */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                analysis.checks.lowercase
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {analysis.checks.lowercase ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400/80 shrink-0" />
                )}
                <span className="font-medium">Lowercase letters (a-z)</span>
              </div>
              <span className="text-[11px] font-mono">
                {analysis.checks.lowercase ? 'Present' : 'Missing'}
              </span>
            </div>

            {/* 4. Number */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                analysis.checks.number
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {analysis.checks.number ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400/80 shrink-0" />
                )}
                <span className="font-medium">Numbers (0-9)</span>
              </div>
              <span className="text-[11px] font-mono">
                {analysis.checks.number ? 'Present' : 'Missing'}
              </span>
            </div>

            {/* 5. Special Character */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                analysis.checks.special
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {analysis.checks.special ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400/80 shrink-0" />
                )}
                <span className="font-medium">Special symbols (!@#$%^&*)</span>
              </div>
              <span className="text-[11px] font-mono">
                {analysis.checks.special ? 'Present' : 'Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations & Action Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Cryptographic Guidance</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time advice to counter offline dictionary and rainbow table strikes.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6">
              <div className="text-xs text-slate-300 leading-relaxed">
                {password.length === 0
                  ? 'Enter a password above to inspect automated hardening recommendations.'
                  : analysis.recommendations}
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-2 mb-6">
              <div className="font-semibold text-slate-200">Security Best Practices:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                <li>Never reuse this password across multiple accounts or services.</li>
                <li>Store your master credentials in an encrypted zero-knowledge vault.</li>
                <li>Enable multi-factor authentication (MFA / FIDO2) wherever supported.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              id="btn-save-analysis-log"
              onClick={handleRecordToHistory}
              disabled={password.length === 0}
              className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>Record in Zero-Knowledge Audit History</span>
            </button>

            <button
              id="btn-goto-generator"
              onClick={() => onNavigate('generator')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <KeyRound className="w-4 h-4" />
              <span>Generate Uncrackable Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
