import { PasswordAnalysisResult, PasswordPolicy, SecurityHistoryRecord } from '../types';

export const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUpper: true,
  requireLower: true,
  requireNumber: true,
  requireSpecial: true,
};

export function estimateCrackTime(length: number, poolSize: number): string {
  if (length === 0 || poolSize === 0) return 'Instant';
  const combinations = Math.pow(poolSize, length);
  // Assuming 100 billion guesses/sec (10^11) for modern multi-GPU offline cracking
  const guessesPerSec = 1e11;
  const seconds = combinations / (2 * guessesPerSec);

  if (seconds < 1) return 'Instant (< 1s)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1000000) return `${Math.round(seconds / (31536000 * 1000))}k centuries`;
  return 'Millions of Years';
}

export function analyzePassword(password: string, policy: PasswordPolicy = DEFAULT_POLICY): PasswordAnalysisResult {
  const length = password.length;

  const hasLength = length >= policy.minLength;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  let score = 0;
  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  let statusClass: 'weak' | 'medium' | 'strong' = 'weak';

  if (score <= 2) {
    strength = 'Weak';
    statusClass = 'weak';
  } else if (score <= 4) {
    strength = 'Medium';
    statusClass = 'medium';
  } else {
    strength = 'Strong';
    statusClass = 'strong';
  }

  // Pool size calculation for entropy
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 32;

  const entropy = poolSize > 0 && length > 0 ? Math.round(length * Math.log2(poolSize)) : 0;
  const crackTime = estimateCrackTime(length, poolSize);

  // Recommendations
  const recs: string[] = [];
  if (!hasLength) {
    recs.push(`Increase password length to at least ${policy.minLength} characters.`);
  }
  if (!hasSpecial) {
    recs.push('Add at least one special character (!@#$%^&*).');
  }
  if (!hasNumber) {
    recs.push('Add numeric digits (0-9) to widen character diversity.');
  }
  if (!hasUpper) {
    recs.push('Add uppercase capital letters (A-Z).');
  }
  if (!hasLower) {
    recs.push('Include lowercase letters (a-z).');
  }

  const recommendations = recs.length === 0
    ? 'Excellent! Your password meets all enterprise-grade complexity guidelines.'
    : recs.join(' ');

  return {
    score,
    strength,
    statusClass,
    checks: {
      length: hasLength,
      uppercase: hasUpper,
      lowercase: hasLower,
      number: hasNumber,
      special: hasSpecial,
    },
    recommendations,
    charCount: length,
    entropy,
    crackTime,
  };
}

export function generateSecurePassword(
  length: number,
  options: {
    upper: boolean;
    lower: boolean;
    numbers: boolean;
    symbols: boolean;
    avoidAmbiguous?: boolean;
  }
): string {
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.avoidAmbiguous) {
    uppercase = uppercase.replace(/[IO]/g, '');
    lowercase = lowercase.replace(/[lo]/g, '');
    numbers = numbers.replace(/[01]/g, '');
  }

  let pool = '';
  const guaranteed: string[] = [];

  const getRandomChar = (str: string) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return str[array[0] % str.length];
  };

  if (options.upper) {
    pool += uppercase;
    guaranteed.push(getRandomChar(uppercase));
  }
  if (options.lower) {
    pool += lowercase;
    guaranteed.push(getRandomChar(lowercase));
  }
  if (options.numbers) {
    pool += numbers;
    guaranteed.push(getRandomChar(numbers));
  }
  if (options.symbols) {
    pool += symbols;
    guaranteed.push(getRandomChar(symbols));
  }

  if (!pool) {
    pool = lowercase + uppercase + numbers;
    guaranteed.push(getRandomChar(lowercase));
  }

  const resultChars = [...guaranteed];
  const remaining = Math.max(0, length - guaranteed.length);

  for (let i = 0; i < remaining; i++) {
    resultChars.push(getRandomChar(pool));
  }

  // Fisher-Yates shuffle with cryptographic random values
  for (let i = resultChars.length - 1; i > 0; i--) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const j = array[0] % (i + 1);
    [resultChars[i], resultChars[j]] = [resultChars[j], resultChars[i]];
  }

  return resultChars.join('');
}

export const INITIAL_SAMPLE_HISTORY: SecurityHistoryRecord[] = [
  {
    id: 'chk-1710892800-1',
    timestamp: '2025-03-18 14:32:10',
    score: 5,
    strength: 'Strong',
    statusClass: 'strong',
    checks: { length: true, uppercase: true, lowercase: true, number: true, special: true },
    recommendations: 'Excellent! Your password meets all standard complexity guidelines.',
  },
  {
    id: 'chk-1710892400-2',
    timestamp: '2025-03-18 11:20:45',
    score: 4,
    strength: 'Medium',
    statusClass: 'medium',
    checks: { length: true, uppercase: true, lowercase: true, number: true, special: false },
    recommendations: 'Add at least one special character (!@#$%^&*) to strengthen this password.',
  },
  {
    id: 'chk-1710891000-3',
    timestamp: '2025-03-17 19:05:12',
    score: 2,
    strength: 'Weak',
    statusClass: 'weak',
    checks: { length: false, uppercase: true, lowercase: true, number: false, special: false },
    recommendations: 'Increase length to at least 8 characters and include numbers and symbols.',
  },
  {
    id: 'chk-1710890000-4',
    timestamp: '2025-03-17 09:14:33',
    score: 5,
    strength: 'Strong',
    statusClass: 'strong',
    checks: { length: true, uppercase: true, lowercase: true, number: true, special: true },
    recommendations: 'Strong cryptographic complexity verified.',
  },
];
