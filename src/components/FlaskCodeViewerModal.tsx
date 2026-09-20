import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  Terminal,
  FileCode,
  FolderTree,
  ExternalLink
} from 'lucide-react';

interface FlaskCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const FILES = [
  {
    name: 'app.py',
    lang: 'python',
    desc: 'Main Flask server, routing, secrets CSPRNG generator, and REST API',
    content: `# -*- coding: utf-8 -*-
"""
SecurePass — Password Strength Analyzer & Security Dashboard
A professional cybersecurity web application built with Python Flask.
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import json
import secrets
import string
import math
from datetime import datetime

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
HISTORY_FILE = os.path.join(DATA_DIR, 'history.json')

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_history(history_list):
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(history_list, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")

def estimate_crack_time(length, pool_size):
    if length == 0 or pool_size == 0:
        return "Instant"
    combinations = pool_size ** length
    guesses_per_second = 10**11  # 100 billion guesses/sec GPU rig
    seconds = combinations / (2 * guesses_per_second)

    if seconds < 1:
        return "Instant (< 1s)"
    elif seconds < 60:
        return f"{int(seconds)} seconds"
    elif seconds < 3600:
        return f"{int(seconds // 60)} minutes"
    elif seconds < 86400:
        return f"{int(seconds // 3600)} hours"
    elif seconds < 31536000:
        return f"{int(seconds // 86400)} days"
    elif seconds < 31536000 * 100:
        return f"{int(seconds // 31536000)} years"
    elif seconds < 31536000 * 1000000:
        return f"{int(seconds // (31536000 * 1000))}k centuries"
    return "Millions of Years"

def analyze_password_strength(password, min_length=8):
    length = len(password)
    has_length = length >= min_length
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_number = any(c.isdigit() for c in password)
    special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?~"
    has_special = any(c in special_chars for c in password)

    score = 0
    if has_length: score += 1
    if has_upper: score += 1
    if has_lower: score += 1
    if has_number: score += 1
    if has_special: score += 1

    if score <= 2:
        strength = "Weak"
        status_class = "weak"
    elif score <= 4:
        strength = "Medium"
        status_class = "medium"
    else:
        strength = "Strong"
        status_class = "strong"

    pool_size = 0
    if has_lower: pool_size += 26
    if has_upper: pool_size += 26
    if has_number: pool_size += 10
    if has_special: pool_size += 32

    entropy = round(length * math.log2(pool_size)) if pool_size > 0 and length > 0 else 0
    crack_time = estimate_crack_time(length, pool_size)

    recs = []
    if not has_length: recs.append(f"Increase length to at least {min_length} characters.")
    if not has_special: recs.append("Add special characters (!@#$%) to resist dictionary attacks.")
    if not has_number: recs.append("Include digits (0-9) to widen character diversity.")
    if not has_upper: recs.append("Add capital uppercase letters (A-Z).")
    if not has_lower: recs.append("Include lowercase letters (a-z).")

    recommendations = " ".join(recs) if recs else "Excellent! Password meets all enterprise guidelines."

    return {
        "score": score,
        "strength": strength,
        "status_class": status_class,
        "checks": {
            "length": has_length,
            "uppercase": has_upper,
            "lowercase": has_lower,
            "number": has_number,
            "special": has_special
        },
        "recommendations": recommendations,
        "entropy": entropy,
        "crack_time": crack_time
    }

if __name__ == '__main__':
    # Starts server at http://127.0.0.1:5000/
    app.run(debug=True, host='127.0.0.1', port=5000)
`
  },
  {
    name: 'requirements.txt',
    lang: 'text',
    desc: 'Python dependency specifications',
    content: `Flask>=2.3.3
Werkzeug>=2.3.7
Jinja2>=3.1.2
`
  },
  {
    name: 'data/history.json',
    lang: 'json',
    desc: 'Zero-knowledge audit logs (never contains plaintext passwords)',
    content: `[
  {
    "id": "chk-1710892800-1",
    "timestamp": "2025-03-18 14:32:10",
    "score": 5,
    "strength": "Strong",
    "status_class": "strong",
    "checks": {
      "length": true,
      "uppercase": true,
      "lowercase": true,
      "number": true,
      "special": true
    },
    "recommendations": "Excellent! Your password meets all standard complexity guidelines."
  },
  {
    "id": "chk-1710892400-2",
    "timestamp": "2025-03-18 11:20:45",
    "score": 4,
    "strength": "Medium",
    "status_class": "medium",
    "checks": {
      "length": true,
      "uppercase": true,
      "lowercase": true,
      "number": true,
      "special": false
    },
    "recommendations": "Add at least one special character (!@#$%^&*) to strengthen this password."
  }
]`
  },
  {
    name: 'README.md',
    lang: 'markdown',
    desc: 'VS Code setup, installation, and run guide',
    content: `# Running SecurePass in VS Code

1. Open folder in VS Code
2. Open terminal (Ctrl + ~ or Terminal menu)
3. Install dependencies:
   pip install -r requirements.txt
4. Start the Flask application:
   python app.py
5. Open your browser at:
   http://127.0.0.1:5000/
`
  }
];

export const FlaskCodeViewerModal: React.FC<FlaskCodeViewerModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [selectedFile, setSelectedFile] = useState(FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      onShowToast(`Copied ${selectedFile.name} to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Could not copy to clipboard.', 'error');
    }
  };

  return (
    <div
      id="flask-code-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 animate-in fade-in"
    >
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>SecurePass Python Flask Repository</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Ready for VS Code
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Run locally with <code className="text-purple-300 font-mono">python app.py</code> at <code className="text-purple-300 font-mono">http://127.0.0.1:5000/</code>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : `Copy ${selectedFile.name}`}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: File list + Editor view */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File sidebar */}
          <div className="w-full md:w-64 bg-slate-900/40 border-r border-slate-800 p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-500 font-mono">
              Project Files
            </div>
            {FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-800/80 px-2 space-y-2 text-[11px] text-slate-400">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>VS Code Terminal:</span>
              </div>
              <pre className="p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-cyan-300 select-all border border-slate-800">
                pip install -r requirements.txt{'\n'}python app.py
              </pre>
            </div>
          </div>

          {/* Code display */}
          <div className="flex-1 flex flex-col bg-slate-950/80 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-cyan-400">{selectedFile.name}</span>
              <span className="text-[11px] text-slate-500">{selectedFile.desc}</span>
            </div>

            <pre className="flex-1 p-5 overflow-auto text-xs font-mono text-slate-200 leading-relaxed selection:bg-purple-500 selection:text-white">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
