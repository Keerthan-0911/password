import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-cyan-500/40 text-cyan-300';
        let bgGlow = 'rgba(6, 182, 212, 0.15)';
        let Icon = Info;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40 text-emerald-300';
          bgGlow = 'rgba(16, 185, 129, 0.15)';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/40 text-rose-300';
          bgGlow = 'rgba(244, 63, 94, 0.15)';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/40 text-amber-300';
          bgGlow = 'rgba(245, 158, 11, 0.15)';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 15px ${bgGlow}` }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg border backdrop-blur-md text-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-slate-200 font-medium">{toast.message}</span>
            </div>
            <button
              id={`dismiss-toast-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
