import React from 'react';
import { ActivePage } from '../types';
import { ShieldCheck, LogIn, Home, Lock, ArrowRight } from 'lucide-react';

interface LogoutViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const LogoutView: React.FC<LogoutViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/15">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Successfully Logged Out
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Your session has been securely closed. All cached credential fragments in volatile memory have been purged according to zero-knowledge protocol.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Session Token Terminated & Flushed</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="btn-logout-relogin"
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login Again</span>
          </button>

          <button
            id="btn-logout-home"
            onClick={() => onNavigate('landing')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
