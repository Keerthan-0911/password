/**
 * SecurePass — Real-Time Password Analyzer Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('analyzer-password');
    const toggleBtn = document.getElementById('btn-toggle-analyzer-pass');
    const eyeIcon = document.getElementById('analyzer-eye-icon');
    const clearBtn = document.getElementById('btn-clear-input');
    const saveBtn = document.getElementById('btn-save-analysis');

    const charCounter = document.getElementById('char-counter');
    const entropyVal = document.getElementById('entropy-value');
    const crackTime = document.getElementById('crack-time');

    const strengthLabel = document.getElementById('strength-label');
    const scoreNumber = document.getElementById('score-number');
    const progressBar = document.getElementById('meter-progress-bar');
    const segments = [
        document.getElementById('seg-1'),
        document.getElementById('seg-2'),
        document.getElementById('seg-3'),
        document.getElementById('seg-4'),
        document.getElementById('seg-5')
    ];

    const reqLength = document.getElementById('req-length');
    const reqUpper = document.getElementById('req-upper');
    const reqLower = document.getElementById('req-lower');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    const recHeading = document.getElementById('rec-heading');
    const recText = document.getElementById('rec-text');
    const recIcon = document.getElementById('rec-icon');

    // Toggle Password Visibility
    if (toggleBtn && passwordInput && eyeIcon) {
        toggleBtn.addEventListener('click', () => {
            const isPass = passwordInput.type === 'password';
            passwordInput.type = isPass ? 'text' : 'password';
            eyeIcon.className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        });
    }

    // Clear Input
    if (clearBtn && passwordInput) {
        clearBtn.addEventListener('click', () => {
            passwordInput.value = '';
            runAnalysis('');
            passwordInput.focus();
        });
    }

    // Helper: Update Requirement element
    function setRequirementState(element, isPassed, passText, failText) {
        if (!element) return;
        const icon = element.querySelector('.req-icon i');
        const statusSpan = element.querySelector('.req-status');

        if (isPassed) {
            element.classList.add('passed');
            if (icon) icon.className = 'fa-solid fa-circle-check text-emerald';
            if (statusSpan) statusSpan.textContent = passText;
        } else {
            element.classList.remove('passed');
            if (icon) icon.className = 'fa-solid fa-circle-xmark text-rose';
            if (statusSpan) statusSpan.textContent = failText;
        }
    }

    // Calculate Crack Time Estimation
    function estimateCrackTime(length, poolSize) {
        if (length === 0 || poolSize === 0) return 'Instant';
        const combinations = Math.pow(poolSize, length);
        // Assuming modern GPU rig running 100 billion guesses/sec (10^11)
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

    // Main Real-time evaluation function
    function runAnalysis(password) {
        const length = password.length;
        if (charCounter) charCounter.textContent = `${length} chars`;

        if (length === 0) {
            if (strengthLabel) {
                strengthLabel.textContent = 'Enter Password';
                strengthLabel.className = 'meter-level-name text-muted';
            }
            if (scoreNumber) scoreNumber.textContent = '0';
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.style.backgroundColor = 'transparent';
            }
            segments.forEach(seg => {
                if (seg) seg.className = 'segment';
            });
            if (entropyVal) entropyVal.textContent = '0 bits';
            if (crackTime) crackTime.textContent = 'Instant';

            setRequirementState(reqLength, false, 'Valid length', 'Requires 8+ chars');
            setRequirementState(reqUpper, false, 'Contains uppercase', 'Missing uppercase');
            setRequirementState(reqLower, false, 'Contains lowercase', 'Missing lowercase');
            setRequirementState(reqNumber, false, 'Contains number', 'Missing numbers');
            setRequirementState(reqSpecial, false, 'Contains special', 'Missing symbols');

            if (recHeading) recHeading.textContent = 'Security Recommendation';
            if (recText) recText.textContent = 'Enter a password above to receive real-time cryptographic hardening suggestions.';
            if (recIcon) recIcon.className = 'fa-solid fa-lightbulb text-amber';
            return;
        }

        // Requirements
        const hasLength = length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

        setRequirementState(reqLength, hasLength, 'Valid length (8+ chars)', 'Requires 8+ chars');
        setRequirementState(reqUpper, hasUpper, 'Uppercase (A-Z) present', 'Missing uppercase (A-Z)');
        setRequirementState(reqLower, hasLower, 'Lowercase (a-z) present', 'Missing lowercase (a-z)');
        setRequirementState(reqNumber, hasNumber, 'Numeric digit (0-9) present', 'Missing numbers (0-9)');
        setRequirementState(reqSpecial, hasSpecial, 'Special character present', 'Missing symbols (!@#$)');

        // Score 0 to 5
        let score = 0;
        if (hasLength) score++;
        if (hasUpper) score++;
        if (hasLower) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;

        if (scoreNumber) scoreNumber.textContent = score;

        // Entropy and Crack Time Calculation
        let poolSize = 0;
        if (hasLower) poolSize += 26;
        if (hasUpper) poolSize += 26;
        if (hasNumber) poolSize += 10;
        if (hasSpecial) poolSize += 32;

        const entropy = poolSize > 0 ? Math.round(length * (Math.log2(poolSize))) : 0;
        if (entropyVal) entropyVal.textContent = `${entropy} bits`;
        if (crackTime) crackTime.textContent = estimateCrackTime(length, poolSize);

        // Strength Classification & Styling
        let level = 'Weak';
        let levelClass = 'text-rose';
        let barColor = '#f43f5e';
        let activeClass = 'active-weak';

        if (score <= 2) {
            level = 'Weak (High Risk)';
            levelClass = 'text-rose';
            barColor = '#f43f5e';
            activeClass = 'active-weak';
        } else if (score <= 4) {
            level = 'Medium (Acceptable)';
            levelClass = 'text-amber';
            barColor = '#f59e0b';
            activeClass = 'active-medium';
        } else {
            level = 'Strong (Enterprise Defense)';
            levelClass = 'text-emerald';
            barColor = '#10b981';
            activeClass = 'active-strong';
        }

        if (strengthLabel) {
            strengthLabel.textContent = level;
            strengthLabel.className = `meter-level-name ${levelClass}`;
        }

        if (progressBar) {
            progressBar.style.width = `${(score / 5) * 100}%`;
            progressBar.style.backgroundColor = barColor;
        }

        segments.forEach((seg, index) => {
            if (!seg) return;
            if (index < score) {
                seg.className = `segment ${activeClass}`;
            } else {
                seg.className = 'segment';
            }
        });

        // Dynamic Recommendations
        const recs = [];
        if (!hasLength) recs.push('Increase length to at least 8 characters (16+ recommended for critical accounts).');
        if (!hasSpecial) recs.push('Add a symbol such as !, @, #, $, or & to prevent dictionary rainbow tables.');
        if (!hasNumber) recs.push('Include numeric digits (0-9) to expand character pool entropy.');
        if (!hasUpper) recs.push('Add capital letters (A-Z) to resist case-insensitive attacks.');
        if (!hasLower) recs.push('Include lowercase letters (a-z).');

        if (recs.length === 0) {
            if (recHeading) recHeading.textContent = 'Cryptographically Sound';
            if (recText) recText.textContent = 'Excellent! This password fulfills all enterprise cybersecurity guidelines and resists known dictionary attacks.';
            if (recIcon) recIcon.className = 'fa-solid fa-circle-check text-emerald';
        } else {
            if (recHeading) recHeading.textContent = 'Recommended Enhancements';
            if (recText) recText.textContent = recs.join(' ');
            if (recIcon) recIcon.className = 'fa-solid fa-lightbulb text-amber';
        }
    }

    // Listen to typing
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            runAnalysis(e.target.value);
        });
    }

    // Save to Audit History (AJAX)
    if (saveBtn && passwordInput) {
        saveBtn.addEventListener('click', async () => {
            const password = passwordInput.value;
            if (!password) {
                showToast('Please type a password first before recording to audit logs.', 'error');
                return;
            }

            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password, save_to_history: true })
                });

                if (response.ok) {
                    showToast('Analysis metadata saved to history. Plaintext password was securely discarded.', 'success');
                } else {
                    showToast('Failed to record analysis log.', 'error');
                }
            } catch (err) {
                showToast('Server communication error.', 'error');
            }
        });
    }
});
