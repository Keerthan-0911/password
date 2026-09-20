import React, { useState } from 'react';
import { ActivePage, SecurityHistoryRecord } from '../types';
import {
  History,
  Search,
  Filter,
  Trash2,
  Download,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Lock,
  FileSpreadsheet
} from 'lucide-react';

interface HistoryViewProps {
  history: SecurityHistoryRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onNavigate: (page: ActivePage) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onDeleteRecord,
  onNavigate,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStrength, setFilterStrength] = useState<'All' | 'Strong' | 'Medium' | 'Weak'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score-high' | 'score-low'>('newest');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter & Search
  let filtered = history.filter((item) => {
    const matchesFilter = filterStrength === 'All' || item.strength === filterStrength;
    const matchesSearch =
      item.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recommendations.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.strength.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return b.timestamp.localeCompare(a.timestamp);
    if (sortBy === 'oldest') return a.timestamp.localeCompare(b.timestamp);
    if (sortBy === 'score-high') return b.score - a.score;
    if (sortBy === 'score-low') return a.score - b.score;
    return 0;
  });

  const handleExportJSON = () => {
    if (history.length === 0) {
      onShowToast('No audit logs to export.', 'error');
      return;
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `securepass_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onShowToast('Exported audit history JSON log successfully.', 'success');
  };

  const handleConfirmClear = () => {
    onClearHistory();
    setShowClearConfirm(false);
    onShowToast('Audit history cleared.', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Zero-Knowledge Audit History
            </h2>
            <p className="text-xs text-slate-400">
              Complete audit ledger of candidate strength analyses and compliance checks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-history"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            title="Download audit logs in JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          {history.length > 0 && (
            <button
              id="btn-clear-history-trigger"
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3 text-xs text-cyan-300">
        <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Strict Zero-Knowledge Guarantee: </span>
          SecurePass never stores or transmits actual plaintext passwords. Audit logs only preserve timestamps, 5-point scores, compliance checks (passed/failed), and recommendations.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="history-search-input"
            type="text"
            placeholder="Search by date, score, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Strength Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            {(['All', 'Strong', 'Medium', 'Weak'] as const).map((strength) => (
              <button
                key={strength}
                id={`filter-btn-${strength.toLowerCase()}`}
                onClick={() => setFilterStrength(strength)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterStrength === strength
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {strength}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            id="history-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score-high">Highest Score</option>
            <option value="score-low">Lowest Score</option>
          </select>
        </div>
      </div>

      {/* Main History Table / Empty State */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 px-6 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto border border-slate-700/80">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No password checks yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test passwords in the real-time analyzer or save check logs to populate your zero-knowledge security history.
            </p>
            <button
              id="btn-history-empty-cta"
              onClick={() => onNavigate('analyze')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2"
            >
              <span>Analyze Your First Password</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-semibold">Audit Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold">Rating Score</th>
                  <th className="py-3.5 px-4 font-semibold">Classification</th>
                  <th className="py-3.5 px-4 font-semibold">Compliance Checks</th>
                  <th className="py-3.5 px-5 font-semibold">Audit Note</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.timestamp}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-extrabold text-white text-sm">
                      {item.score} / 5
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          item.strength === 'Strong'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : item.strength === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {item.strength === 'Strong' ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : item.strength === 'Medium' ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                        <span>{item.strength}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span
                          title={item.checks.length ? 'Length: Passed' : 'Length: Failed'}
                          className={`p-1 rounded ${item.checks.length ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}
                        >
                          Len
                        </span>
                        <span
                          title={item.checks.uppercase ? 'Upper: Passed' : 'Upper: Failed'}
                          className={`p-1 rounded ${item.checks.uppercase ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}
                        >
                          Upp
                        </span>
                        <span
                          title={item.checks.lowercase ? 'Lower: Passed' : 'Lower: Failed'}
                          className={`p-1 rounded ${item.checks.lowercase ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}
                        >
                          Low
                        </span>
                        <span
                          title={item.checks.number ? 'Number: Passed' : 'Number: Failed'}
                          className={`p-1 rounded ${item.checks.number ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}
                        >
                          Num
                        </span>
                        <span
                          title={item.checks.special ? 'Symbol: Passed' : 'Symbol: Failed'}
                          className={`p-1 rounded ${item.checks.special ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}
                        >
                          Sym
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-400 text-xs max-w-xs truncate">
                      {item.recommendations}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        id={`btn-delete-log-${item.id}`}
                        onClick={() => onDeleteRecord(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete this audit record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clear History */}
      {showClearConfirm && (
        <div
          id="clear-confirm-modal"
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Clear Security Audit History?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete all {history.length} audit logs from your local session. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn-cancel-clear-history"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-clear-history"
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition-all"
              >
                Yes, Purge History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
