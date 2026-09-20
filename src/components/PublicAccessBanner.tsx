import React, { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, Laptop, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface PublicAccessBannerProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PublicAccessBanner: React.FC<PublicAccessBannerProps> = ({ onShowToast }) => {
  const [copied, setCopied] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // The permanent public shared URL accessible from ANY laptop/desktop and ANY Gmail
  const publicUrl = window.location.origin.includes('ais-dev-')
    ? window.location.origin.replace('ais-dev-', 'ais-pre-')
    : window.location.origin;

  const isDevUrl = window.location.origin.includes('ais-dev-');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      onShowToast('Public Shared URL copied! Send this link to work on any laptop/desktop.', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Could not copy automatically. URL: ' + publicUrl, 'info');
    }
  };

  if (dismissed) return null;

  return (
    <>
      <div
        id="cross-device-access-banner"
        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-white">
              <span>Universal Access & Multi-Gmail Deployment</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Ready for All Laptops & Gmails
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              {isDevUrl
                ? 'To prevent "Page Not Found" on other laptops or Gmail accounts, share the Public App URL below instead of the private dev URL.'
                : 'This web app is globally live! Anyone on any desktop, laptop, or mobile with any Gmail account can access it.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <button
            id="btn-copy-public-link"
            onClick={handleCopy}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Public Link!' : 'Copy Public Share Link'}</span>
          </button>

          <button
            id="btn-open-deploy-guide"
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Why "Page Not Found"?</span>
            <span className="md:hidden">Help</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deployment & Cross-Device Access Explanation Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Why other laptops showed "Page Not Found"
                  </h3>
                  <p className="text-xs text-slate-400">
                    How Google AI Studio Cloud Run hosting permissions work
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2">
                <div className="font-bold flex items-center gap-2 text-amber-300 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Why You Got "Page Not Found" (Broken Link)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  In Google AI Studio, public links (<code className="font-mono bg-amber-950/60 px-1 py-0.5 rounded text-amber-300">ais-pre-...</code>) are <strong>not activated yet</strong> until you click the <strong className="text-white font-semibold">Share</strong> button in AI Studio! Navigating to it beforehand causes Google Cloud Run to say <span className="font-mono text-rose-300">"404: The requested URL was not found on this server"</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-slate-200 space-y-3">
                <div className="font-bold flex items-center gap-2 text-cyan-300 text-sm">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>How to Overcome This (3 Simple Steps)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs">
                  <li className="leading-relaxed">
                    <strong className="text-white">Step 1:</strong> Look at the top right header of your <strong className="text-cyan-400">Google AI Studio</strong> browser tab.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-white">Step 2:</strong> Click the <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[11px]">Share</span> button.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-white">Step 3:</strong> Select <strong className="text-white">"Anyone with the link"</strong> and click <strong className="text-white">"Create Link"</strong> or <strong className="text-white">"Publish"</strong>.
                  </li>
                </ol>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  ✅ Once shared, that link becomes active immediately and can be opened by <strong>any Gmail user on any laptop, desktop, or phone</strong> without showing "Page Not Found"!
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>Your App's Public Shared Link (Active After Sharing):</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[11px] text-cyan-300 break-all select-all flex items-center justify-between gap-2">
                  <span>{publicUrl}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Public Link</span>
              </button>
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
