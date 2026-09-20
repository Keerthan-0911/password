import React from 'react';
import { ActivePage } from '../types';
import {
  Shield,
  Lock,
  Wand2,
  BarChart3,
  History,
  Sliders,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Cpu,
  Zap
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (page: ActivePage) => void;
  onOpenFlaskModal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenFlaskModal }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Shield className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Secure<span className="text-cyan-400">Pass</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#why-security" className="hover:text-cyan-400 transition-colors">Security</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <button
            id="landing-flask-btn"
            onClick={onOpenFlaskModal}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
          >
            <Cpu className="w-4 h-4" />
            <span>Flask & VS Code Code</span>
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            id="landing-signin-btn"
            onClick={() => onNavigate('login')}
            className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
          >
            Sign In
          </button>
          <button
            id="landing-get-started-btn"
            onClick={() => onNavigate('login')}
            className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 py-20 lg:py-28 overflow-hidden text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center">
        {/* Background glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Enterprise Password Strength Analyzer & Security Dashboard
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Build Stronger Passwords.<br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Protect Your Digital Life.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          SecurePass analyzes password strength and helps you create stronger credentials. Powered by real-time cryptographic entropy audits and hardware-level CSPRNG generators.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            id="hero-cta-login"
            onClick={() => onNavigate('login')}
            className="px-6 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-cta-analyze"
            onClick={() => onNavigate('analyze')}
            className="px-6 py-3.5 rounded-xl text-base font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 backdrop-blur-md transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Analyze Password</span>
          </button>
        </div>

        {/* Live Metrics Telemetry Frame */}
        <div className="w-full max-w-3xl rounded-2xl bg-slate-900/60 border border-cyan-500/30 p-6 backdrop-blur-xl shadow-2xl shadow-cyan-950/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2">Live Cryptographic Posture Telemetry</span>
            </div>
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Zero Plaintext Storage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-2xl font-mono font-extrabold text-cyan-400">99.8%</div>
              <div className="text-xs text-slate-400 mt-1">Brute-Force Resistance</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-2xl font-mono font-extrabold text-emerald-400">0.00s</div>
              <div className="text-xs text-slate-400 mt-1">Plaintext Retained</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-2xl font-mono font-extrabold text-purple-400">256-bit</div>
              <div className="text-xs text-slate-400 mt-1">Hardware CSPRNG Pool</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Why Password Security Matters */}
      <section id="why-security" className="py-20 px-6 lg:px-12 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Why Password Security Matters
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Over 80% of data breaches involve compromised, weak, or reused passwords. Strengthening your authentication posture is your frontline defense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Strong Passwords</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Mitigate dictionary attacks and automated credential stuffing with multi-character diversity and high-entropy length requirements.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure Generation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Produce unpredictable credentials using system hardware entropy rather than pseudo-random functions, defying predictability.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Security Insights</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Understand vulnerability vectors with immediate crack-time estimations, character distribution audits, and clear remediation steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Three seamless steps designed with absolute zero-knowledge privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-4xl font-mono font-extrabold text-cyan-500/20 mb-3">01</div>
              <h4 className="text-base font-bold text-white mb-2">Enter Password</h4>
              <p className="text-sm text-slate-400">
                Type or paste any candidate credential in the real-time analyzer box. Memory is never committed to persistent logs.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-4xl font-mono font-extrabold text-purple-500/20 mb-3">02</div>
              <h4 className="text-base font-bold text-white mb-2">Analyze Strength</h4>
              <p className="text-sm text-slate-400">
                The 5-tier evaluation engine computes length, character sets, entropy bits, and returns an animated 5-point score.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-4xl font-mono font-extrabold text-emerald-500/20 mb-3">03</div>
              <h4 className="text-base font-bold text-white mb-2">Improve Security</h4>
              <p className="text-sm text-slate-400">
                Follow tailored suggestions or generate a high-entropy uncrackable password with one click using our CSPRNG generator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section id="features" className="py-20 px-6 lg:px-12 border-t border-slate-900 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
              Comprehensive Security Features
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              All tools required to audit, strengthen, and manage credential posture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex gap-4">
              <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Password Analyzer</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time dynamic strength meter with 5 criteria checks, crack times, and hardening advice.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex gap-4">
              <KeyRound className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Secure Generator</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate 8–50 char passwords using Python <code>secrets</code> / CSPRNG with ambiguity filters.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex gap-4">
              <History className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Security History</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Audit logs tracking timestamps and score ratings without ever storing actual passwords.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex gap-4">
              <BarChart3 className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Security Statistics</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Visual doughnut charts and score distribution histograms powered by Chart.js.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex gap-4">
              <Sliders className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Password Policy</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Customize minimum length thresholds and symbol mandates that dynamically govern the analyzer.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex gap-4">
              <Cpu className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Flask / VS Code Ready</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete Python project files included ready to run locally via <code>python app.py</code>.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-16 p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 text-center relative overflow-hidden">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">
              Ready to fortify your digital credentials?
            </h3>
            <p className="text-sm lg:text-base text-slate-300 max-w-xl mx-auto mb-8">
              Access the SecurePass security operations dashboard now and elevate your defense perimeter.
            </p>
            <button
              id="cta-bottom-login"
              onClick={() => onNavigate('login')}
              className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 transition-all inline-flex items-center gap-2"
            >
              <span>Launch SecurePass Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 border-t border-slate-900 bg-slate-950 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>SecurePass Enterprise Cybersecurity</span>
        </div>
        <div>
          &copy; 2025 SecurePass Technologies. Zero-Knowledge Password Architecture.
        </div>
      </footer>
    </div>
  );
};
