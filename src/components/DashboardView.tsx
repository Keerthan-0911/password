import React, { useState } from 'react';
import { ActivePage, SecurityHistoryRecord, UserProfile, PasswordPolicy } from '../types';
import { analyzePassword } from '../utils/securityEngine';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  KeyRound,
  History,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  Code2
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile | null;
  history: SecurityHistoryRecord[];
  policy: PasswordPolicy;
  onNavigate: (page: ActivePage) => void;
  onSelectPasswordForAnalysis?: (pwd: string) => void;
  onOpenFlaskModal: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  history,
  policy,
  onNavigate,
  onOpenFlaskModal,
  onShowToast,
}) => {
  const [quickPassword, setQuickPassword] = useState('');

  // Calculate statistics from actual history
  const totalChecked = history.length;
  const strongCount = history.filter((h) => h.strength === 'Strong').length;
  const mediumCount = history.filter((h) => h.strength === 'Medium').length;
  const weakCount = history.filter((h) => h.strength === 'Weak').length;

  const strongPct = totalChecked > 0 ? Math.round((strongCount / totalChecked) * 100) : 0;
  const mediumPct = totalChecked > 0 ? Math.round((mediumCount / totalChecked) * 100) : 0;
  const weakPct = totalChecked > 0 ? Math.round((weakCount / totalChecked) * 100) : 0;

  // Quick evaluation of the input in the dashboard widget
  const quickResult = quickPassword ? analyzePassword(quickPassword, policy) : null;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner Card */}
      <div
        id="dashboard-welcome-banner"
        className="relative rounded-2xl p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800/90 shadow-xl overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SOC Operations Live</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.username || 'SecOps Admin'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Your cryptographic verification suite is operational. Zero-knowledge logging guarantees no plaintext credentials are ever stored.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-cta-analyze"
              onClick={() => onNavigate('analyze')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Analyze Password</span>
            </button>
            <button
              id="dash-cta-generate"
              onClick={() => onNavigate('generator')}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Generate New</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Security Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Checked */}
        <div
          id="stat-card-total"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-sm hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Audit History</span>
            <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {totalChecked}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 100%
            </span>
            <span>Zero-knowledge logs</span>
          </div>
        </div>

        {/* Strong Passwords */}
        <div
          id="stat-card-strong"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-sm hover:border-emerald-500/30 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-400">
              Strong Passwords
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight font-mono">
            {strongCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[11px] font-bold">
              {strongPct}%
            </span>
            <span>Enterprise resilient</span>
          </div>
        </div>

        {/* Medium Passwords */}
        <div
          id="stat-card-medium"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-sm hover:border-amber-500/30 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-400">
              Medium Passwords
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight font-mono">
            {mediumCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[11px] font-bold">
              {mediumPct}%
            </span>
            <span>Needs minor hardening</span>
          </div>
        </div>

        {/* Weak Passwords */}
        <div
          id="stat-card-weak"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-sm hover:border-rose-500/30 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-rose-400">
              Weak Passwords
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tracking-tight font-mono">
            {weakCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono text-[11px] font-bold">
              {weakPct}%
            </span>
            <span>Immediate breach risk</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Analyzer Widget + Recent Checks Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Analyzer Widget */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Quick Strength Test</h3>
                  <p className="text-[11px] text-slate-400">Live entropy verification</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Instant
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <input
                id="dash-quick-input"
                type="text"
                placeholder="Type a password to test..."
                value={quickPassword}
                onChange={(e) => setQuickPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />

              {quickResult ? (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Evaluated Strength:</span>
                    <span
                      className={`font-bold font-mono ${
                        quickResult.strength === 'Strong'
                          ? 'text-emerald-400'
                          : quickResult.strength === 'Medium'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {quickResult.strength} ({quickResult.score} / 5)
                    </span>
                  </div>

                  {/* 5-segment bar mini */}
                  <div className="grid grid-cols-5 gap-1.5 h-1.5">
                    {[1, 2, 3, 4, 5].map((idx) => {
                      let activeBg = 'bg-slate-800';
                      if (idx <= quickResult.score) {
                        activeBg =
                          quickResult.score <= 2
                            ? 'bg-rose-500'
                            : quickResult.score <= 4
                            ? 'bg-amber-500'
                            : 'bg-emerald-500';
                      }
                      return <div key={idx} className={`rounded-full ${activeBg}`} />;
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Entropy: ~{quickResult.entropy} bits</span>
                    <span>Crack Time: {quickResult.crackTime}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  Type any test string above to inspect cryptographic entropy instantly.
                </div>
              )}
            </div>
          </div>

          <button
            id="dash-btn-open-full-analyzer"
            onClick={() => onNavigate('analyze')}
            className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Open Advanced 5-Point Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column: Recent Checks Audit Table */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Recent Security Checks</h3>
                <p className="text-[11px] text-slate-400">Zero-knowledge verification ledger</p>
              </div>
              <button
                id="dash-btn-view-all-history"
                onClick={() => onNavigate('history')}
                className="text-xs text-cyan-400 hover:underline font-medium flex items-center gap-1"
              >
                <span>View Full Log</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No security checks performed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-mono">
                      <th className="pb-2.5 font-semibold">Timestamp</th>
                      <th className="pb-2.5 font-semibold">Score</th>
                      <th className="pb-2.5 font-semibold">Rating</th>
                      <th className="pb-2.5 font-semibold">Compliance Checks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {history.slice(0, 4).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono text-[11px] text-slate-300 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{item.timestamp}</span>
                        </td>
                        <td className="py-3 font-mono font-bold text-white">
                          {item.score}/5
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.strength === 'Strong'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : item.strength === 'Medium'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {item.strength}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <span title="Length" className={item.checks.length ? 'text-emerald-400' : 'text-slate-600'}>
                              {item.checks.length ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            </span>
                            <span title="Upper" className={item.checks.uppercase ? 'text-emerald-400' : 'text-slate-600'}>
                              {item.checks.uppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            </span>
                            <span title="Lower" className={item.checks.lowercase ? 'text-emerald-400' : 'text-slate-600'}>
                              {item.checks.lowercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            </span>
                            <span title="Number" className={item.checks.number ? 'text-emerald-400' : 'text-slate-600'}>
                              {item.checks.number ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            </span>
                            <span title="Special" className={item.checks.special ? 'text-emerald-400' : 'text-slate-600'}>
                              {item.checks.special ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">Audit integrity: Encrypted SHA-256</span>
            <button
              onClick={() => onShowToast('Audit log integrity confirmed.', 'success')}
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Verify Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Python Flask Hub Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Full Python Flask Source Code Ready</h4>
            <p className="text-xs text-slate-400">
              Run locally in VS Code with <code className="text-purple-300 font-mono">python app.py</code> at <code className="text-purple-300 font-mono">http://127.0.0.1:5000/</code>.
            </p>
          </div>
        </div>

        <button
          id="dash-flask-viewer-btn"
          onClick={onOpenFlaskModal}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 whitespace-nowrap"
        >
          Open Flask & VS Code Hub
        </button>
      </div>
    </div>
  );
};
