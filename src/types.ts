export interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export interface PasswordAnalysisResult {
  score: number; // 0 - 5
  strength: 'Weak' | 'Medium' | 'Strong';
  statusClass: 'weak' | 'medium' | 'strong';
  checks: PasswordRequirements;
  recommendations: string;
  charCount: number;
  entropy: number;
  crackTime: string;
}

export interface SecurityHistoryRecord {
  id: string;
  timestamp: string;
  score: number;
  strength: 'Weak' | 'Medium' | 'Strong';
  statusClass: 'weak' | 'medium' | 'strong';
  checks: PasswordRequirements;
  recommendations: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUpper: boolean;
  requireLower: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
}

export interface UserProfile {
  username: string;
  email: string;
  role: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export type ActivePage = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'analyze'
  | 'generator'
  | 'history'
  | 'statistics'
  | 'settings'
  | 'logout';
