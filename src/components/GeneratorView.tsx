import React, { useState, useEffect } from 'react';
import { ActivePage, PasswordPolicy } from '../types';
import { generateSecurePassword } from '../utils/securityEngine';
import {
  KeyRound,
  Copy,
  RefreshCw,
  ShieldCheck,
  Zap,
  Sliders,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

interface GeneratorViewProps {
  policy: PasswordPolicy;
  onNavigate: (page: ActivePage) => void;
  onTransferToAnalyzer: (pwd: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  onNavigate,
  onTransferToAnalyzer,
  onShowToast,
}) => {
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);

  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [hasCopied, setHasCopied] = useState(false);

  // Generate password whenever configuration changes or triggered
  const handleGenerate = () => {
    const pwd = generateSecurePassword(length, {
      upper: includeUpper,
      lower: includeLower,
      numbers: includeNumbers,
      symbols: includeSymbols,
      avoidAmbiguous,
    });
    setGeneratedPassword(pwd);
    setHasCopied(false);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, avoidAmbiguous]);

  const handleCopy = async () => {
    if (!generatedPassword) return;

    try {
      await navigator.clipboard.writeText(generatedPassword);
      setHasCopied(true);
      onShowToast('Password copied to clipboard securely!', 'success');
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = generatedPassword;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setHasCopied(true);
      onShowToast('Password copied to clipboard!', 'success');
      setTimeout(() => setHasCopied(false), 2500);
    }
  };

  const handleTestInAnalyzer = () => {
    if (!generatedPassword) return;
    onTransferToAnalyzer(generatedPassword);
    onNavigate('analyze');
    onShowToast('Transferred password to Analyzer.', 'info');
  };

  // Character coloring helper
  const renderColoredChars = (str: string) => {
    return str.split('').map((char, index) => {
      let colorClass = 'text-slate-100';
      if (/[0-9]/.test(char)) {
        colorClass = 'text-sky-400'; // Numbers
      } else if (/[A-Z]/.test(char)) {
        colorClass = 'text-purple-400'; // Uppercase
      } else if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(char)) {
        colorClass = 'text-emerald-400'; // Symbols
      } else {
        colorClass = 'text-slate-200'; // Lowercase
      }

      return (
        <span key={index} className={`font-mono font-bold ${colorClass}`}>
          {char}
        </span>
      );
    });
  };

  // Calculate approximate entropy
  let poolSize = 0;
  if (includeUpper) poolSize += 26;
  if (includeLower) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += 30;
  if (avoidAmbiguous) poolSize -= 6;
  const entropyBits = Math.round(length * Math.log2(Math.max(poolSize, 2)));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              CSPRNG Cryptographic Password Generator
            </h2>
            <p className="text-xs text-slate-400">
              Generates high-entropy uncrackable credentials using hardware-grade pseudo-random seeds.
            </p>
          </div>
        </div>

        <button
          id="btn-gen-refresh-header"
          onClick={handleGenerate}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Large Generated Password Display Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Generated Cryptographic Credential
            </span>
            <span className="font-mono text-slate-400">
              {generatedPassword.length} characters
            </span>
          </div>

          {/* Secure Display Field */}
          <div
            id="generated-password-box"
            className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner"
          >
            <div className="text-lg sm:text-2xl tracking-wider select-all break-all text-left font-mono">
              {renderColoredChars(generatedPassword)}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                id="btn-copy-password"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  hasCopied
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                }`}
              >
                {hasCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Password</span>
                  </>
                )}
              </button>

              <button
                id="btn-regenerate-password"
                onClick={handleGenerate}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Regenerate password"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Character category legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-3 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> Uppercase (A-Z)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-200" /> Lowercase (a-z)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Numbers (0-9)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Symbols (!@#$)
            </span>
          </div>
        </div>

        {/* Security Metrics Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Strength Rating:
            </span>
            <span className="font-bold font-mono text-emerald-400">
              {length >= 14 ? 'Strong (5/5)' : 'Medium (3-4/5)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Estimated Entropy:
            </span>
            <span className="font-bold font-mono text-cyan-400">
              ~{entropyBits} bits
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Algorithm:
            </span>
            <span className="font-mono text-purple-300">
              CSPRNG Fisher-Yates
            </span>
          </div>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Generator Configuration & Entropy Rules</span>
        </h3>

        {/* Length Slider synced with number input */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="length-slider" className="text-xs font-semibold text-slate-300">
              Password Length (8 — 50 characters)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="length-number-input"
                type="number"
                min={8}
                max={50}
                value={length}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setLength(Math.min(50, Math.max(8, val)));
                  }
                }}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-cyan-400 text-center focus:outline-none focus:border-cyan-400"
              />
              <span className="text-xs text-slate-500 font-mono">chars</span>
            </div>
          </div>

          <input
            id="length-slider"
            type="range"
            min={8}
            max={50}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>8 (Minimum)</span>
            <span>16 (Recommended)</span>
            <span>24 (Paranoid)</span>
            <span>50 (Maximum)</span>
          </div>
        </div>

        {/* Checkbox Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              id="opt-upper"
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Uppercase Letters (A-Z)</div>
              <div className="text-[11px] text-slate-400">ABCDEF...</div>
            </div>
          </label>

          <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              id="opt-lower"
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Lowercase Letters (a-z)</div>
              <div className="text-[11px] text-slate-400">abcdef...</div>
            </div>
          </label>

          <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              id="opt-numbers"
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Numbers (0-9)</div>
              <div className="text-[11px] text-slate-400">0123456789</div>
            </div>
          </label>

          <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              id="opt-symbols"
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Special Characters (!@#$)</div>
              <div className="text-[11px] text-slate-400">!@#$%^&*()_+-=[]</div>
            </div>
          </label>

          <label className="sm:col-span-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              id="opt-ambiguous"
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={(e) => setAvoidAmbiguous(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Exclude Ambiguous Characters
              </div>
              <div className="text-[11px] text-slate-400">
                Filters confusing pairs like O / 0, l / 1 / I to eliminate manual typing errors.
              </div>
            </div>
          </label>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
          <button
            id="btn-test-in-analyzer"
            onClick={handleTestInAnalyzer}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Test This Password in Analyzer Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-copy-secondary"
            onClick={handleCopy}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy to Clipboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
