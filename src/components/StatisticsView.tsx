import React from 'react';
import { ActivePage, SecurityHistoryRecord } from '../types';
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Activity,
  CheckCircle2,
  TrendingUp,
  Percent,
  ArrowRight
} from 'lucide-react';

interface StatisticsViewProps {
  history: SecurityHistoryRecord[];
  onNavigate: (page: ActivePage) => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ history, onNavigate }) => {
  const total = history.length;
  const strong = history.filter((h) => h.strength === 'Strong').length;
  const medium = history.filter((h) => h.strength === 'Medium').length;
  const weak = history.filter((h) => h.strength === 'Weak').length;

  const strongPct = total > 0 ? Math.round((strong / total) * 100) : 0;
  const mediumPct = total > 0 ? Math.round((medium / total) * 100) : 0;
  const weakPct = total > 0 ? Math.round((weak / total) * 100) : 0;

  // Calculate overall resilience index (weighted average 0 - 100%)
  const avgScore = total > 0 ? history.reduce((acc, curr) => acc + curr.score, 0) / total : 0;
  const healthIndex = Math.round((avgScore / 5) * 100);

  // Score distribution counts (0 through 5)
  const scoreCounts = [0, 1, 2, 3, 4, 5].map(
    (s) => history.filter((h) => h.score === s).length
  );
  const maxScoreCount = Math.max(...scoreCounts, 1);

  // Criteria pass rates
  const lenPass = history.filter((h) => h.checks.length).length;
  const upperPass = history.filter((h) => h.checks.uppercase).length;
  const lowerPass = history.filter((h) => h.checks.lowercase).length;
  const numPass = history.filter((h) => h.checks.number).length;
  const specialPass = history.filter((h) => h.checks.special).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Security Operations Telemetry & Statistics
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated cryptographic evaluation analytics and compliance indices.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('analyze')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
        >
          <span>Run New Check</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>TOTAL ANALYZED</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{total}</div>
          <div className="text-xs text-slate-400 mt-1">Audit logs recorded</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2 font-mono">
            <span>STRONG RATING</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {strongPct}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{strong} of {total} checked</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-2 font-mono">
            <span>MEDIUM RATING</span>
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {mediumPct}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{medium} of {total} checked</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-rose-400 mb-2 font-mono">
            <span>WEAK RATING</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {weakPct}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{weak} of {total} checked</div>
        </div>
      </div>

      {/* Two Columns: Visual Distribution Chart + Score Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strength Distribution Visual Representation */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-400" />
                <span>Password Strength Portfolio</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Distribution %</span>
            </div>

            {/* Visual SVG Ring Donut Chart */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-slate-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Strong slice (emerald) */}
                  <path
                    className="text-emerald-400 transition-all duration-700"
                    strokeDasharray={`${strongPct}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Medium slice (amber) */}
                  <path
                    className="text-amber-400 transition-all duration-700"
                    strokeDasharray={`${mediumPct}, 100`}
                    strokeDashoffset={`-${strongPct}`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Weak slice (rose) */}
                  <path
                    className="text-rose-400 transition-all duration-700"
                    strokeDasharray={`${weakPct}, 100`}
                    strokeDashoffset={`-${strongPct + mediumPct}`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold font-mono text-white leading-none">
                    {healthIndex}%
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                    Health Index
                  </span>
                </div>
              </div>

              {/* Legend with percentages and counts */}
              <div className="space-y-3 text-xs w-full max-w-[200px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Strong
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{strong} ({strongPct}%)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Medium
                  </span>
                  <span className="font-mono font-bold text-amber-400">{medium} ({mediumPct}%)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Weak
                  </span>
                  <span className="font-mono font-bold text-rose-400">{weak} ({weakPct}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Overall Credential Resilience:</span>
            <span className="font-mono text-cyan-400 font-bold">
              {healthIndex >= 80 ? 'Enterprise Grade' : healthIndex >= 50 ? 'Moderate Posture' : 'Deficient'}
            </span>
          </div>
        </div>

        {/* Right Column: Score Histogram (0 to 5) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Score Distribution (0 to 5)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Total: {total}</span>
            </div>

            <div className="space-y-3 py-2">
              {[0, 1, 2, 3, 4, 5].map((scoreVal) => {
                const count = scoreCounts[scoreVal];
                const pct = maxScoreCount > 0 ? (count / maxScoreCount) * 100 : 0;
                let colorBar = 'bg-rose-500';
                if (scoreVal >= 5) colorBar = 'bg-emerald-500';
                else if (scoreVal >= 3) colorBar = 'bg-amber-500';

                return (
                  <div key={scoreVal} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">Score {scoreVal}/5</span>
                      <span className="text-slate-200 font-bold">{count} checks</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colorBar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Average Score:</span>
            <span className="font-mono text-purple-300 font-bold">
              {avgScore.toFixed(1)} / 5.0
            </span>
          </div>
        </div>
      </div>

      {/* Criteria Compliance Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>Security Criteria Compliance Rates Across Checked Passwords</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 mb-1">Length 8+ chars</div>
            <div className="text-lg font-mono font-bold text-white">
              {total > 0 ? Math.round((lenPass / total) * 100) : 0}%
            </div>
            <div className="text-[10px] text-slate-500">{lenPass} of {total}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 mb-1">Uppercase (A-Z)</div>
            <div className="text-lg font-mono font-bold text-white">
              {total > 0 ? Math.round((upperPass / total) * 100) : 0}%
            </div>
            <div className="text-[10px] text-slate-500">{upperPass} of {total}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 mb-1">Lowercase (a-z)</div>
            <div className="text-lg font-mono font-bold text-white">
              {total > 0 ? Math.round((lowerPass / total) * 100) : 0}%
            </div>
            <div className="text-[10px] text-slate-500">{lowerPass} of {total}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 mb-1">Numbers (0-9)</div>
            <div className="text-lg font-mono font-bold text-white">
              {total > 0 ? Math.round((numPass / total) * 100) : 0}%
            </div>
            <div className="text-[10px] text-slate-500">{numPass} of {total}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 mb-1">Symbols (!@#$)</div>
            <div className="text-lg font-mono font-bold text-white">
              {total > 0 ? Math.round((specialPass / total) * 100) : 0}%
            </div>
            <div className="text-[10px] text-slate-500">{specialPass} of {total}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
